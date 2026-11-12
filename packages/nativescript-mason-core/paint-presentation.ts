/** CSS paint values owned by Mason, without changing NativeScript's authored style. */
export type PaintSnapshot = { borderRadius: string; boxShadow: string };
/** One temporary paint owner. Clear/dispose preserve intervening authored writes. */
export type PaintPresentation = {
  /** Current base paint, excluding this handle's temporary correction. */
  read(): PaintSnapshot;
  /** Replace this handle's correction, retaining a fresh base per property. */
  write(paint: Partial<PaintSnapshot>): void;
  /** Restore base paint where the last correction is still installed. */
  clear(): void;
  /** Clear and release ownership. Repeated disposal is safe. */
  dispose(): void;
};

type PaintAccess = { borderRadius: string; boxShadow: string };
const owners = new WeakMap<object, PaintPresentation>();
const revisions = new WeakMap<object, Map<keyof PaintSnapshot, number>>();
/** @internal Called by the owning Style setters, including same-value writes. */
export function recordPaintWrite(style: object, key: keyof PaintSnapshot): void {
  let fields = revisions.get(style);
  if (!fields) revisions.set(style, (fields = new Map()));
  fields.set(key, (fields.get(key) ?? 0) + 1);
}
const revision = (style: object, key: keyof PaintSnapshot) => revisions.get(style)?.get(key) ?? 0;
const keys = ['borderRadius', 'boxShadow'] as const;

/** @internal A ViewBase supplies its own native paint owner; consumers use its method. */
export function createPaintPresentation(owner: object, access: () => PaintAccess): PaintPresentation {
  if (owners.has(owner)) throw new Error('Mason: paint presentation already has an owner');
  const applied = new Map<keyof PaintSnapshot, { base: string; value: string; revision: number }>();
  let disposed = false;
  function active() {
    if (disposed) throw new Error('Mason: paint presentation is disposed');
  }
  function clear() {
    if (!applied.size) return;
    const paint = access();
    for (const [key, entry] of applied) {
      if (paint[key] === entry.value && revision(paint, key) === entry.revision) paint[key] = entry.base;
    }
    applied.clear();
  }
  const handle: PaintPresentation = {
    read() {
      active();
      const paint = access();
      const snapshot: PaintSnapshot = { borderRadius: paint.borderRadius, boxShadow: paint.boxShadow };
      for (const [key, entry] of applied) {
        if (paint[key] === entry.value && revision(paint, key) === entry.revision) snapshot[key] = entry.base;
      }
      return snapshot;
    },
    write(next) {
      active();
      for (const key of Object.keys(next)) {
        if (!keys.some((name) => name === key) || typeof Reflect.get(next, key) !== 'string') {
          throw new Error(`Mason: unsupported paint presentation value ${key}`);
        }
      }
      clear();
      const paint = access();
      for (const key of keys) {
        const value = next[key];
        if (value === undefined) continue;
        const base = paint[key];
        paint[key] = value;
        applied.set(key, { base, value: paint[key], revision: revision(paint, key) });
      }
    },
    clear() {
      if (!disposed) clear();
    },
    dispose() {
      if (disposed) return;
      clear();
      disposed = true;
      owners.delete(owner);
    },
  };
  owners.set(owner, handle);
  return handle;
}
