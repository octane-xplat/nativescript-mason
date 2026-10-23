import { afterEach, describe, expect, it, vi } from 'vitest';
import { Observable } from '@nativescript/core/data/observable';
import { Style as NativeStyle } from '@nativescript/core/ui/styling/style';
import { widthProperty, heightProperty, minWidthProperty, minHeightProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, paddingLeftProperty } from '@nativescript/core/ui/styling/style-properties';
import { CssState, StyleScope } from '@nativescript/core/ui/styling/style-scope';
import * as core from '../../tmp/nativescript-mason-core/index.android';
import { resolveCssEnvironment, releaseCssEnvironmentStyle, registerAutomaticCssEnvironment } from '../../tmp/nativescript-mason-core/css-environment';
import { installMasonSizeUnits } from '../../tmp/nativescript-mason-core/properties';
import { isMasonView_ } from '../../tmp/nativescript-mason-core/symbols';
import { setScreenScale } from '../testing/mason-test-kit/ns-layout';
import { STYLE_BUFFER_SIZE } from '../testing/mason-test-kit/style-under-test';
import { styleKey } from '../testing/mason-test-kit/style-keys';

const releases: Array<() => void> = [];
afterEach(() => { releases.splice(0).reverse().forEach((release) => release()); setScreenScale(1); });

function host(parent?: any) {
  const view = new Observable() as any;
  const buffer = new ArrayBuffer(STYLE_BUFFER_SIZE);
  const data = new DataView(buffer);
  data.setUint32(styleKey('REF_COUNT'), 1, true);
  const helper = new core.Style() as any;
  Object.assign(helper, { view_: view, style_view: data, i8View: new Int8Array(buffer), u8View: new Uint8Array(buffer), inBatch: true });
  Object.assign(view, {
    parent, [isMasonView_]: true, _styleHelper: helper,
    eachChild() {}, _onCssStateChange() {},
    _batchUpdate: (update: () => void) => update(),
    getEffectivePaddingShorthand: () => '', getEffectiveMarginShorthand: () => '',
  });
  for (const property of [widthProperty, heightProperty, minWidthProperty, minHeightProperty, paddingTopProperty, paddingRightProperty, paddingBottomProperty, paddingLeftProperty]) {
    view[property.setNative] = core.ViewBase.prototype[property.setNative];
  }
  view.style = new NativeStyle({ get: () => view, deref: () => view, clear() {} } as any);
  installMasonSizeUnits(view.style);
  releases.push(() => { releaseCssEnvironmentStyle(helper); releaseCssEnvironmentStyle(view.style); core.clearCssEnvironment(view); });
  return { view, helper, style: view.style as any, read: (name: string) => data.getFloat32(styleKey(name), true) };
}

function css(view: any, text: string) {
  const scope = new StyleScope(); scope.css = text;
  Object.assign(view, { _styleScope: scope, cssClasses: new Set(['safe']), cssPseudoClasses: new Set(), isLoaded: true });
  const state = new CssState({ get: () => view, deref: () => view } as any);
  view._onCssStateChange = () => state.onChange();
  state.onChange();
}

describe('core CSS environment substitution', () => {
  it('resolves four sides, preserves real zero, and uses fallback only when unavailable', () => {
    expect(resolveCssEnvironment('env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      { top: 62, right: 0, bottom: 34, left: 0 })).toBe('62px 0px 34px 0px');
    expect(resolveCssEnvironment('env(safe-area-inset-top, 99px)', { top: 0 })).toBe('0px');
    expect(resolveCssEnvironment('env(safe-area-inset-top, 9px)')).toBe('9px');
    expect(resolveCssEnvironment('env(unknown, max(2px, env(safe-area-inset-bottom, 3px)))')).toBe('max(2px, 3px)');
    expect(resolveCssEnvironment('env(unknown, env(safe-area-inset-top))', { top: 4 })).toBe('4px');
    expect(resolveCssEnvironment('env(safe-area-inset-top, env(unknown))', { top: 4 })).toBe('4px');
  });

  it('leaves URL/string payloads alone and rejects malformed or unavailable references', () => {
    const value = 'url("env(safe-area-inset-top)") "env(unknown)" /* env(unknown) */ env(safe-area-inset-top)';
    expect(resolveCssEnvironment(value, { top: 4 })).toBe(value.replace(/env\(safe-area-inset-top\)$/, '4px'));
    for (const text of ['env(unknown)', 'env(safe-area-inset-top)', 'env(safe-area-inset-top', 'env(safe-area-inset-top extra, 1px)']) {
      expect(resolveCssEnvironment(text), text).toBeUndefined();
    }
    expect(resolveCssEnvironment('env(viewport-segment-top 0 0, 7px)')).toBe('7px');
    expect(resolveCssEnvironment('env(safe-area-inset-top 0, 7px)', { top: 4 })).toBe('7px');
    expect(resolveCssEnvironment('env(SAFE-AREA-INSET-TOP, 5px)', { top: 4 })).toBe('5px');
  });
});

describe('core runtime environment ownership and effective style writes', () => {
  it('converts host logical pixels once, including nested math and percentages', () => {
    for (const density of [1, 2, 3]) {
      setScreenScale(density);
      const h = host(); core.setCssEnvironment(h.view, { top: 62, right: 0, bottom: 34, left: 0 });
      h.helper.paddingTop = 'calc(env(safe-area-inset-top) + max(4px, env(safe-area-inset-right, 99px)))';
      h.helper.paddingBottom = 'clamp(8px, env(safe-area-inset-bottom), 40px)';
      h.helper.paddingLeft = 'env(unknown, 25%)';
      expect(h.read('PADDING_TOP_VALUE')).toBe(66 * density);
      expect(h.read('PADDING_BOTTOM_VALUE')).toBe(34 * density);
      expect(h.read('PADDING_LEFT_VALUE')).toBe(0.25);
    }
  });

  it('re-evaluates unavailable values, preserves snapshots, and isolates windows', () => {
    const first = host(); const second = host(); const child = host(first.view);
    const insets = { top: 62 }; core.setCssEnvironment(first.view, insets); insets.top = 500;
    core.setCssEnvironment(second.view, { top: 24 });
    child.helper.paddingTop = second.helper.paddingTop = 'env(safe-area-inset-top, 3px)';
    expect(child.read('PADDING_TOP_VALUE')).toBe(62); expect(second.read('PADDING_TOP_VALUE')).toBe(24);
    core.setCssEnvironment(first.view, { top: 0 });
    expect(child.read('PADDING_TOP_VALUE')).toBe(0); expect(second.read('PADDING_TOP_VALUE')).toBe(24);
    core.setCssEnvironment(child.view, null); // A new window boundary with unknown data does not inherit 0.
    expect(child.read('PADDING_TOP_VALUE')).toBe(3);
    core.clearCssEnvironment(child.view); expect(child.read('PADDING_TOP_VALUE')).toBe(0);
    expect(() => core.setCssEnvironment(first.view, { top: NaN })).toThrow(RangeError);
    expect(() => core.setCssEnvironment(first.view, { top: -1 })).toThrow(RangeError);
  });

  it('tracks shorthand edges independently so a later longhand override survives changes', () => {
    const h = host(); core.setCssEnvironment(h.view, { top: 62, bottom: 34 });
    h.helper.padding = 'env(safe-area-inset-top) 4px env(safe-area-inset-bottom)';
    h.helper.paddingRight = 9;
    core.setCssEnvironment(h.view, { top: 20, bottom: 10 });
    expect(h.read('PADDING_TOP_VALUE')).toBe(20); expect(h.read('PADDING_BOTTOM_VALUE')).toBe(10);
    expect(h.read('PADDING_LEFT_VALUE')).toBe(4); expect(h.read('PADDING_RIGHT_VALUE')).toBe(9);
    h.helper.paddingTop = 7; core.setCssEnvironment(h.view, { top: 50 });
    expect(h.read('PADDING_TOP_VALUE')).toBe(7);
  });

  it('expands multi-value env fallbacks at runtime for direct and stylesheet box shorthands', () => {
    const direct = host();
    direct.helper.padding = 'env(unknown, 2px 4px 6px 8px)';
    expect(direct.read('PADDING_TOP_VALUE')).toBe(2); expect(direct.read('PADDING_RIGHT_VALUE')).toBe(4);
    expect(direct.read('PADDING_BOTTOM_VALUE')).toBe(6); expect(direct.read('PADDING_LEFT_VALUE')).toBe(8);
    const styled = host();
    css(styled.view, '.safe { padding: env(unknown, 2px 4px 6px 8px); padding-right: 9px; min-width: env(safe-area-inset-top, 12px); }');
    expect(styled.read('PADDING_TOP_VALUE')).toBe(2); expect(styled.read('PADDING_RIGHT_VALUE')).toBe(9);
    expect(styled.read('PADDING_BOTTOM_VALUE')).toBe(6); expect(styled.read('PADDING_LEFT_VALUE')).toBe(8);
    expect(styled.read('MIN_WIDTH_VALUE')).toBe(12);
    core.setCssEnvironment(styled.view, { top: 62 }); expect(styled.read('MIN_WIDTH_VALUE')).toBe(62);
  });

  it('resolves real CSS variables/shorthands and respects local precedence and class removal', () => {
    const h = host(); core.setCssEnvironment(h.view, { top: 62, bottom: 34 });
    css(h.view, '.safe { --safe: env(safe-area-inset-top, 1px); padding: var(--safe) 5px env(safe-area-inset-bottom, 2px); width: calc(env(safe-area-inset-top) + 10px); }');
    expect(h.read('PADDING_TOP_VALUE')).toBe(62); expect(h.read('PADDING_BOTTOM_VALUE')).toBe(34);
    expect(h.read('WIDTH_VALUE')).toBe(72);
    h.style.paddingTop = 7;
    core.setCssEnvironment(h.view, { top: 20, bottom: 10 });
    expect(h.read('PADDING_TOP_VALUE')).toBe(7); expect(h.read('PADDING_BOTTOM_VALUE')).toBe(10);
    expect(h.read('WIDTH_VALUE')).toBe(30);
    css(h.view, '.safe { padding-top: 8px; width: 12px; }');
    core.setCssEnvironment(h.view, { top: 90, bottom: 90 });
    expect(h.read('PADDING_TOP_VALUE')).toBe(7); expect(h.read('WIDTH_VALUE')).toBe(12);
  });

  it('suspends detached owners, follows reparenting on load, and releases old native helpers', () => {
    const first = host(); const second = host(); const child = host(first.view);
    core.setCssEnvironment(first.view, { top: 62 }); core.setCssEnvironment(second.view, { top: 24 });
    child.helper.paddingTop = 'env(safe-area-inset-top)';
    child.view.notify({ eventName: 'unloaded', object: child.view });
    child.view.parent = second.view; core.setCssEnvironment(second.view, { top: 28 });
    expect(child.read('PADDING_TOP_VALUE')).toBe(62);
    child.view.notify({ eventName: 'loaded', object: child.view });
    expect(child.read('PADDING_TOP_VALUE')).toBe(28);
    releaseCssEnvironmentStyle(child.helper);
    core.setCssEnvironment(second.view, { top: 30 });
    expect(child.read('PADDING_TOP_VALUE')).toBe(28);
  });

  it('starts automatic observation lazily and reconnects with the root lifecycle', () => {
    const root = host(), child = host(root.view); const stop = vi.fn();
    let changed = () => {}; let top = 62;
    const create = vi.fn(() => ({ read: () => ({ top }), subscribe: (callback: () => void) => { changed = callback; return stop; } }));
    const unload = registerAutomaticCssEnvironment(root.view, create);
    expect(create).not.toHaveBeenCalled();
    child.helper.paddingTop = 'env(safe-area-inset-top, 5px)';
    expect(create).toHaveBeenCalledTimes(1); expect(child.read('PADDING_TOP_VALUE')).toBe(62);
    top = 0; changed(); expect(child.read('PADDING_TOP_VALUE')).toBe(0);
    child.view.notify({ eventName: 'unloaded', object: child.view }); unload();
    expect(stop).toHaveBeenCalledTimes(1);
    const reload = registerAutomaticCssEnvironment(root.view, create);
    expect(create).toHaveBeenCalledTimes(1);
    child.view.notify({ eventName: 'loaded', object: child.view });
    expect(create).toHaveBeenCalledTimes(2); reload();
  });

  it('respects an explicit host source installed before the root loads', () => {
    const h = host(); core.setCssEnvironment(h.view, { top: 12 });
    const create = vi.fn(); const unload = registerAutomaticCssEnvironment(h.view, create);
    h.helper.paddingTop = 'env(safe-area-inset-top)';
    expect(create).not.toHaveBeenCalled(); expect(h.read('PADDING_TOP_VALUE')).toBe(12); unload();
  });

  it('queues the existing native style transport when host values change', async () => {
    const h = host(); const sync = vi.fn();
    h.helper._sendSync = sync; h.helper.inBatch = false;
    core.setCssEnvironment(h.view, { top: 62 });
    h.helper.paddingTop = 'env(safe-area-inset-top)';
    await Promise.resolve(); expect(sync).toHaveBeenCalledTimes(1);
    sync.mockClear(); core.setCssEnvironment(h.view, { top: 20 });
    await Promise.resolve(); expect(sync).toHaveBeenCalledTimes(1);
    expect(h.read('PADDING_TOP_VALUE')).toBe(20);
    core.setCssEnvironment(h.view, { top: 20 });
    await Promise.resolve(); expect(sync).toHaveBeenCalledTimes(1);
  });

  it('releases a subscription when its post-subscribe read fails', () => {
    const h = host(); h.helper.paddingTop = 'env(safe-area-inset-top, 5px)';
    let reads = 0; const stop = vi.fn();
    expect(() => core.bindCssEnvironment(h.view, {
      read: () => { if (++reads > 1) throw new Error('Window disposed'); return { top: 62 }; },
      subscribe: () => stop,
    })).toThrow('Window disposed');
    expect(stop).toHaveBeenCalledTimes(1); expect(h.read('PADDING_TOP_VALUE')).toBe(5);
    const dispose = core.bindCssEnvironment(h.view, { read: () => ({ top: 20 }), subscribe: () => stop });
    dispose();
  });

  it('subscribes to a host source, avoids redundant writes, and unsubscribes exactly once', () => {
    const h = host(); h.helper.paddingTop = 'env(safe-area-inset-top, 5px)';
    let insets: core.CssSafeAreaInsets | null = { top: 62 }; let changed = () => {};
    const stop = vi.fn();
    const dispose = core.bindCssEnvironment(h.view, { read: () => insets, subscribe: (callback) => { changed = callback; return stop; } });
    expect(h.read('PADDING_TOP_VALUE')).toBe(62);
    insets = { top: 0 }; changed(); expect(h.read('PADDING_TOP_VALUE')).toBe(0);
    expect(() => core.bindCssEnvironment(h.view, { read: () => null, subscribe: () => stop })).toThrow(/already/);
    dispose(); dispose(); expect(stop).toHaveBeenCalledTimes(1); expect(h.read('PADDING_TOP_VALUE')).toBe(5);
    insets = { top: 100 }; changed(); expect(h.read('PADDING_TOP_VALUE')).toBe(5);
  });
});
