import { ViewBase } from '../common';
export class View extends ViewBase {
  /** iOS-only layout root backed by a UIVisualEffectView. Caller owns its effect. */
  static readonly materialViewClass: typeof View;
}
