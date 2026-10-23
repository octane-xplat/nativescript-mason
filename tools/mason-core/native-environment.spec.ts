import { afterEach, describe, expect, it, vi } from 'vitest';
import { nativeCssEnvironmentSource as iosSource } from '../../tmp/nativescript-mason-core/native-environment.ios';
import { nativeCssEnvironmentSource as androidSource } from '../../tmp/nativescript-mason-core/native-environment.android';

afterEach(() => vi.unstubAllGlobals());

function host(native: any) {
  const listeners = new Set<() => void>();
  const view = {
    nativeViewProtected: native,
    on: (_name: string, callback: () => void) => listeners.add(callback),
    off: (_name: string, callback: () => void) => listeners.delete(callback),
  } as any;
  return { view, listeners, layout: () => { for (const callback of Array.from(listeners)) callback(); } };
}

// The platform JS adapters execute here; these objects stand in for UIKit/Android.
// This proves selection, conversion, observer ownership and cleanup, not OS dispatch/layout.
describe('native window CSS environment sources (headless)', () => {
  it('uses the owning iOS window, shares observation, follows moves and releases its native observer', () => {
    class FakeUIView {
      static new() { return new this(); }
      window: any;
      safeAreaInsetsDidChange() {}
      layoutSubviews() {}
      removeFromSuperview() { this.window.children.splice(this.window.children.indexOf(this), 1); }
    }
    vi.stubGlobal('UIView', FakeUIView);
    vi.stubGlobal('NativeClass', () => (target: unknown) => target);
    vi.stubGlobal('UIViewAutoresizing', { FlexibleWidth: 2, FlexibleHeight: 16 });
    const window = (top: number) => ({
      safeAreaInsets: { top, right: 0, bottom: 34, left: 0 }, bounds: {}, children: [] as any[],
      addSubview(view: any) { this.children.push(view); view.window = this; },
    });
    const first = window(62), second = window(24);
    const a = host({ window: first }), b = host({ window: first });
    const aSource = iosSource(a.view), bSource = iosSource(b.view);
    const changed = vi.fn();
    const stopA = aSource.subscribe(changed), stopB = bSource.subscribe(vi.fn());
    expect(first.children).toHaveLength(1);
    expect(first.children[0].userInteractionEnabled).toBe(false);
    expect(aSource.read()?.top).toBe(62);
    first.safeAreaInsets.top = 0; first.children[0].safeAreaInsetsDidChange();
    expect(changed).toHaveBeenCalled(); expect(aSource.read()?.top).toBe(0);
    a.view.nativeViewProtected.window = second; a.layout();
    expect(aSource.read()?.top).toBe(24); expect(second.children).toHaveLength(1);
    stopA(); expect(second.children).toHaveLength(0); expect(a.listeners.size).toBe(0);
    expect(first.children).toHaveLength(1); stopB(); expect(first.children).toHaveLength(0);
  });

  it('reads Android root insets in that window density, excludes IME, preserves other listeners and follows native roots', () => {
    vi.stubGlobal('android', { view: { ViewTreeObserver: { OnPreDrawListener: class { constructor(value: any) { return value; } } } } });
    const masks: number[] = [];
    vi.stubGlobal('androidx', { core: { view: { WindowInsetsCompat: {
      Type: { systemBars: () => 1, displayCutout: () => 2 },
      toWindowInsetsCompat: (native: any, _root: any) => ({ getInsets(mask: number) { masks.push(mask); return native.bars; } }),
    } } } });
    const root = (top: number, density: number) => {
      const listeners = new Set<any>();
      const observer = { isAlive: () => true, addOnPreDrawListener: (listener: any) => listeners.add(listener), removeOnPreDrawListener: (listener: any) => listeners.delete(listener) };
      return {
        native: { bars: { top, right: 0, bottom: 72, left: 0 }, ime: { bottom: 900 } } as any,
        listeners, getViewTreeObserver: () => observer, getRootWindowInsets() { return this.native; },
        getResources: () => ({ getDisplayMetrics: () => ({ density }) }),
        requestApplyInsets: vi.fn(), setOnApplyWindowInsetsListener: vi.fn(),
        draw() { for (const listener of listeners) expect(listener.onPreDraw()).toBe(true); },
      };
    };
    const first = root(186, 3), second = root(48, 2);
    const native = { getRootView: () => first };
    const a = host(native), b = host(native);
    const aSource = androidSource(a.view), bSource = androidSource(b.view);
    const changed = vi.fn(); const stopA = aSource.subscribe(changed), stopB = bSource.subscribe(vi.fn());
    expect(first.listeners.size).toBe(1); expect(aSource.read()).toEqual({ top: 62, right: 0, bottom: 24, left: 0 });
    expect(masks.every((mask) => mask === 3)).toBe(true); expect(first.setOnApplyWindowInsetsListener).not.toHaveBeenCalled();
    changed.mockClear(); first.draw(); expect(changed).not.toHaveBeenCalled();
    first.native.bars.top = 0; first.draw(); expect(changed).toHaveBeenCalledTimes(1); expect(aSource.read()?.top).toBe(0);
    a.view.nativeViewProtected = { getRootView: () => second }; a.layout();
    expect(aSource.read()?.top).toBe(24); expect(first.listeners.size).toBe(1); expect(second.listeners.size).toBe(1);
    stopA(); stopB(); expect(first.listeners.size).toBe(0); expect(second.listeners.size).toBe(0); expect(a.listeners.size).toBe(0);
  });

  it('keeps an unattached or unavailable native window distinct from zero', () => {
    const absent = host(undefined);
    expect(iosSource(absent.view).read()).toBeNull(); expect(androidSource(absent.view).read()).toBeNull();
    const h = host({ getRootView: () => ({ getRootWindowInsets: () => null }) });
    expect(androidSource(h.view).read()).toBeNull();
  });
});
