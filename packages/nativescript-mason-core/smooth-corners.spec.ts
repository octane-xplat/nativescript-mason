import { describe, expect, it } from 'vitest';
import { encodeSmoothCorners } from './smooth-corners-config';
import { setSmoothCorners } from './smooth-corners';

describe('built-in smooth corner transport', () => {
  it('resolves scalar, default and mixed corner settings without geometry in JS', () => {
    expect(encodeSmoothCorners(24)).toEqual(Array(4).fill([24, 0, 0.65, 4, 1]).flat());
    expect(encodeSmoothCorners({ topRight: { radius: 9, curve: 'superellipse', exponent: 8, preserveSmoothing: false } })).toEqual([
      0, 0, 0.65, 4, 1, 9, 2, 0.65, 8, 0, 0, 0, 0.65, 4, 1, 0, 0, 0.65, 4, 1,
    ]);
  });
  it('rejects invalid values before touching the native surface', () => {
    for (const value of [-1, NaN, Infinity]) expect(() => encodeSmoothCorners(value)).toThrow(RangeError);
    for (const input of [{ radius: 2, smoothing: 2 }, { radius: 2, exponent: 1 }, { radius: 2, curve: 'unknown' }, { radius: 2, preserveSmoothing: 1 }]) {
      expect(() => encodeSmoothCorners(input as never)).toThrow(RangeError);
    }
    let calls = 0;
    const host = { _view: { style: { setSmoothCorners() { calls++; return true; } } } };
    expect(() => setSmoothCorners(host, -1)).toThrow();
    expect(calls).toBe(0);
  });
  it('updates and clears the existing native owner, and rejects unsupported hosts', () => {
    const calls: unknown[] = [];
    const host = { _view: { style: { setSmoothCorners(value: unknown) { calls.push(value); return true; } } } };
    setSmoothCorners(host, 24);
    setSmoothCorners(host, null);
    expect(calls).toEqual([encodeSmoothCorners(24), null]);
    expect(() => setSmoothCorners({ _view: {} }, 24)).toThrow('does not support');
    expect(() => setSmoothCorners({ _view: { style: { setSmoothCorners: () => false } } }, 24)).toThrow(RangeError);
  });
});
