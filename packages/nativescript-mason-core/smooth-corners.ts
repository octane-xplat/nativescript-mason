import type { View } from './view';
import type { Scroll } from './scroll';
import { encodeSmoothCorners, type SmoothCorners } from './smooth-corners-config';
export type { SmoothCornerCurve, SmoothCorner, SmoothCorners } from './smooth-corners-config';

/** Mason View/Scroll native surface. No additional view or plugin registration. */
export type SmoothCornerSurface = View | Scroll | { readonly _view: unknown };

/** Shape the existing surface; overflow decides descendant clipping. Pass null
 * to restore authored CSS radii. Windows and non-Mason hosts throw explicitly. */
export function setSmoothCorners(surface: SmoothCornerSurface, options: SmoothCorners | null): void {
  const native = (surface as { readonly _view: unknown })._view as { style?: { setSmoothCorners?: (values: unknown) => boolean } };
  if (typeof native?.style?.setSmoothCorners !== 'function') {
    throw new Error('This Mason native host does not support smooth corners; iOS and Android adapters are required');
  }
  const values = options === null ? null : encodeSmoothCorners(options);
  let input: unknown = values;
  if (__ANDROID__ && values !== null) {
    const array = Array.create('double', values.length);
    values.forEach((value, index) => { array[index] = value; });
    input = array;
  }
  if (!native.style.setSmoothCorners(input)) throw new RangeError('The native Mason surface rejected smooth corner settings');
}
