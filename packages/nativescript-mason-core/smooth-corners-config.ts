/** Built-in native surface curves. Coordinates are device-independent pixels. */
export type SmoothCornerCurve = 'continuous' | 'squircle' | 'superellipse' | 'clothoid' | 'arc';
export interface SmoothCorner {
  radius: number;
  curve?: SmoothCornerCurve;
  smoothing?: number;
  exponent?: number;
  preserveSmoothing?: boolean;
}
export type SmoothCorners = number | SmoothCorner | {
  topLeft?: number | SmoothCorner;
  topRight?: number | SmoothCorner;
  bottomRight?: number | SmoothCorner;
  bottomLeft?: number | SmoothCorner;
};
const curves: SmoothCornerCurve[] = ['continuous', 'squircle', 'superellipse', 'clothoid', 'arc'];

/** Native transport only; curve generation and fitting belong to Rust. */
export function encodeSmoothCorners(options: SmoothCorners): number[] {
  function corner(input: number | SmoothCorner = 0): number[] {
    const value = typeof input === 'number' ? { radius: input } : input;
    const { radius, curve = 'continuous', smoothing = 0.65, exponent = 4, preserveSmoothing = true } = value;
    const family = curves.indexOf(curve);
    if (!Number.isFinite(radius) || radius < 0 || family < 0 ||
        !Number.isFinite(smoothing) || smoothing < 0 || smoothing > 1 ||
        !Number.isFinite(exponent) || exponent < 2 || typeof preserveSmoothing !== 'boolean') {
      throw new RangeError('Invalid smooth corner: require finite radius >= 0, known curve, smoothing in [0,1], exponent >= 2 and boolean preserveSmoothing');
    }
    return [radius, family, smoothing, exponent, Number(preserveSmoothing)];
  }
  if (typeof options === 'number' || 'radius' in options) {
    const value = corner(options);
    return [...value, ...value, ...value, ...value];
  }
  return [options.topLeft, options.topRight, options.bottomRight, options.bottomLeft].flatMap(corner);
}
