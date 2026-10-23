import { splitMargin } from './css-shorthands';
import { reportCssDiagnostic } from './diagnostics';

/** Native hosts supply logical (device-independent) pixels, scoped to one view subtree. */
export interface CssSafeAreaInsets {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface CssEnvironmentHost {
  readonly parent?: CssEnvironmentHost | null;
  on?(event: string, callback: () => void): void;
  off?(event: string, callback: () => void): void;
}

/** The host owns window selection, native observation and subscription teardown. */
export interface CssEnvironmentSource {
  read(): CssSafeAreaInsets | null;
  subscribe(changed: () => void): () => void;
}

const environments = new WeakMap<object, CssSafeAreaInsets>();
const bindings = new WeakMap<object, object>();
interface AutomaticSource { create: () => CssEnvironmentSource; starting: boolean; stop?: () => void; }
const automaticSources = new WeakMap<object, AutomaticSource>();

/** Core host lifecycle adapter: observe lazily, only when a subtree actually uses env(). */
export function registerAutomaticCssEnvironment(host: CssEnvironmentHost, create: () => CssEnvironmentSource): () => void {
  const entry: AutomaticSource = { create, starting: false };
  automaticSources.set(host, entry);
  refreshCssEnvironment(host);
  return () => {
    if (automaticSources.get(host) !== entry) return;
    automaticSources.delete(host);
    entry.stop?.();
  };
}

function ensureAutomaticEnvironment(owner?: CssEnvironmentHost): void {
  for (let host = owner; host; host = host.parent ?? undefined) {
    const entry = automaticSources.get(host);
    if (entry) {
      if (!entry.stop && !entry.starting && !bindings.has(host) && !environments.has(host)) {
        entry.starting = true;
        try { entry.stop = bindCssEnvironment(host, entry.create()); }
        finally { entry.starting = false; }
      }
      return;
    }
    if (environments.has(host)) return;
  }
}
const sides = ['top', 'right', 'bottom', 'left'] as const;
const ENV = /\benv\(/i;
const shorthand = Symbol('mason:environment-shorthand');
interface EnvironmentShorthand {
  value: number;
  unit: 'dip';
  css: string;
  [shorthand]: { split: (value: string) => unknown[]; index: number };
}

/** Keep parse-time box shorthands pending until the effective longhand has a host context. */
export function cssEnvironmentShorthand(value: string, split: (value: string) => unknown[], count: number): unknown[] | undefined {
  if (!ENV.test(value)) return undefined;
  return Array.from({ length: count }, (_, index): EnvironmentShorthand => ({
    value: 0, unit: 'dip', css: value, [shorthand]: { split, index },
  }));
}

/** Direct Style box setters need the same deferred split as stylesheet shorthands. */
export function cssEnvironmentSides(value: string): unknown[] | undefined {
  return cssEnvironmentShorthand(value, splitMargin, 4);
}

export function isCssEnvironmentShorthand(value: unknown): value is EnvironmentShorthand {
  return !!value && typeof value === 'object' && shorthand in value;
}

function snapshot(insets: CssSafeAreaInsets | null): CssSafeAreaInsets {
  const result: CssSafeAreaInsets = {};
  for (const side of sides) {
    const value = insets?.[side];
    if (value !== undefined) {
      if (!Number.isFinite(value) || value < 0) throw new RangeError(`Invalid safe-area ${side} inset.`);
      result[side] = value;
    }
  }
  return result;
}

/** Publish a host's current safe area. Missing values are unavailable; zero is a real inset. */
export function setCssEnvironment(host: CssEnvironmentHost, insets: CssSafeAreaInsets | null): void {
  const next = snapshot(insets);
  const previous = environments.get(host);
  if (previous && sides.every((side) => previous[side] === next[side])) return;
  // An empty environment still establishes a window boundary: don't inherit another window's insets.
  environments.set(host, next);
  refreshCssEnvironment(host);
}

/** Remove the host boundary and re-evaluate styles against their next ancestor context. */
export function clearCssEnvironment(host: CssEnvironmentHost): void {
  if (environments.delete(host)) refreshCssEnvironment(host);
}

/** Bind a host-owned native observer. Call the returned function when that host is disposed. */
export function bindCssEnvironment(host: CssEnvironmentHost, source: CssEnvironmentSource): () => void {
  if (bindings.has(host)) throw new Error('This host already has a CSS environment binding.');
  const token = {};
  bindings.set(host, token);
  const update = () => {
    if (bindings.get(host) === token) setCssEnvironment(host, source.read());
  };
  let unsubscribe: (() => void) | undefined;
  try {
    update();
    unsubscribe = source.subscribe(update);
    update(); // Catch a change between the first read and subscription.
  } catch (error) {
    bindings.delete(host);
    try { unsubscribe?.(); } finally { clearCssEnvironment(host); }
    throw error;
  }
  return () => {
    if (bindings.get(host) !== token) return;
    bindings.delete(host);
    try { unsubscribe?.(); } finally { clearCssEnvironment(host); }
  };
}

function context(view?: CssEnvironmentHost): CssSafeAreaInsets | undefined {
  for (let current = view; current; current = current.parent ?? undefined) {
    const value = environments.get(current);
    if (value) return value;
  }
  return undefined;
}

// Scan balanced CSS functions, preserving strings, comments and URL payloads.
function close(value: string, start: number): number {
  let depth = 1;
  for (let i = start; i < value.length; i++) {
    if (value[i] === '\\') { i++; continue; }
    if (value[i] === '"' || value[i] === "'") {
      const quote = value[i++];
      while (i < value.length && value[i] !== quote) { if (value[i] === '\\') i++; i++; }
    } else if (value[i] === '/' && value[i + 1] === '*') {
      const end = value.indexOf('*/', i + 2);
      if (end < 0) return -1;
      i = end + 1;
    } else if (value[i] === '(') depth++;
    else if (value[i] === ')' && --depth === 0) return i;
  }
  return -1;
}

/** Substitute env() before the existing CSS math/unit parser; undefined means invalid/unavailable. */
export function resolveCssEnvironment(value: string, insets: CssSafeAreaInsets = {}): string | undefined {
  let result = '';
  for (let i = 0; i < value.length;) {
    if (value[i] === '\\') { result += value.slice(i, i + 2); i += 2; continue; }
    if (value[i] === '"' || value[i] === "'") {
      const start = i;
      const quote = value[i++];
      while (i < value.length && value[i] !== quote) { if (value[i] === '\\') i++; i++; }
      result += value.slice(start, ++i);
      continue;
    }
    if (value[i] === '/' && value[i + 1] === '*') {
      const end = value.indexOf('*/', i + 2);
      if (end < 0) return undefined;
      result += value.slice(i, end + 2); i = end + 2; continue;
    }
    const fn = /^([a-z_-][\w-]*)\(/i.exec(value.slice(i));
    if (!fn) { result += value[i++]; continue; }
    const start = i + fn[0].length;
    const end = close(value, start);
    if (end < 0) return undefined;
    const name = fn[1].toLowerCase();
    const body = value.slice(start, end);
    let replacement: string | undefined;
    if (name === 'url') replacement = value.slice(i, end + 1);
    else if (name === 'env') {
      // The first comma separates the environment name from an arbitrary fallback token sequence.
      const comma = body.indexOf(',');
      const identifier = (comma < 0 ? body : body.slice(0, comma)).replace(/\/\*[\s\S]*?\*\//g, ' ').trim();
      const args = /^(-?[_a-zA-Z][_a-zA-Z0-9-]*)(?:\s+\+?\d+)*$/.exec(identifier);
      if (!args) return undefined;
      const side = /^safe-area-inset-(top|right|bottom|left)$/.exec(identifier)?.[1] as typeof sides[number] | undefined;
      const inset = side && insets[side];
      if (typeof inset === 'number' && Number.isFinite(inset) && inset >= 0) replacement = `${inset}px`;
      else if (comma >= 0) replacement = resolveCssEnvironment(body.slice(comma + 1).trim(), insets);
    } else {
      const inner = resolveCssEnvironment(body, insets);
      if (inner !== undefined) replacement = `${fn[1]}(${inner})`;
    }
    if (replacement === undefined) return undefined;
    result += replacement;
    i = end + 1;
  }
  return result;
}

type Target = Record<string, unknown>;
interface Writes {
  target: WeakRef<Target>;
  owner?: WeakRef<CssEnvironmentHost>;
  values: Map<string, unknown>;
  active: boolean;
  loaded: () => void;
  unloaded: () => void;
}
const writesByTarget = new WeakMap<object, Writes>();
const targets = new Set<WeakRef<Writes>>();

function replay(writes: Writes): void {
  const target = writes.target.deref();
  if (target && writes.active) {
    for (const [name, value] of Array.from(writes.values)) target[name] = value;
  }
}

/** Replay after reparenting/native recreation; publish changes through setCssEnvironment instead. */
export function refreshCssEnvironment(host: CssEnvironmentHost): void {
  for (const ref of targets) {
    const writes = ref.deref();
    if (!writes?.target.deref()) { if (writes) stopWrites(writes); targets.delete(ref); continue; }
    for (let view = writes.owner?.deref(); view; view = view.parent ?? undefined) {
      if (view === host) { replay(writes); break; }
    }
  }
}

/** Core build adapter only: called at a leaf style setter, after cascade/var()/shorthand expansion. */
export function environmentStyleValue(target: object, name: string, value: unknown): unknown {
  const style = target as { view?: CssEnvironmentHost; viewRef?: { get?(): CssEnvironmentHost; deref?(): CssEnvironmentHost } };
  const owner = style.viewRef?.get?.() ?? style.viewRef?.deref?.() ?? style.view;
  const text = typeof value === 'string' ? value : (value as { css?: unknown } | null)?.css;
  let writes = writesByTarget.get(target);
  if (typeof text !== 'string' || !ENV.test(text)) {
    writes?.values.delete(name);
    if (writes && !writes.values.size) releaseCssEnvironmentStyle(target);
    return value;
  }
  ensureAutomaticEnvironment(owner);
  if (!writes) {
    writes = {
      target: new WeakRef(target as Target), owner: owner && new WeakRef(owner), values: new Map(), active: true,
      loaded() { writes!.active = true; replay(writes!); },
      unloaded() { writes!.active = false; },
    };
    writesByTarget.set(target, writes);
    targets.add(new WeakRef(writes));
    owner?.on?.('loaded', writes.loaded);
    owner?.on?.('unloaded', writes.unloaded);
  }
  writes.values.set(name, value);
  let resolved = resolveCssEnvironment(text, context(owner));
  if (resolved !== undefined && isCssEnvironmentShorthand(value)) {
    try {
      const pending = value[shorthand];
      const part = pending.split(resolved)[pending.index];
      resolved = typeof part === 'string' ? part : undefined;
    } catch { resolved = undefined; }
  }
  if (resolved === undefined) {
    reportCssDiagnostic({ kind: 'not-implemented', name, value: text,
      detail: 'env() is unavailable or invalid and has no usable fallback; the host must publish its window safe area' });
    return text;
  }
  return resolved;
}

/** Stop replaying a released native style helper, including its lifecycle listeners. */
export function releaseCssEnvironmentStyle(target: object): void {
  const writes = writesByTarget.get(target);
  if (!writes) return;
  stopWrites(writes);
  writesByTarget.delete(target);
}

function stopWrites(writes: Writes): void {
  const owner = writes.owner?.deref();
  owner?.off?.('loaded', writes.loaded);
  owner?.off?.('unloaded', writes.unloaded);
  writes.values.clear();
  writes.active = false;
}
