import { expect, it, vi } from 'vitest';
import { Observable } from '@nativescript/core/data/observable';
import { Style as CoreStyle } from '@nativescript/core/ui/styling/style';
import { flexShrinkProperty } from '@nativescript/core/ui/layouts/flexbox-layout';
import { Style } from '../../tmp/nativescript-mason-core/style';
import { adoptForeignLayout, releaseForeignLayout } from '../../tmp/nativescript-mason-core/foreign-layout';
import '../../tmp/nativescript-mason-core/properties';

it('owns native flex setters only during Mason adoption and preserves a pre-existing own setter', () => {
  const view = new Observable() as any;
  const original = vi.fn();
  Object.assign(view, {
    nativeViewProtected: {}, _onCssStateChange() {}, eachChild() {},
    _batchUpdate: (update: () => void) => update(),
    getEffectivePaddingShorthand: () => 0, getEffectiveMarginShorthand: () => 0,
    [flexShrinkProperty.setNative]: original,
  });
  view.style = new CoreStyle({ get: () => view, deref: () => view, clear() {} } as any);
  view.style.flexShrink = 0.25;
  original.mockClear();
  original.mockImplementation(() => { throw new Error('NativeScript Widgets must not receive a Mason-owned flex update'); });
  const leaf = { resetState: vi.fn() } as any;
  const factory = vi.spyOn(Style, 'fromView').mockReturnValue(leaf);
  try {
    adoptForeignLayout(view);
    view[flexShrinkProperty.setNative](0.25);
    expect(original).not.toHaveBeenCalled();
    expect(leaf.flexShrink).toBe(0.25);
    view.style.flexShrink = 0.5;
    expect(leaf.flexShrink).toBe(0.5);
    releaseForeignLayout(view);
    expect(view[flexShrinkProperty.setNative]).toBe(original);
    expect(leaf.resetState).toHaveBeenCalledOnce();
  } finally { releaseForeignLayout(view); factory.mockRestore(); }
});
