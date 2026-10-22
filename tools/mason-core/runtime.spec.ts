import { describe, expect, it, vi } from 'vitest';
import { View as NativeScriptView } from '@nativescript/core';
import * as core from '../../tmp/nativescript-mason-core/index.android';
import { Tree } from '../../tmp/nativescript-mason-core/tree/index.android';
import { isMasonView_ } from '../../tmp/nativescript-mason-core/symbols';
import { adoptForeignLayout, invalidateOnLayoutRequest, releaseForeignLayout } from '../../tmp/nativescript-mason-core/foreign-layout';
import { STYLE_BUFFER_SIZE } from '../testing/mason-test-kit/style-under-test';
import { styleKey } from '../testing/mason-test-kit/style-keys';

// Actual NativeScript JS ownership/lifecycle; no UI host or device is simulated.
class Container extends core.ViewBase {
  constructor() {
    super();
    this[isMasonView_] = true;
  }
}

describe('the core-only container boundary', () => {
  it('exposes containers and no HTML/text/widget factories', () => {
    expect(core.View.prototype).toBeInstanceOf(core.ViewBase);
    expect(core.Scroll.prototype).toBeInstanceOf(core.ViewBase);
    for (const name of ['Text', 'Img', 'Input', 'Button', 'Br', 'Div', 'Ul', 'Li', 'TextNode', 'frameworkRegistry']) {
      expect(name in core, name).toBe(false);
    }
    expect('innerHTML' in Container.prototype).toBe(false);
    expect(Object.getOwnPropertyNames(Tree.prototype).filter((name) => name.startsWith('create'))).toEqual(['createView', 'createScrollView']);
  });

  it('keeps real NativeScript views in order through insertion, replacement and removal', () => {
    const parent = new Container();
    const first = new NativeScriptView();
    const second = new NativeScriptView();
    const third = new NativeScriptView();
    parent.addChild(first);
    parent.insertBefore(second, first);
    expect(parent.getChildrenCount()).toBe(2);
    expect(parent.getChildAt(0)).toBe(second);
    expect(parent.getChildAt(1)).toBe(first);
    expect(first.parent).toBe(parent);
    parent.replaceChild(third, 1);
    expect(first.parent).toBeUndefined();
    expect(third.parent).toBe(parent);
    expect(parent.getChildAt(1)).toBe(third);
    parent.removeChild(second);
    expect(second.parent).toBeUndefined();
    expect(parent.getChildrenCount()).toBe(1);
    parent.removeChildren();
    parent.removeChildren();
    expect(third.parent).toBeUndefined();
    expect(parent.getChildrenCount()).toBe(0);
  });

  it('rejects text, invalid indices, duplicate parents and cycles without corrupting ownership', () => {
    const parent = new Container();
    const other = new Container();
    const child = new NativeScriptView();
    expect(() => parent.addChild({ text: 'Use a NativeScript Label' } as any)).toThrow(TypeError);
    expect(() => parent.insertChild(child, -1)).toThrow(RangeError);
    expect(() => parent.insertChild(child, 0.5)).toThrow(RangeError);
    parent.addChild(child);
    expect(() => other.addChild(child)).toThrow(/parent/);
    expect(() => parent.addChild(parent)).toThrow(/ancestor/);
    parent.addChild(other);
    expect(() => other.addChild(parent)).toThrow(/ancestor/);
    expect(parent._children).toEqual([child, other]);
    expect(other.getChildrenCount()).toBe(0);
    parent.removeChildren();
  });

  it('reparents a foreign view and restores its layout invalidation hook on native detachment', () => {
    const first = new Container();
    const second = new Container();
    const child = new NativeScriptView();
    first.addChild(child);
    const original = child.requestLayout;
    const engine = { invalidateForeignView: vi.fn() };
    (child as any).nativeViewProtected = {};
    invalidateOnLayoutRequest(child, engine);
    expect(child.requestLayout).not.toBe(original);
    // Core releases the foreign hook from its native removal override.
    first._removeViewFromNativeVisualTree(child);
    expect(child.requestLayout).toBe(original);
    first.removeChild(child);
    second.addChild(child);
    expect(child.parent).toBe(second);
    expect(first.getChildrenCount()).toBe(0);
    expect(second.getChildAt(0)).toBe(child);
    second.removeChildren();
  });

  it('counts only attached views when native loading lags behind JS insertion', () => {
    const parent = new Container();
    const children = Array.from({ length: 4 }, () => new NativeScriptView());
    children.forEach((child) => parent.addChild(child));
    (children[0] as any)._isMasonChild = true;
    expect(parent._nativeAttachIndex(children[2], 2)).toEqual({ jsIndex: 2, nativeIndex: 1 });
    (children[2] as any)._isMasonChild = true;
    expect(parent._nativeAttachIndex(children[3], -1)).toEqual({ jsIndex: 3, nativeIndex: 2 });
    parent.removeChild(children[0]);
    expect(parent._nativeAttachIndex(children[1], 0)).toEqual({ jsIndex: 0, nativeIndex: 0 });
    parent.removeChildren();
  });

  it('cancels queued writes for a released foreign native view and syncs its replacement', async () => {
    const sync = vi.fn();
    const factory = vi.spyOn(core.Style, 'fromView').mockImplementation((owner, native) => {
      const buffer = new ArrayBuffer(STYLE_BUFFER_SIZE);
      const data = new DataView(buffer);
      data.setUint32(styleKey('REF_COUNT'), 1, true);
      const style = new core.Style() as any;
      style.view_ = owner;
      style.nativeView = native;
      style.style_view = data;
      style.i8View = new Int8Array(buffer);
      style.u8View = new Uint8Array(buffer);
      style._sendSync = () => sync(native);
      return style;
    });
    const child = new NativeScriptView();
    const first = {};
    const replacement = {};
    // NativeScript's runtime WeakRef supplies get(); Node's supplies deref().
    (child.style as any).viewRef = { get: () => child, deref: () => child };
    try {
      child.width = 31;
      (child as any).nativeViewProtected = first;
      adoptForeignLayout(child);
      releaseForeignLayout(child);
      (child as any).nativeViewProtected = undefined;
      await Promise.resolve();
      expect(sync).not.toHaveBeenCalled();

      child.width = 54;
      (child as any).nativeViewProtected = replacement;
      adoptForeignLayout(child);
      await Promise.resolve();
      expect(sync).toHaveBeenCalledExactlyOnceWith(replacement);
    } finally {
      releaseForeignLayout(child);
      factory.mockRestore();
    }
  });

});
