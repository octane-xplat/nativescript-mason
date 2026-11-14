import { afterEach, describe, expect, it, vi } from 'vitest';
import { Observable } from '@nativescript/core/data/observable';
import { Style as CoreStyle } from '@nativescript/core/ui/styling/style';
import { unsetValue } from '@nativescript/core/ui/core/properties';
import { Style } from './style';
import { adoptForeignLayout, releaseForeignLayout } from './foreign-layout';
import './properties';

function foreign() {
  const view = new Observable() as any;
  Object.assign(view, {
    nativeViewProtected: {},
    _onCssStateChange() {},
    eachChild() {},
    _batchUpdate: (update: () => void) => update(),
    getEffectivePaddingShorthand: () => 0,
    getEffectiveMarginShorthand: () => 0,
  });
  view.style = new CoreStyle({ get: () => view, deref: () => view, clear() {} } as any);
  return { view, style: view.style as any };
}

function leafTransport() {
  const leaf: Record<string, unknown> = {};
  vi.spyOn(Style, 'fromView').mockImplementation(() => leaf as never);
  return leaf;
}

const adopted: any[] = [];
afterEach(() => {
  for (const view of adopted.splice(0)) releaseForeignLayout(view);
  vi.restoreAllMocks();
});

describe('foreign child layout on Windows', () => {
  it('leaves the XAML box to the panel but mirrors authored min sizes, flex, position and grid placement', () => {
    const leaf = leafTransport();
    const { view, style } = foreign();
    Object.assign(style, { width: 31, height: 36, minWidth: 12, maxHeight: 101, marginLeft: 4, flexGrow: 2, flexShrink: 0, alignSelf: 'center', gridRowStart: 2 });
    adoptForeignLayout(view);
    adopted.push(view);
    expect(leaf).toEqual({ minWidth: 12, flexGrow: 2, flexShrink: 0, alignSelf: 'center', gridArea: '2 / auto / auto / auto' });
    // An authored 0 reaches the leaf: the panel preserves it because XAML's
    // MinHeight reports only the unmarked default.
    style.minHeight = 0;
    expect(leaf.minHeight).toBe(0);
    // Removing the min restores Mason's automatic minimum, not core's 0.
    style.minHeight = unsetValue;
    expect(leaf.minHeight).toBe('auto');
    style.width = 54;
    style.marginTop = 3;
    style.flexGrow = unsetValue;
    expect(leaf).toEqual({ minWidth: 12, minHeight: 'auto', flexGrow: 0, flexShrink: 0, alignSelf: 'center', gridArea: '2 / auto / auto / auto' });
  });

  it('writes automatic minimums only when a reused leaf gets every value', () => {
    const leaf = leafTransport();
    const first = foreign();
    adoptForeignLayout(first.view);
    adopted.push(first.view);
    // Nothing authored: a fresh leaf keeps Mason's automatic minimum.
    expect(leaf.minWidth).toBeUndefined();
    expect(leaf.minHeight).toBeUndefined();
    const second = foreign();
    second.view.nativeViewProtected = first.view.nativeViewProtected;
    adoptForeignLayout(second.view);
    adopted.push(second.view);
    expect(leaf).toMatchObject({ minWidth: 'auto', minHeight: 'auto' });
  });
});
