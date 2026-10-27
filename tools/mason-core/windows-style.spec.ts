import { describe, expect, it, vi } from 'vitest';
import { Style } from '../../tmp/nativescript-mason-core/style';
import { isMasonView_ } from '../../tmp/nativescript-mason-core/symbols';

const nativeBytes = new Uint8Array(744);
const nativeValues = new DataView(nativeBytes.buffer);
nativeValues.setUint32(320, 7, true); // The native default is shared; a JS copy is not.
const read = vi.fn(() => nativeBytes.slice());
const write = vi.fn((_element, json: string) => {
  expect(typeof json).toBe('string');
  const values = JSON.parse(json);
  expect(values).toHaveLength(744);
  nativeBytes.set(values);
});
const native = { NodeKind: 0, Style: null, Node: {}, SyncStyle: vi.fn() };
const grid = { GridTemplateColumnsCss: '', UpdateGrid: vi.fn((...args) => { grid.GridTemplateColumnsCss = args[9]; }) };
const getStyle = vi.fn(() => grid);
const engine = { ReadStyleValues: read };
vi.stubGlobal('NativeScript', { Mason: { Mason: { Instance: () => engine } }, MasonCore: { StyleTransport: { WriteStyleValues: write, GetStyle: getStyle } } });

describe('Windows core copied style transport', () => {
  it('retains every same-turn write and serializes bytes for the managed adapter', async () => {
    const owner = { [isMasonView_]: true, windows: native };
    const style = Style.fromView(owner as never, native);
    style.width = 100;
    style.height = 60;
    await Promise.resolve();
    expect(read).toHaveBeenCalledTimes(1);
    expect(nativeValues.getUint8(106)).toBe(1);
    expect(nativeValues.getUint8(107)).toBe(1);
    expect(nativeValues.getFloat32(108, true)).toBe(100);
    expect(nativeValues.getFloat32(112, true)).toBe(60);
    expect(write).toHaveBeenCalledTimes(1);
    expect(native.SyncStyle).toHaveBeenCalledTimes(1);
    style.width = 140;
    style.height = 90;
    await Promise.resolve();
    expect(nativeValues.getFloat32(108, true)).toBe(140);
    expect(nativeValues.getFloat32(112, true)).toBe(90);
    expect(write).toHaveBeenCalledTimes(2);
  });
  it('uses IMasonElement.Style for grid CSS instead of the unrelated XAML Style property', () => {
    const style = Style.fromView({ [isMasonView_]: true, windows: native } as never, native);
    style.gridTemplateColumns = '100px 100px';
    expect(getStyle).toHaveBeenCalledWith(native);
    expect(grid.UpdateGrid).toHaveBeenCalledOnce();
    expect(style.gridTemplateColumns).toBe('100px 100px');
  });
});
