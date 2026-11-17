import { expect, it, vi } from 'vitest';
import { setSmoothCorners } from './smooth-corners';
import { encodeSmoothCorners } from './smooth-corners-config';

it('converts Android settings to a native double array and clears without an array', () => {
  const original = Array.create;
  const create = vi.fn((_type: string, length: number) => Array(length).fill(0));
  Object.defineProperty(Array, 'create', { configurable: true, value: create });
  try {
    const calls: unknown[] = [];
    const host = { _view: { style: { setSmoothCorners(values: unknown) { calls.push(values); return true; } } } };
    setSmoothCorners(host, 12);
    setSmoothCorners(host, null);
    expect(create).toHaveBeenCalledExactlyOnceWith('double', 20);
    expect(calls).toEqual([encodeSmoothCorners(12), null]);
  } finally {
    if (original === undefined) Reflect.deleteProperty(Array, 'create');
    else Object.defineProperty(Array, 'create', { configurable: true, value: original });
  }
});
