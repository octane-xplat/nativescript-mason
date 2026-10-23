import type { View } from '@nativescript/core';
import type { CssEnvironmentSource, CssSafeAreaInsets } from './css-environment';

interface Observation { callbacks: Set<() => void>; observer: android.view.ViewTreeObserver; listener: android.view.ViewTreeObserver.OnPreDrawListener; }
const roots = new WeakMap<android.view.View, Observation>();

function readInsets(root?: android.view.View): CssSafeAreaInsets | null {
  const native = root?.getRootWindowInsets();
  if (!native) return null;
  // AndroidX is already a native core dependency. Its systemBars type excludes IME,
  // including on API 23-29 where raw systemWindowInsetBottom can contain the keyboard.
  const compat = androidx.core.view.WindowInsetsCompat.toWindowInsetsCompat(native, root);
  const types = androidx.core.view.WindowInsetsCompat.Type;
  const insets = compat.getInsets(types.systemBars() | types.displayCutout());
  const density = root.getResources().getDisplayMetrics().density;
  return { top: insets.top / density, right: insets.right / density, bottom: insets.bottom / density, left: insets.left / density };
}

function observeRoot(root: android.view.View, changed: () => void): () => void {
  let observation = roots.get(root);
  if (!observation) {
    const callbacks = new Set<() => void>();
    let previous = JSON.stringify(readInsets(root));
    const listener = new android.view.ViewTreeObserver.OnPreDrawListener({
      onPreDraw() {
        const next = JSON.stringify(readInsets(root));
        if (next !== previous) { previous = next; for (const callback of Array.from(callbacks)) callback(); }
        return true;
      },
    });
    const observer = root.getViewTreeObserver();
    observation = { callbacks, observer, listener };
    roots.set(root, observation);
    observer.addOnPreDrawListener(listener);
    // Observe without replacing anyone's OnApplyWindowInsetsListener or consuming insets.
    root.requestApplyInsets();
  }
  observation.callbacks.add(changed);
  const current = observation;
  return () => {
    current.callbacks.delete(changed);
    if (!current.callbacks.size) {
      const observer = current.observer.isAlive() ? current.observer : root.getViewTreeObserver();
      observer.removeOnPreDrawListener(current.listener);
      roots.delete(root);
    }
  };
}

export function nativeCssEnvironmentSource(view: View): CssEnvironmentSource {
  const rootOfView = () => (view.nativeViewProtected as android.view.View | undefined)?.getRootView();
  return {
    read: () => readInsets(rootOfView()),
    subscribe(changed) {
      let root: android.view.View | undefined;
      let stop: (() => void) | undefined;
      const select = () => {
        const next = rootOfView();
        if (next !== root) { stop?.(); root = next; stop = next ? observeRoot(next, changed) : undefined; }
        changed();
      };
      view.on('layoutChanged', select);
      select();
      return () => { view.off('layoutChanged', select); stop?.(); };
    },
  };
}
