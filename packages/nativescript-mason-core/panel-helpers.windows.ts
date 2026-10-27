declare const Microsoft: any;

let engine: NativeScript.Mason.Mason | undefined;
// The runtime calls instance methods at well under half the cost of static ones.
export function masonEngine(): NativeScript.Mason.Mason {
  return (engine ??= NativeScript.Mason.Mason.Instance());
}

// Engine methods take element pointers (Int64): projected runtimeclass args cannot be
// rebuilt from a COM pointer by the bridge, so JS hands over the native address. Bridge
// proxies carry __native_ptr already; direct-COM proxies expose `handle` (a v8 External)
// whose pointer pointerKey() reports.
export function nativeArg(v: any): any {
  if (!v) return null;
  // BigInt args do not marshal to Int64 through the bridge; a pointer under 2^53 is exact as a Number.
  if (v.__native_ptr !== undefined) return Number(v.__native_ptr);
  const key = (globalThis as any).NSWinRT?.interop?.pointerKey?.(v);
  if (key) {
    const ptr = Number(key);
    if (ptr) {
      try { v.__native_ptr = ptr; } catch { /* frozen proxy */ }
      return ptr;
    }
  }
  return null;
}

export function appendNativeChild(panel: any, child: any, atIndex: number): boolean {
  const nativeChild = child?.nativeViewProtected ?? child?.windows; // as Microsoft.UI.Xaml.UIElement;
  if (!nativeChild) return false;
  child._isMasonChild = true;
  if (!panel?.Children) return false;
  try {
    const ptr = nativeArg(nativeChild);
    if (ptr == null) return false;
    masonEngine().ReparentChildPtr(panel, ptr, atIndex);
    return true;
  } catch {
    return false;
  }
}

export function removeNativeChild(panel: any, child: any): void {
  const nativeChild = child?.nativeViewProtected ?? child?.windows; // as Microsoft.UI.Xaml.UIElement;
  if (!nativeChild || !panel?.Children) return;
  try {
    const ptr = nativeArg(nativeChild);
    if (ptr == null) return;
    masonEngine().RemoveChildPtr(panel, ptr);
  } catch {
    // empty
  }
}
