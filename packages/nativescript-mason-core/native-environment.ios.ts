import type { View } from '@nativescript/core';
import type { CssEnvironmentSource } from './css-environment';

// One non-interactive observer per owning UIWindow, shared by core roots.
// No UIApplication keyWindow/root-controller lookup: presentations may own another window.
interface Observation { callbacks: Set<() => void>; observer: UIView; }
const windows = new WeakMap<UIWindow, Observation>();
let ObserverClass: typeof UIView;

function observeWindow(window: UIWindow, changed: () => void): () => void {
  let observation = windows.get(window);
  if (!observation) {
    if (!ObserverClass) {
      @NativeClass()
      class SafeAreaObserver extends UIView {
        changed?: () => void;
        safeAreaInsetsDidChange(): void { super.safeAreaInsetsDidChange(); this.changed?.(); }
        layoutSubviews(): void { super.layoutSubviews(); this.changed?.(); }
      }
      ObserverClass = SafeAreaObserver;
    }
    const observer = ObserverClass.new() as UIView & { changed?: () => void };
    const callbacks = new Set<() => void>();
    observation = { callbacks, observer };
    windows.set(window, observation);
    observer.frame = window.bounds;
    observer.autoresizingMask = UIViewAutoresizing.FlexibleWidth | UIViewAutoresizing.FlexibleHeight;
    observer.userInteractionEnabled = false;
    observer.isAccessibilityElement = false;
    observer.changed = () => { for (const callback of Array.from(callbacks)) callback(); };
    window.addSubview(observer);
  }
  observation.callbacks.add(changed);
  const current = observation;
  return () => {
    current.callbacks.delete(changed);
    if (!current.callbacks.size) {
      (current.observer as UIView & { changed?: () => void }).changed = undefined;
      current.observer.removeFromSuperview();
      windows.delete(window);
    }
  };
}

export function nativeCssEnvironmentSource(view: View): CssEnvironmentSource {
  const windowOfView = () => (view.nativeViewProtected as UIView | undefined)?.window;
  return {
    read() {
      const insets = windowOfView()?.safeAreaInsets;
      return insets ? { top: insets.top, right: insets.right, bottom: insets.bottom, left: insets.left } : null;
    },
    subscribe(changed) {
      let window: UIWindow | undefined;
      let stop: (() => void) | undefined;
      const select = () => {
        const next = windowOfView();
        if (next !== window) { stop?.(); window = next; stop = next ? observeWindow(next, changed) : undefined; }
        changed();
      };
      view.on('layoutChanged', select);
      select();
      return () => { view.off('layoutChanged', select); stop?.(); };
    },
  };
}
