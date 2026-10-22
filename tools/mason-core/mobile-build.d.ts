// Build-only declarations for preserved Windows branches. The mobile runtime
// resolves __WINDOWS__ to false and does not ship or support a Windows host.
// CSS signatures match beta.126's Windows bridge; this file is not published.
declare const __WINDOWS__: boolean;
declare namespace NativeScript.Mason {
  class Mason {
    constructor();
    static Instance(): Mason;
    Clear(): void;
    SetDeviceScale(scale: number): void;
    Preflight: boolean;
    CreateNode(anonymous: boolean): Node;
    PrintTree(node: Node): void;
    // The element's own (unshared) style buffer.
    StyleValues(element: IMasonElement): any;
    // A core (non-Mason) child's leaf style buffer, and its commit.
    ForeignStyleValues(element: any): any;
    SyncForeignStyle(element: any, d0: number, d1: number, d2: number, d3: number): void;
    ReparentChild(parent: any, child: any, index: number): void;
    RemoveChild(parent: any, child: any): void;
    // Percentage size (0-1, NaN clears) of a core (non-Mason) child.
    SetPercentWidth(element: any, fraction: number): void;
    SetPercentHeight(element: any, fraction: number): void;
    // Events Mason dispatches (click), bubbling through the element tree; returns a listener id.
    AddEventListener(element: any, type: string, listener: any): number;
    ElementFromPoint(element: any, x: number, y: number): any;
    RemoveEventListener(element: any, type: string, id: number): void;
    // Scroll offsets and sizes in DIPs; NaN keeps an axis in ScrollTo.
    ScrollLeft(element: any): number;
    ScrollTop(element: any): number;
    ScrollWidth(element: any): number;
    ScrollHeight(element: any): number;
    ClientWidth(element: any): number;
    ClientHeight(element: any): number;
    ScrollTo(element: any, left: number, top: number, smooth: boolean): void;
    // block/inlineMode: 0 start, 1 center, 2 end, 3 nearest.
    ScrollIntoView(element: any, block: number, inlineMode: number, smooth: boolean): void;
  }
  class Node { readonly Style: Style; }
  class Style { readonly Values: any; }
  interface IMasonElement { SyncStyle(d0: number, d1: number, d2: number, d3: number): void; }
class CssImageResult {
    readonly Image: any;
    readonly Width: number;
    readonly Height: number;
    readonly Overhang: number;
  }
class Css {
    static ApplyBackground(element: any, argb: number): void;
    static ClearBackground(element: any): void;
    static ApplyRadialGradientAt(element: any, centerX: number, centerY: number, radiusX: number, radiusY: number, stops: string, interpolation: string): void;
    static ApplyBackgroundImage(element: any, source: string, fit: number, alignX: number, alignY: number): void;
    static ApplyOpacity(element: any, opacity: number): void;
    static ApplyTransform(element: any, m11: number, m12: number, m21: number, m22: number, offsetX: number, offsetY: number): void;
    static ClearTransform(element: any): void;
    static ApplyCornerRadius(element: any, offsetX: number, offsetY: number, width: number, height: number, radiusX: number, radiusY: number): void;
    static ClearClip(element: any): void;
    static CreateShadow(width: number, height: number, blurRadius: number, spread: number, cornerRadius: number, offsetX: number, offsetY: number, argb: number): CssImageResult;
    static CreateBorder(width: number, height: number, topWidth: number, rightWidth: number, bottomWidth: number, leftWidth: number, topArgb: number, rightArgb: number, bottomArgb: number, leftArgb: number, cornerRadius: number): CssImageResult;
    static ApplyLinearGradient(element: any, angleDegrees: number, cornerX: number, cornerY: number, stops: string, interpolation: string): void;
    static ApplyRadialGradient(element: any, stops: string, interpolation: string): void;
    static ReparentChild(parent: any, child: any, index: number): void;
    static RemoveChild(parent: any, child: any): void;
    static ApplyShadow(element: any, offsetX: number, offsetY: number, blurRadius: number, argb: number, cornerRadius: number): void;
    static SetBoxShadow(element: any, shadows: string): void;
    static SetFilter(element: any, filter: string): void;
    static SetBackdropFilter(element: any, filter: string): void;
    static SetMask(element: any, spec: string): void;
    static SetBorderImage(element: any, spec: string): void;
    static SetBackgroundLayers(element: any, spec: string): void;
    static SetTransformOrigin(element: any, x: number, y: number): void;
    static SetTransforms(element: any, scaleX: number, scaleY: number, angle: number, translateX: number, translateY: number, originX: number, originY: number): void;
    static ClearShadow(element: any): void;
  }
}
