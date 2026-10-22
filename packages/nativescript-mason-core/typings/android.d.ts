/// <reference path="android-declarations.d.ts"/>

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Affine {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Affine.Companion>;
						public getIDENTITY(): org.nativescript.mason.masonkit.Affine;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class AppFonts {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.AppFonts>;
					public static INSTANCE: org.nativescript.mason.masonkit.AppFonts;
					public static getFontsDirectory(): string | null;
					public static setFontsDirectory(param0: string | null): void;
					public static resolve(param0: string, param1: globalAndroid.content.Context | null): string | null;
					public static typeface(param0: string, it: globalAndroid.content.Context | null): globalAndroid.graphics.Typeface | null;
					public static resolve(family: string): string | null;
					public static typeface(family: string): globalAndroid.graphics.Typeface | null;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class AvailableSpace {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.AvailableSpace>;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.AvailableSpace | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module AvailableSpace {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.AvailableSpace.Companion>;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.AvailableSpace | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module AvailableSpace {
					export class Definite extends org.nativescript.mason.masonkit.AvailableSpace {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.AvailableSpace.Definite>;
						public constructor(points: number);
						public getPoints(): number;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.AvailableSpace.Definite;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module AvailableSpace {
					export class MaxContent extends org.nativescript.mason.masonkit.AvailableSpace {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.AvailableSpace.MaxContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.AvailableSpace.MaxContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module AvailableSpace {
					export class MinContent extends org.nativescript.mason.masonkit.AvailableSpace {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.AvailableSpace.MinContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.AvailableSpace.MinContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Background {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Background>;
					public constructor(style: org.nativescript.mason.masonkit.Style);
					public getStyle(): org.nativescript.mason.masonkit.Style;
					public getColor(): java.lang.Integer | null;
					public setColor(value: java.lang.Integer | null): void;
					public getLayers(): java.util.List<org.nativescript.mason.masonkit.BackgroundLayer>;
					public setLayers(param0: java.util.List<org.nativescript.mason.masonkit.BackgroundLayer>): void;
					public getHasTextClip(): boolean;
					public applyBackgroundRepeat(value: string): void;
					public applyBackgroundPosition(value: string): void;
					public applyBackgroundPositionX(value: string): void;
					public applyBackgroundPositionY(value: string): void;
					public applyBackgroundSize(value: string): void;
					public applyBackgroundClip(value: string): void;
					public applyBackgroundOrigin(value: string): void;
					public applyBackgroundAttachment(value: string): void;
					public applyBackgroundBlendMode(value: string): void;
					public hasLocalLayer(): boolean;
					public clear(): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Background {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Background.Companion>;
						public invalidateFixedDescendants(it: globalAndroid.view.ViewGroup): void;
						public boxGradientLayer(area: org.nativescript.mason.masonkit.Background, this_: globalAndroid.view.View, background: org.nativescript.mason.masonkit.Node, view: number, node: number): org.nativescript.mason.masonkit.BackgroundLayer | null;
						public positioningArea(root: org.nativescript.mason.masonkit.BackgroundLayer, content: globalAndroid.view.View, area: org.nativescript.mason.masonkit.Node, this_: number, layer: number): globalAndroid.graphics.RectF;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Background {
					export module Companion {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Background.Companion.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundAttachment {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundAttachment>;
					public static SCROLL: org.nativescript.mason.masonkit.BackgroundAttachment;
					public static FIXED: org.nativescript.mason.masonkit.BackgroundAttachment;
					public static LOCAL: org.nativescript.mason.masonkit.BackgroundAttachment;
					public getCss(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.BackgroundAttachment>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.BackgroundAttachment;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundAttachment {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundAttachment.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.BackgroundAttachment | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundBlendMode {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundBlendMode>;
					public static NORMAL: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static MULTIPLY: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static SCREEN: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static OVERLAY: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static DARKEN: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static LIGHTEN: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static COLOR_DODGE: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static COLOR_BURN: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static HARD_LIGHT: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static SOFT_LIGHT: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static DIFFERENCE: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static EXCLUSION: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static HUE: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static SATURATION: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static COLOR: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static LUMINOSITY: org.nativescript.mason.masonkit.BackgroundBlendMode;
					public getCss(): string;
					public toBlendMode(): globalAndroid.graphics.BlendMode | null;
					public toPorterDuff(): globalAndroid.graphics.PorterDuff.Mode | null;
					public apply(it: globalAndroid.graphics.Paint): void;
					public clear(paint: globalAndroid.graphics.Paint): void;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.BackgroundBlendMode>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.BackgroundBlendMode;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundBlendMode {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundBlendMode.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.BackgroundBlendMode | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundBlendMode {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundBlendMode.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundClip {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundClip>;
					public static BORDER_BOX: org.nativescript.mason.masonkit.BackgroundClip;
					public static PADDING_BOX: org.nativescript.mason.masonkit.BackgroundClip;
					public static CONTENT_BOX: org.nativescript.mason.masonkit.BackgroundClip;
					public static TEXT: org.nativescript.mason.masonkit.BackgroundClip;
					public getCss(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.BackgroundClip>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.BackgroundClip;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundClip {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundClip.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.BackgroundClip | null;
						public parseOrigin(it: string): org.nativescript.mason.masonkit.BackgroundClip | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundLayer {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundLayer>;
					public constructor(image: string | null, repeat: org.nativescript.mason.masonkit.BackgroundRepeat, position: org.nativescript.mason.masonkit.BackgroundPosition | null, size: org.nativescript.mason.masonkit.BackgroundSize | null, gradient: org.nativescript.mason.masonkit.Gradient | null, shader: globalAndroid.graphics.Shader | null, shaderWidth: number, shaderHeight: number, bitmap: globalAndroid.graphics.Bitmap | null, clip: org.nativescript.mason.masonkit.BackgroundClip, origin: org.nativescript.mason.masonkit.BackgroundClip, attachment: org.nativescript.mason.masonkit.BackgroundAttachment, blendMode: org.nativescript.mason.masonkit.BackgroundBlendMode, bitmapIsDevicePx: boolean, svg: org.nativescript.mason.masonkit.SvgDocument | null, svgFailed: boolean, svgColor: number, layerColor: java.lang.Integer | null);
					public getImage(): string | null;
					public setImage(param0: string | null): void;
					public getRepeat(): org.nativescript.mason.masonkit.BackgroundRepeat;
					public setRepeat(param0: org.nativescript.mason.masonkit.BackgroundRepeat): void;
					public getPosition(): org.nativescript.mason.masonkit.BackgroundPosition | null;
					public setPosition(param0: org.nativescript.mason.masonkit.BackgroundPosition | null): void;
					public getSize(): org.nativescript.mason.masonkit.BackgroundSize | null;
					public setSize(param0: org.nativescript.mason.masonkit.BackgroundSize | null): void;
					public getGradient(): org.nativescript.mason.masonkit.Gradient | null;
					public setGradient(param0: org.nativescript.mason.masonkit.Gradient | null): void;
					public getShader(): globalAndroid.graphics.Shader | null;
					public setShader(param0: globalAndroid.graphics.Shader | null): void;
					public getShaderWidth(): number;
					public setShaderWidth(param0: number): void;
					public getShaderHeight(): number;
					public setShaderHeight(param0: number): void;
					public getBitmap(): globalAndroid.graphics.Bitmap | null;
					public setBitmap(param0: globalAndroid.graphics.Bitmap | null): void;
					public getClip(): org.nativescript.mason.masonkit.BackgroundClip;
					public setClip(param0: org.nativescript.mason.masonkit.BackgroundClip): void;
					public getOrigin(): org.nativescript.mason.masonkit.BackgroundClip;
					public setOrigin(param0: org.nativescript.mason.masonkit.BackgroundClip): void;
					public getAttachment(): org.nativescript.mason.masonkit.BackgroundAttachment;
					public setAttachment(param0: org.nativescript.mason.masonkit.BackgroundAttachment): void;
					public getBlendMode(): org.nativescript.mason.masonkit.BackgroundBlendMode;
					public setBlendMode(param0: org.nativescript.mason.masonkit.BackgroundBlendMode): void;
					public getBitmapIsDevicePx(): boolean;
					public setBitmapIsDevicePx(param0: boolean): void;
					public getSvg(): org.nativescript.mason.masonkit.SvgDocument | null;
					public setSvg(param0: org.nativescript.mason.masonkit.SvgDocument | null): void;
					public getSvgFailed(): boolean;
					public setSvgFailed(param0: boolean): void;
					public getSvgColor(): number;
					public setSvgColor(param0: number): void;
					public getLayerColor(): java.lang.Integer | null;
					public setLayerColor(param0: java.lang.Integer | null): void;
					public isDefault(): boolean;
					public component1(): string | null;
					public component2(): org.nativescript.mason.masonkit.BackgroundRepeat;
					public component3(): org.nativescript.mason.masonkit.BackgroundPosition | null;
					public component4(): org.nativescript.mason.masonkit.BackgroundSize | null;
					public component5(): org.nativescript.mason.masonkit.Gradient | null;
					public component6(): globalAndroid.graphics.Shader | null;
					public component7(): number;
					public component8(): number;
					public component9(): globalAndroid.graphics.Bitmap | null;
					public component10(): org.nativescript.mason.masonkit.BackgroundClip;
					public component11(): org.nativescript.mason.masonkit.BackgroundClip;
					public component12(): org.nativescript.mason.masonkit.BackgroundAttachment;
					public component13(): org.nativescript.mason.masonkit.BackgroundBlendMode;
					public component14(): boolean;
					public component15(): org.nativescript.mason.masonkit.SvgDocument | null;
					public component16(): boolean;
					public component17(): number;
					public component18(): java.lang.Integer | null;
					public copy(image: string | null, repeat: org.nativescript.mason.masonkit.BackgroundRepeat, position: org.nativescript.mason.masonkit.BackgroundPosition | null, size: org.nativescript.mason.masonkit.BackgroundSize | null, gradient: org.nativescript.mason.masonkit.Gradient | null, shader: globalAndroid.graphics.Shader | null, shaderWidth: number, shaderHeight: number, bitmap: globalAndroid.graphics.Bitmap | null, clip: org.nativescript.mason.masonkit.BackgroundClip, origin: org.nativescript.mason.masonkit.BackgroundClip, attachment: org.nativescript.mason.masonkit.BackgroundAttachment, blendMode: org.nativescript.mason.masonkit.BackgroundBlendMode, bitmapIsDevicePx: boolean, svg: org.nativescript.mason.masonkit.SvgDocument | null, svgFailed: boolean, svgColor: number, layerColor: java.lang.Integer | null): org.nativescript.mason.masonkit.BackgroundLayer;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundOffset {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundOffset>;
					public constructor(fraction: number, px: number);
					public getFraction(): number;
					public setFraction(param0: number): void;
					public getPx(): number;
					public setPx(param0: number): void;
					public resolve(area: number, drawSize: number): number;
					public cssValue(horizontal: boolean): string;
					public component1(): number;
					public component2(): number;
					public copy(fraction: number, px: number): org.nativescript.mason.masonkit.BackgroundOffset;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundPosition {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundPosition>;
					public constructor(x: org.nativescript.mason.masonkit.BackgroundOffset, y: org.nativescript.mason.masonkit.BackgroundOffset);
					public getX(): org.nativescript.mason.masonkit.BackgroundOffset;
					public setX(param0: org.nativescript.mason.masonkit.BackgroundOffset): void;
					public getY(): org.nativescript.mason.masonkit.BackgroundOffset;
					public setY(param0: org.nativescript.mason.masonkit.BackgroundOffset): void;
					public getCssValue(): string;
					public component1(): org.nativescript.mason.masonkit.BackgroundOffset;
					public component2(): org.nativescript.mason.masonkit.BackgroundOffset;
					public copy(x: org.nativescript.mason.masonkit.BackgroundOffset, y: org.nativescript.mason.masonkit.BackgroundOffset): org.nativescript.mason.masonkit.BackgroundPosition;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundRepeat {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundRepeat>;
					public static REPEAT: org.nativescript.mason.masonkit.BackgroundRepeat;
					public static REPEAT_X: org.nativescript.mason.masonkit.BackgroundRepeat;
					public static REPEAT_Y: org.nativescript.mason.masonkit.BackgroundRepeat;
					public static NO_REPEAT: org.nativescript.mason.masonkit.BackgroundRepeat;
					public constructor(x: org.nativescript.mason.masonkit.RepeatStyle, y: org.nativescript.mason.masonkit.RepeatStyle);
					public getX(): org.nativescript.mason.masonkit.RepeatStyle;
					public getY(): org.nativescript.mason.masonkit.RepeatStyle;
					public getValue(): string;
					public component1(): org.nativescript.mason.masonkit.RepeatStyle;
					public component2(): org.nativescript.mason.masonkit.RepeatStyle;
					public copy(x: org.nativescript.mason.masonkit.RepeatStyle, y: org.nativescript.mason.masonkit.RepeatStyle): org.nativescript.mason.masonkit.BackgroundRepeat;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BackgroundRepeat {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundRepeat.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.BackgroundRepeat | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BackgroundSize {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BackgroundSize>;
					public constructor(width: org.nativescript.mason.masonkit.BackgroundOffset | null, height: org.nativescript.mason.masonkit.BackgroundOffset | null, keyword: string | null);
					public getWidth(): org.nativescript.mason.masonkit.BackgroundOffset | null;
					public setWidth(param0: org.nativescript.mason.masonkit.BackgroundOffset | null): void;
					public getHeight(): org.nativescript.mason.masonkit.BackgroundOffset | null;
					public setHeight(param0: org.nativescript.mason.masonkit.BackgroundOffset | null): void;
					public getKeyword(): string | null;
					public setKeyword(param0: string | null): void;
					public getCssValue(): string;
					public component1(): org.nativescript.mason.masonkit.BackgroundOffset | null;
					public component2(): org.nativescript.mason.masonkit.BackgroundOffset | null;
					public component3(): string | null;
					public copy(width: org.nativescript.mason.masonkit.BackgroundOffset | null, height: org.nativescript.mason.masonkit.BackgroundOffset | null, keyword: string | null): org.nativescript.mason.masonkit.BackgroundSize;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Circle extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Circle>;
						public constructor(radius: org.nativescript.mason.masonkit.ShapeRadius, position: org.nativescript.mason.masonkit.ShapePosition);
						public getRadius(): org.nativescript.mason.masonkit.ShapeRadius;
						public getPosition(): org.nativescript.mason.masonkit.ShapePosition;
						public component1(): org.nativescript.mason.masonkit.ShapeRadius;
						public component2(): org.nativescript.mason.masonkit.ShapePosition;
						public copy(radius: org.nativescript.mason.masonkit.ShapeRadius, position: org.nativescript.mason.masonkit.ShapePosition): org.nativescript.mason.masonkit.BasicShape.Circle;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Ellipse extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Ellipse>;
						public constructor(rx: org.nativescript.mason.masonkit.ShapeRadius, ry: org.nativescript.mason.masonkit.ShapeRadius, position: org.nativescript.mason.masonkit.ShapePosition);
						public getRx(): org.nativescript.mason.masonkit.ShapeRadius;
						public getRy(): org.nativescript.mason.masonkit.ShapeRadius;
						public getPosition(): org.nativescript.mason.masonkit.ShapePosition;
						public component1(): org.nativescript.mason.masonkit.ShapeRadius;
						public component2(): org.nativescript.mason.masonkit.ShapeRadius;
						public component3(): org.nativescript.mason.masonkit.ShapePosition;
						public copy(rx: org.nativescript.mason.masonkit.ShapeRadius, ry: org.nativescript.mason.masonkit.ShapeRadius, position: org.nativescript.mason.masonkit.ShapePosition): org.nativescript.mason.masonkit.BasicShape.Ellipse;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Inset extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Inset>;
						public constructor(top: org.nativescript.mason.masonkit.CssLength, right: org.nativescript.mason.masonkit.CssLength, bottom: org.nativescript.mason.masonkit.CssLength, left: org.nativescript.mason.masonkit.CssLength, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null);
						public getTop(): org.nativescript.mason.masonkit.CssLength;
						public getRight(): org.nativescript.mason.masonkit.CssLength;
						public getBottom(): org.nativescript.mason.masonkit.CssLength;
						public getLeft(): org.nativescript.mason.masonkit.CssLength;
						public getRadii(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public component1(): org.nativescript.mason.masonkit.CssLength;
						public component2(): org.nativescript.mason.masonkit.CssLength;
						public component3(): org.nativescript.mason.masonkit.CssLength;
						public component4(): org.nativescript.mason.masonkit.CssLength;
						public component5(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public copy(top: org.nativescript.mason.masonkit.CssLength, right: org.nativescript.mason.masonkit.CssLength, bottom: org.nativescript.mason.masonkit.CssLength, left: org.nativescript.mason.masonkit.CssLength, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null): org.nativescript.mason.masonkit.BasicShape.Inset;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class PathData extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.PathData>;
						public constructor(evenOdd: boolean, commands: java.util.List<any>);
						public getEvenOdd(): boolean;
						public getCommands(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
						public component1(): boolean;
						public component2(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
						public copy(evenOdd: boolean, commands: java.util.List<any>): org.nativescript.mason.masonkit.BasicShape.PathData;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Polygon extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Polygon>;
						public constructor(evenOdd: boolean, points: java.util.List<any>);
						public getEvenOdd(): boolean;
						public getPoints(): java.util.List<any>;
						public component1(): boolean;
						public component2(): java.util.List<any>;
						public copy(evenOdd: boolean, points: java.util.List<any>): org.nativescript.mason.masonkit.BasicShape.Polygon;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Rect extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Rect>;
						public constructor(top: org.nativescript.mason.masonkit.CssLength | null, right: org.nativescript.mason.masonkit.CssLength | null, bottom: org.nativescript.mason.masonkit.CssLength | null, left: org.nativescript.mason.masonkit.CssLength | null, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null);
						public getTop(): org.nativescript.mason.masonkit.CssLength | null;
						public getRight(): org.nativescript.mason.masonkit.CssLength | null;
						public getBottom(): org.nativescript.mason.masonkit.CssLength | null;
						public getLeft(): org.nativescript.mason.masonkit.CssLength | null;
						public getRadii(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public component1(): org.nativescript.mason.masonkit.CssLength | null;
						public component2(): org.nativescript.mason.masonkit.CssLength | null;
						public component3(): org.nativescript.mason.masonkit.CssLength | null;
						public component4(): org.nativescript.mason.masonkit.CssLength | null;
						public component5(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public copy(top: org.nativescript.mason.masonkit.CssLength | null, right: org.nativescript.mason.masonkit.CssLength | null, bottom: org.nativescript.mason.masonkit.CssLength | null, left: org.nativescript.mason.masonkit.CssLength | null, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null): org.nativescript.mason.masonkit.BasicShape.Rect;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BasicShape {
					export class Xywh extends org.nativescript.mason.masonkit.BasicShape {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BasicShape.Xywh>;
						public constructor(x: org.nativescript.mason.masonkit.CssLength, y: org.nativescript.mason.masonkit.CssLength, w: org.nativescript.mason.masonkit.CssLength, h: org.nativescript.mason.masonkit.CssLength, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null);
						public getX(): org.nativescript.mason.masonkit.CssLength;
						public getY(): org.nativescript.mason.masonkit.CssLength;
						public getW(): org.nativescript.mason.masonkit.CssLength;
						public getH(): org.nativescript.mason.masonkit.CssLength;
						public getRadii(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public component1(): org.nativescript.mason.masonkit.CssLength;
						public component2(): org.nativescript.mason.masonkit.CssLength;
						public component3(): org.nativescript.mason.masonkit.CssLength;
						public component4(): org.nativescript.mason.masonkit.CssLength;
						public component5(): java.util.List<org.nativescript.mason.masonkit.CssLength> | null;
						public copy(x: org.nativescript.mason.masonkit.CssLength, y: org.nativescript.mason.masonkit.CssLength, w: org.nativescript.mason.masonkit.CssLength, h: org.nativescript.mason.masonkit.CssLength, radii: java.util.List<org.nativescript.mason.masonkit.CssLength> | null): org.nativescript.mason.masonkit.BasicShape.Xywh;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Border {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Border>;
					public constructor(owner: org.nativescript.mason.masonkit.Style, side: org.nativescript.mason.masonkit.Border.Side);
					public getOwner(): org.nativescript.mason.masonkit.Style;
					public getKeys(): org.nativescript.mason.masonkit.Border.IKey;
					public getWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public setWidth(oldValue: org.nativescript.mason.masonkit.LengthPercentage): void;
					public getColor(): number;
					public setColor(this_: number): void;
					public getStyle(): org.nativescript.mason.masonkit.enums.BorderStyle;
					public setStyle(this_: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getCorner1Radius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setCorner1Radius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getCorner2Radius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setCorner2Radius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getCorner1Exponent(): number;
					public setCorner1Exponent(value: number): void;
					public getCorner2Exponent(): number;
					public setCorner2Exponent(value: number): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class IKey {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.IKey>;
						/**
						 * Constructs a new instance of the org.nativescript.mason.masonkit.Border$IKey interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getWidthValue(): number;
							getWidthType(): number;
							getStyle(): number;
							getColor(): number;
							getCorner1RadiusXType(): number;
							getCorner1RadiusXValue(): number;
							getCorner1RadiusYType(): number;
							getCorner1RadiusYValue(): number;
							getCorner1Exponent(): number;
							getCorner2RadiusXType(): number;
							getCorner2RadiusXValue(): number;
							getCorner2RadiusYType(): number;
							getCorner2RadiusYValue(): number;
							getCorner2Exponent(): number;
						});
						public constructor();
						public getWidthValue(): number;
						public getWidthType(): number;
						public getStyle(): number;
						public getColor(): number;
						public getCorner1RadiusXType(): number;
						public getCorner1RadiusXValue(): number;
						public getCorner1RadiusYType(): number;
						public getCorner1RadiusYValue(): number;
						public getCorner1Exponent(): number;
						public getCorner2RadiusXType(): number;
						public getCorner2RadiusXValue(): number;
						public getCorner2RadiusYType(): number;
						public getCorner2RadiusYValue(): number;
						public getCorner2Exponent(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class IKeyCorner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.IKeyCorner>;
						/**
						 * Constructs a new instance of the org.nativescript.mason.masonkit.Border$IKeyCorner interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getXType(): number;
							getXValue(): number;
							getYType(): number;
							getYValue(): number;
							getExponent(): number;
						});
						public constructor();
						public getXType(): number;
						public getXValue(): number;
						public getYType(): number;
						public getYValue(): number;
						public getExponent(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class Keys {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys>;
						public constructor();
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export module Keys {
						export class Bottom extends org.nativescript.mason.masonkit.Border.IKey {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys.Bottom>;
							public constructor();
							public getWidthValue(): number;
							public getWidthType(): number;
							public getStyle(): number;
							public getColor(): number;
							public getCorner1RadiusXType(): number;
							public getCorner1RadiusXValue(): number;
							public getCorner1RadiusYType(): number;
							public getCorner1RadiusYValue(): number;
							public getCorner1Exponent(): number;
							public getCorner2RadiusXType(): number;
							public getCorner2RadiusXValue(): number;
							public getCorner2RadiusYType(): number;
							public getCorner2RadiusYValue(): number;
							public getCorner2Exponent(): number;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export module Keys {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys.Companion>;
							public getLeft(): org.nativescript.mason.masonkit.Border.Keys.Left;
							public getTop(): org.nativescript.mason.masonkit.Border.Keys.Top;
							public getRight(): org.nativescript.mason.masonkit.Border.Keys.Right;
							public getBottom(): org.nativescript.mason.masonkit.Border.Keys.Bottom;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export module Keys {
						export class Left extends org.nativescript.mason.masonkit.Border.IKey {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys.Left>;
							public constructor();
							public getWidthValue(): number;
							public getWidthType(): number;
							public getStyle(): number;
							public getColor(): number;
							public getCorner1RadiusXType(): number;
							public getCorner1RadiusXValue(): number;
							public getCorner1RadiusYType(): number;
							public getCorner1RadiusYValue(): number;
							public getCorner1Exponent(): number;
							public getCorner2RadiusXType(): number;
							public getCorner2RadiusXValue(): number;
							public getCorner2RadiusYType(): number;
							public getCorner2RadiusYValue(): number;
							public getCorner2Exponent(): number;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export module Keys {
						export class Right extends org.nativescript.mason.masonkit.Border.IKey {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys.Right>;
							public constructor();
							public getWidthValue(): number;
							public getWidthType(): number;
							public getStyle(): number;
							public getColor(): number;
							public getCorner1RadiusXType(): number;
							public getCorner1RadiusXValue(): number;
							public getCorner1RadiusYType(): number;
							public getCorner1RadiusYValue(): number;
							public getCorner1Exponent(): number;
							public getCorner2RadiusXType(): number;
							public getCorner2RadiusXValue(): number;
							public getCorner2RadiusYType(): number;
							public getCorner2RadiusYValue(): number;
							public getCorner2Exponent(): number;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export module Keys {
						export class Top extends org.nativescript.mason.masonkit.Border.IKey {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Keys.Top>;
							public constructor();
							public getWidthValue(): number;
							public getWidthType(): number;
							public getStyle(): number;
							public getColor(): number;
							public getCorner1RadiusXType(): number;
							public getCorner1RadiusXValue(): number;
							public getCorner1RadiusYType(): number;
							public getCorner1RadiusYValue(): number;
							public getCorner1Exponent(): number;
							public getCorner2RadiusXType(): number;
							public getCorner2RadiusXValue(): number;
							public getCorner2RadiusYType(): number;
							public getCorner2RadiusYValue(): number;
							public getCorner2Exponent(): number;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class Side {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.Side>;
						public static Left: org.nativescript.mason.masonkit.Border.Side;
						public static Top: org.nativescript.mason.masonkit.Border.Side;
						public static Right: org.nativescript.mason.masonkit.Border.Side;
						public static Bottom: org.nativescript.mason.masonkit.Border.Side;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Border.Side>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Border.Side;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.WhenMappings>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class cornerBottomLeftKeys extends org.nativescript.mason.masonkit.Border.IKeyCorner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.cornerBottomLeftKeys>;
						public static INSTANCE: org.nativescript.mason.masonkit.Border.cornerBottomLeftKeys;
						public getXType(): number;
						public getXValue(): number;
						public getYType(): number;
						public getYValue(): number;
						public getExponent(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class cornerBottomRightKeys extends org.nativescript.mason.masonkit.Border.IKeyCorner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.cornerBottomRightKeys>;
						public static INSTANCE: org.nativescript.mason.masonkit.Border.cornerBottomRightKeys;
						public getXType(): number;
						public getXValue(): number;
						public getYType(): number;
						public getYValue(): number;
						public getExponent(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class cornerTopLeftKeys extends org.nativescript.mason.masonkit.Border.IKeyCorner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.cornerTopLeftKeys>;
						public static INSTANCE: org.nativescript.mason.masonkit.Border.cornerTopLeftKeys;
						public getXType(): number;
						public getXValue(): number;
						public getYType(): number;
						public getYValue(): number;
						public getExponent(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Border {
					export class cornerTopRightKeys extends org.nativescript.mason.masonkit.Border.IKeyCorner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Border.cornerTopRightKeys>;
						public static INSTANCE: org.nativescript.mason.masonkit.Border.cornerTopRightKeys;
						public getXType(): number;
						public getXValue(): number;
						public getYType(): number;
						public getYValue(): number;
						public getExponent(): number;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BorderImageRepeat {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderImageRepeat>;
					public static STRETCH: org.nativescript.mason.masonkit.BorderImageRepeat;
					public static REPEAT: org.nativescript.mason.masonkit.BorderImageRepeat;
					public static ROUND: org.nativescript.mason.masonkit.BorderImageRepeat;
					public static SPACE: org.nativescript.mason.masonkit.BorderImageRepeat;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.BorderImageRepeat>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.BorderImageRepeat;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderImageRepeat {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderImageRepeat.Companion>;
						public parse(token: string): org.nativescript.mason.masonkit.BorderImageRepeat | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BorderRenderer {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderRenderer>;
					public constructor(style: org.nativescript.mason.masonkit.Style);
					public invalidateSize(): void;
					public invalidate(): void;
					public getClipPath(tr: number, br: number): globalAndroid.graphics.Path;
					public getOuterClipPath(f: number, tlX: number): globalAndroid.graphics.Path;
					public uniformRadius(this_: number, width: number): number;
					public hasCornerShape(): boolean;
					public cornerShapeHash(): number;
					public addShapePath(h: globalAndroid.graphics.Path, f: globalAndroid.graphics.RectF, x: androidNative.Array<number>): void;
					public hasRadii(): boolean;
					public copyRadii(out: androidNative.Array<number>): void;
					public getRadii(): androidNative.Array<number>;
					public updateCache(values: number, this_: number): void;
					public hasVisibleBorder(): boolean;
					public draw(canvas: globalAndroid.graphics.Canvas, width: number, height: number): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderRenderer {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderRenderer.Companion>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderRenderer {
					export class Corner {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderRenderer.Corner>;
						public static TOP_LEFT: org.nativescript.mason.masonkit.BorderRenderer.Corner;
						public static TOP_RIGHT: org.nativescript.mason.masonkit.BorderRenderer.Corner;
						public static BOTTOM_RIGHT: org.nativescript.mason.masonkit.BorderRenderer.Corner;
						public static BOTTOM_LEFT: org.nativescript.mason.masonkit.BorderRenderer.Corner;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.BorderRenderer.Corner>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.BorderRenderer.Corner;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderRenderer {
					export class Side {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderRenderer.Side>;
						public static Left: org.nativescript.mason.masonkit.BorderRenderer.Side;
						public static Top: org.nativescript.mason.masonkit.BorderRenderer.Side;
						public static Right: org.nativescript.mason.masonkit.BorderRenderer.Side;
						public static Bottom: org.nativescript.mason.masonkit.BorderRenderer.Side;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.BorderRenderer.Side>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.BorderRenderer.Side;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BorderRenderer {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BorderRenderer.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class BoxShadowRenderer {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.BoxShadowRenderer>;
					public constructor(style: org.nativescript.mason.masonkit.Style);
					public invalidate(): void;
					public release(): void;
					public drawOutsetShadows(i: globalAndroid.view.View, list: globalAndroid.graphics.Canvas, shadows: number, outsetShadows: number, this_: org.nativescript.mason.masonkit.BorderRenderer): void;
					public drawInsetShadows(i: globalAndroid.view.View, list: globalAndroid.graphics.Canvas, param2: number, $this$drawInsetShadows_u24lambda_u249: number, $i$f$withSave: org.nativescript.mason.masonkit.BorderRenderer): void;
					public static getRenderModeOverride(): org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode | null;
					public static setRenderModeOverride(value: org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode | null): void;
					public static getSoftwareRasterScaleOverride(): java.lang.Float | null;
					public static setSoftwareRasterScaleOverride(value: java.lang.Float | null): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BoxShadowRenderer {
					export class CacheKey {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BoxShadowRenderer.CacheKey>;
						public constructor();
						public getWidth(): number;
						public setWidth(param0: number): void;
						public getHeight(): number;
						public setHeight(param0: number): void;
						public getShadowsHash(): number;
						public setShadowsHash(param0: number): void;
						public getRadiiHash(): number;
						public setRadiiHash(param0: number): void;
						public getConfigurationVersion(): number;
						public setConfigurationVersion(param0: number): void;
						public matches(width: number, height: number, shadowsHash: number, radiiHash: number): boolean;
						public store(width: number, height: number, shadowsHash: number, radiiHash: number): void;
						public reset(): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BoxShadowRenderer {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BoxShadowRenderer.Companion>;
						public getRenderModeOverride(): org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode | null;
						public setRenderModeOverride(value: org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode | null): void;
						public getSoftwareRasterScaleOverride(): java.lang.Float | null;
						public setSoftwareRasterScaleOverride(this_: java.lang.Float | null): void;
						public createShapeBitmap($this$createShapeBitmap_u24lambda_u241: number, path: number, bitmap: androidNative.Array<number> | null, canvas: org.nativescript.mason.masonkit.CSSFilters.BitmapPool, rect: org.nativescript.mason.masonkit.BorderRenderer | null): globalAndroid.graphics.Bitmap;
						public createBlurredShadowBitmapRS($this$createBlurredShadowBitmapRS_u24lambda_u242: globalAndroid.content.Context, result: globalAndroid.graphics.Bitmap, canvas: number, script: number, param4: org.nativescript.mason.masonkit.CSSFilters.BitmapPool): globalAndroid.graphics.Bitmap;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BoxShadowRenderer {
					export class RenderMode {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode>;
						public static AUTO: org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode;
						public static RENDER_NODE: org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode;
						public static SOFTWARE: org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.BoxShadowRenderer.RenderMode;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module BoxShadowRenderer {
					export class ShadowBitmapEntry {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.BoxShadowRenderer.ShadowBitmapEntry>;
						public constructor(bitmap: globalAndroid.graphics.Bitmap, drawX: number, drawY: number, drawWidth: number, drawHeight: number);
						public getBitmap(): globalAndroid.graphics.Bitmap;
						public getDrawX(): number;
						public getDrawY(): number;
						public getDrawWidth(): number;
						public getDrawHeight(): number;
						public component1(): globalAndroid.graphics.Bitmap;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public component5(): number;
						public copy(bitmap: globalAndroid.graphics.Bitmap, drawX: number, drawY: number, drawWidth: number, drawHeight: number): org.nativescript.mason.masonkit.BoxShadowRenderer.ShadowBitmapEntry;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class CSSFilters {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters>;
					public constructor();
					public static invalidateCssFilters(view: globalAndroid.view.View): void;
					public static parse(value: string): org.nativescript.mason.masonkit.CSSFilters.CSSFilter;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export class BitmapPool {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.BitmapPool>;
						public constructor(totalMem: globalAndroid.content.Context);
						public getSourceBitmap(k: number, cached: number, this_: globalAndroid.graphics.Bitmap.Config): globalAndroid.graphics.Bitmap;
						public getBitmap(k: number, cached: number, this_: globalAndroid.graphics.Bitmap.Config): globalAndroid.graphics.Bitmap;
						public putBitmap(this_: globalAndroid.graphics.Bitmap, bitmap: java.lang.Boolean | null): void;
						public clear(): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export class CSSFilter {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.CSSFilter>;
						public constructor(css: string, filters: java.util.List<any>);
						public getFilters(): java.util.List<org.nativescript.mason.masonkit.CSSFilters.Filter>;
						public canApplyFast(): boolean;
						public applyFast($this$applyFast_u24lambda_u242: globalAndroid.graphics.Canvas, gray: number, paint: number): boolean;
						public renderFilters(hasShadows: globalAndroid.view.View, filter: globalAndroid.graphics.Canvas, param2: any): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Companion>;
						public invalidateCssFilters(param0: globalAndroid.view.View): void;
						public parse(it: string): org.nativescript.mason.masonkit.CSSFilters.CSSFilter;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export abstract class Filter {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Blur extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Blur>;
							public constructor(radiusPx: number);
							public getRadiusPx(): number;
							public component1(): number;
							public copy(radiusPx: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Blur;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Brightness extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Brightness>;
							public constructor(value: number);
							public getValue(): number;
							public component1(): number;
							public copy(value: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Brightness;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Contrast extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Contrast>;
							public constructor(value: number);
							public getValue(): number;
							public component1(): number;
							public copy(value: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Contrast;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class DropShadow extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.DropShadow>;
							public constructor(offsetX: number, offsetY: number, blur: number, color: number);
							public getOffsetX(): number;
							public getOffsetY(): number;
							public getBlur(): number;
							public getColor(): number;
							public component1(): number;
							public component2(): number;
							public component3(): number;
							public component4(): number;
							public copy(offsetX: number, offsetY: number, blur: number, color: number): org.nativescript.mason.masonkit.CSSFilters.Filter.DropShadow;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Grayscale extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Grayscale>;
							public constructor(amount: number);
							public getAmount(): number;
							public component1(): number;
							public copy(amount: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Grayscale;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class HueRotate extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.HueRotate>;
							public constructor(degrees: number);
							public getDegrees(): number;
							public component1(): number;
							public copy(degrees: number): org.nativescript.mason.masonkit.CSSFilters.Filter.HueRotate;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Invert extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Invert>;
							public constructor(amount: number);
							public getAmount(): number;
							public component1(): number;
							public copy(amount: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Invert;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Opacity extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Opacity>;
							public constructor(amount: number);
							public getAmount(): number;
							public component1(): number;
							public copy(amount: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Opacity;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Saturate extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Saturate>;
							public constructor(value: number);
							public getValue(): number;
							public component1(): number;
							public copy(value: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Saturate;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module Filter {
						export class Sepia extends org.nativescript.mason.masonkit.CSSFilters.Filter {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.Filter.Sepia>;
							public constructor(amount: number);
							public getAmount(): number;
							public component1(): number;
							public copy(amount: number): org.nativescript.mason.masonkit.CSSFilters.Filter.Sepia;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module FilterHelper {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.FilterHelper.Companion>;
							public createBlurBitmap(config$iv: globalAndroid.content.Context, destroyRS: number, renderScript: number, input: number, output: globalAndroid.graphics.Bitmap, script: globalAndroid.renderscript.RenderScript | null): globalAndroid.graphics.Bitmap;
							public createDropShadowBitmap(cached: globalAndroid.content.Context, param1: number, $this$createDropShadowBitmap_u24lambda_u241: number, param3: number, tempW: number, tempH: number, tempBmp: number, tempCanvas: globalAndroid.graphics.Bitmap, input: globalAndroid.renderscript.RenderScript | null, output: globalAndroid.graphics.Canvas | null): globalAndroid.graphics.Bitmap;
							public build(key: globalAndroid.view.View, set: java.util.List<any>, filter: any): org.nativescript.mason.masonkit.CSSFilters.FilterHelper;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module FilterHelperV2 {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.FilterHelperV2.Companion>;
							public build(_: globalAndroid.view.View, canvas: java.util.List<any>, param2: any): org.nativescript.mason.masonkit.CSSFilters.FilterHelperV2;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CSSFilters {
					export module FilterHelperV3 {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.CSSFilters.FilterHelperV3.Companion>;
							public build(sourceCanvas: globalAndroid.view.View, r: java.util.List<any>, blurEffect: any): org.nativescript.mason.masonkit.CSSFilters.FilterHelperV3;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ClipPath {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ClipPath>;
					public static CSS_NAME: string = "clip-path";
					public constructor(style: org.nativescript.mason.masonkit.Style);
					public get(): string;
					public set(value: string): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ClipPath {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ClipPath.Companion>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ClipPathKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ClipPathKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ColorInterpolation {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolation>;
					public constructor(space: org.nativescript.mason.masonkit.ColorInterpolation.Space, hue: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod);
					public getSpace(): org.nativescript.mason.masonkit.ColorInterpolation.Space;
					public getHue(): org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
					public component1(): org.nativescript.mason.masonkit.ColorInterpolation.Space;
					public component2(): org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
					public copy(space: org.nativescript.mason.masonkit.ColorInterpolation.Space, hue: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod): org.nativescript.mason.masonkit.ColorInterpolation;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorInterpolation {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolation.Companion>;
						public extract(it: string): any | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorInterpolation {
					export class HueMethod {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolation.HueMethod>;
						public static SHORTER: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
						public static LONGER: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
						public static INCREASING: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
						public static DECREASING: org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.ColorInterpolation.HueMethod>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.ColorInterpolation.HueMethod;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorInterpolation {
					export class Space {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolation.Space>;
						public static SRGB: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static SRGB_LINEAR: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static OKLAB: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static OKLCH: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static LAB: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static LCH: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static XYZ_D65: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static XYZ_D50: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static HSL: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static HWB: org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public getCss(): string;
						public getHueIndex(): number;
						public getChromaIndex(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.ColorInterpolation.Space>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.ColorInterpolation.Space;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorInterpolation {
					export module Space {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolation.Space.Companion>;
							public parse(it: string): org.nativescript.mason.masonkit.ColorInterpolation.Space | null;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorInterpolationKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorInterpolationKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ColorSpaces {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ColorSpaces.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ComputedStyle {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ComputedStyle>;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module CssLength {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.CssLength.Companion>;
						public getZERO(): org.nativescript.mason.masonkit.CssLength;
						public getFIFTY_PERCENT(): org.nativescript.mason.masonkit.CssLength;
						public getHUNDRED_PERCENT(): org.nativescript.mason.masonkit.CssLength;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class Dimension {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension>;
					public isZero(): boolean;
					public getJsonValue(): string;
					public getCssValue(): string;
					public static isValid(type: number, value: number): boolean;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.Dimension | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Auto extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Companion>;
						public isValid(type: number, value: number): boolean;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.Dimension | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Content extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Content>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.Content;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class FitContent extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.FitContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.FitContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class FitContentPercent extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.FitContentPercent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.Dimension.FitContentPercent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class FitContentPoints extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.FitContentPoints>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.Dimension.FitContentPoints;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Kind {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Kind>;
						public static Auto: org.nativescript.mason.masonkit.Dimension.Kind;
						public static Points: org.nativescript.mason.masonkit.Dimension.Kind;
						public static Percent: org.nativescript.mason.masonkit.Dimension.Kind;
						public static MinContent: org.nativescript.mason.masonkit.Dimension.Kind;
						public static MaxContent: org.nativescript.mason.masonkit.Dimension.Kind;
						public static FitContent: org.nativescript.mason.masonkit.Dimension.Kind;
						public static FitContentPoints: org.nativescript.mason.masonkit.Dimension.Kind;
						public static FitContentPercent: org.nativescript.mason.masonkit.Dimension.Kind;
						public static Stretch: org.nativescript.mason.masonkit.Dimension.Kind;
						public static Content: org.nativescript.mason.masonkit.Dimension.Kind;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Dimension.Kind>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Dimension.Kind;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class MaxContent extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.MaxContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.MaxContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class MinContent extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.MinContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.MinContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Percent extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.Dimension.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Points extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.Dimension.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Dimension {
					export class Stretch extends org.nativescript.mason.masonkit.Dimension {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Dimension.Stretch>;
						public static INSTANCE: org.nativescript.mason.masonkit.Dimension.Stretch;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class DimensionSerializer extends com.google.gson.JsonSerializer<org.nativescript.mason.masonkit.Dimension> {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.DimensionSerializer>;
					public constructor();
					public serialize(this_: org.nativescript.mason.masonkit.Dimension | null, src: java.lang.reflect.Type | null, typeOfSrc: com.google.gson.JsonSerializationContext | null): com.google.gson.JsonElement;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Element extends org.nativescript.mason.masonkit.EventTarget {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Element>;
					/**
					 * Constructs a new instance of the org.nativescript.mason.masonkit.Element interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getStyle(): org.nativescript.mason.masonkit.Style;
						getWritableStyleBuffer(): java.nio.ByteBuffer;
						getNode(): org.nativescript.mason.masonkit.Node;
						addEventListener(param0: string, param1: any): java.util.UUID;
						ensureNativeClickDispatch(): void;
						syncStyleParts(param0: number, param1: number, param2: number, param3: number): void;
						syncStyle(param0: number, param1: number): void;
						onNodeAttached(): void;
						onNodeDetached(): void;
						markNodeDirty(): void;
						isNodeDirty(): boolean;
						configure(param0: any): org.nativescript.mason.masonkit.Element;
						getView(): globalAndroid.view.View;
						elementFromPoint(param0: number, param1: number): globalAndroid.view.View | null;
						layoutFlat(): org.nativescript.mason.masonkit.MasonLayoutTree;
						compute(): void;
						compute(param0: number, param1: number): void;
						computeMaxContent(): void;
						computeMinContent(): void;
						computeWithViewSize(): void;
						computeNestedRootLater(param0: number, param1: number): void;
						computeOrDeferNested(param0: number, param1: number): boolean;
						invalidateForeignHost(): void;
						computeAndLayout(): org.nativescript.mason.masonkit.MasonLayoutTree;
						layout(): org.nativescript.mason.masonkit.Layout;
						computeAndLayout(param0: number, param1: number): org.nativescript.mason.masonkit.MasonLayoutTree;
						computeWithSize(param0: number, param1: number): void;
						computeWithViewSize(param0: boolean): void;
						computeWithMaxContent(): void;
						computeWithMinContent(): void;
						attachAndApply(): void;
						append(param0: org.nativescript.mason.masonkit.Element): void;
						append(param0: org.nativescript.mason.masonkit.Node): void;
						append(param0: java.util.List<any>): void;
						append(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
						append(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
						prepend(param0: org.nativescript.mason.masonkit.Element): void;
						prepend(param0: org.nativescript.mason.masonkit.Node): void;
						prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
						prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
						invalidateLayout(): void;
						invalidateLayout(param0: boolean): void;
						recomputeRoot(): void;
						appendView(param0: globalAndroid.view.View): void;
						appendView(param0: androidNative.Array<globalAndroid.view.View>): void;
						prependView(param0: globalAndroid.view.View): void;
						prependView(param0: androidNative.Array<globalAndroid.view.View>): void;
						addChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
						addChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
						replaceChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
						replaceChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
						removeChildAt(param0: number): void;
						removeChild(param0: org.nativescript.mason.masonkit.Node): void;
						getNode(): org.nativescript.mason.masonkit.Node;
						addEventListener(param0: string, param1: any): java.util.UUID;
						removeEventListener(param0: string, param1: java.util.UUID): void;
						dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
					});
					public constructor();
					public getStyle(): org.nativescript.mason.masonkit.Style;
					public getWritableStyleBuffer(): java.nio.ByteBuffer;
					public getNode(): org.nativescript.mason.masonkit.Node;
					public addEventListener(param0: string, param1: any): java.util.UUID;
					public ensureNativeClickDispatch(): void;
					public syncStyleParts(param0: number, param1: number, param2: number, param3: number): void;
					public syncStyle(param0: number, param1: number): void;
					public onNodeAttached(): void;
					public onNodeDetached(): void;
					public markNodeDirty(): void;
					public isNodeDirty(): boolean;
					public configure(param0: any): org.nativescript.mason.masonkit.Element;
					public getView(): globalAndroid.view.View;
					public elementFromPoint(param0: number, param1: number): globalAndroid.view.View | null;
					public layoutFlat(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public compute(): void;
					public compute(param0: number, param1: number): void;
					public computeMaxContent(): void;
					public computeMinContent(): void;
					public computeWithViewSize(): void;
					public computeNestedRootLater(param0: number, param1: number): void;
					public computeOrDeferNested(param0: number, param1: number): boolean;
					public invalidateForeignHost(): void;
					public computeAndLayout(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public layout(): org.nativescript.mason.masonkit.Layout;
					public computeAndLayout(param0: number, param1: number): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeWithSize(param0: number, param1: number): void;
					public computeWithViewSize(param0: boolean): void;
					public computeWithMaxContent(): void;
					public computeWithMinContent(): void;
					public attachAndApply(): void;
					public append(param0: org.nativescript.mason.masonkit.Element): void;
					public append(param0: org.nativescript.mason.masonkit.Node): void;
					public append(param0: java.util.List<any>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public prepend(param0: org.nativescript.mason.masonkit.Element): void;
					public prepend(param0: org.nativescript.mason.masonkit.Node): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public invalidateLayout(): void;
					public invalidateLayout(param0: boolean): void;
					public recomputeRoot(): void;
					public appendView(param0: globalAndroid.view.View): void;
					public appendView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public prependView(param0: globalAndroid.view.View): void;
					public prependView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public removeChildAt(param0: number): void;
					public removeChild(param0: org.nativescript.mason.masonkit.Node): void;
					public removeEventListener(param0: string, param1: java.util.UUID): void;
					public dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Element {
					export class DefaultImpls {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Element.DefaultImpls>;
						public static getWritableStyleBuffer($this: org.nativescript.mason.masonkit.Element): java.nio.ByteBuffer;
						public static addEventListener(id: org.nativescript.mason.masonkit.Element, $this: string, type: any): java.util.UUID;
						public static ensureNativeClickDispatch($this: org.nativescript.mason.masonkit.Element): void;
						public static syncStyleParts(low: org.nativescript.mason.masonkit.Element, high: number, $this: number, lowLow: number, lowHigh: number): void;
						public static syncStyle($this: org.nativescript.mason.masonkit.Element, low: number, high: number): void;
						public static onNodeAttached($this: org.nativescript.mason.masonkit.Element): void;
						public static onNodeDetached($this: org.nativescript.mason.masonkit.Element): void;
						public static markNodeDirty($this: org.nativescript.mason.masonkit.Element): void;
						public static isNodeDirty($this: org.nativescript.mason.masonkit.Element): boolean;
						public static configure($this: org.nativescript.mason.masonkit.Element, block: any): org.nativescript.mason.masonkit.Element;
						public static elementFromPoint($this: org.nativescript.mason.masonkit.Element, x: number, y: number): globalAndroid.view.View | null;
						public static layoutFlat(initialLayout: org.nativescript.mason.masonkit.Element): org.nativescript.mason.masonkit.MasonLayoutTree;
						public static compute(mason: org.nativescript.mason.masonkit.Element): void;
						public static compute(width: org.nativescript.mason.masonkit.Element, height: number, mason: number): void;
						public static computeMaxContent(mason: org.nativescript.mason.masonkit.Element): void;
						public static computeMinContent(mason: org.nativescript.mason.masonkit.Element): void;
						public static computeWithViewSize(width: org.nativescript.mason.masonkit.Element): void;
						public static computeNestedRootLater(compute: org.nativescript.mason.masonkit.Element, $this: number, widthArg: number): void;
						public static computeOrDeferNested(seenWidth: org.nativescript.mason.masonkit.Element, seenHeight: number, $this: number): boolean;
						public static invalidateForeignHost(param0: org.nativescript.mason.masonkit.Element): void;
						public static computeAndLayout($this: org.nativescript.mason.masonkit.Element): org.nativescript.mason.masonkit.MasonLayoutTree;
						public static layout(mason: org.nativescript.mason.masonkit.Element): org.nativescript.mason.masonkit.Layout;
						public static computeAndLayout($this: org.nativescript.mason.masonkit.Element, width: number, height: number): org.nativescript.mason.masonkit.MasonLayoutTree;
						public static computeWithSize($this: org.nativescript.mason.masonkit.Element, width: number, height: number): void;
						public static computeWithViewSize($this: org.nativescript.mason.masonkit.Element, layout: boolean): void;
						public static computeWithMaxContent($this: org.nativescript.mason.masonkit.Element): void;
						public static computeWithMinContent($this: org.nativescript.mason.masonkit.Element): void;
						public static attachAndApply($this: org.nativescript.mason.masonkit.Element): void;
						public static append($this: org.nativescript.mason.masonkit.Element, element: org.nativescript.mason.masonkit.Element): void;
						public static append($this: org.nativescript.mason.masonkit.Element, node: org.nativescript.mason.masonkit.Node): void;
						public static append(param0: org.nativescript.mason.masonkit.Element, it: java.util.List<any>): void;
						public static append(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
						public static append(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
						public static prepend($this: org.nativescript.mason.masonkit.Element, element: org.nativescript.mason.masonkit.Element): void;
						public static prepend($this: org.nativescript.mason.masonkit.Element, node: org.nativescript.mason.masonkit.Node): void;
						public static prepend(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
						public static prepend(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
						public static invalidateLayout($this: org.nativescript.mason.masonkit.Element): void;
						public static invalidateLayout(width: org.nativescript.mason.masonkit.Element, height: boolean): void;
						public static recomputeRoot(width: org.nativescript.mason.masonkit.Element): void;
						public static appendView(child: org.nativescript.mason.masonkit.Element, $this: globalAndroid.view.View): void;
						public static appendView(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<globalAndroid.view.View>): void;
						public static prependView(child: org.nativescript.mason.masonkit.Element, $this: globalAndroid.view.View): void;
						public static prependView(param0: org.nativescript.mason.masonkit.Element, it: androidNative.Array<globalAndroid.view.View>): void;
						public static addChildAt($this: org.nativescript.mason.masonkit.Element, element: org.nativescript.mason.masonkit.Element, index: number): void;
						public static addChildAt($this: org.nativescript.mason.masonkit.Element, node: org.nativescript.mason.masonkit.Node, index: number): void;
						public static replaceChildAt($this: org.nativescript.mason.masonkit.Element, element: org.nativescript.mason.masonkit.Element, index: number): void;
						public static replaceChildAt($this: org.nativescript.mason.masonkit.Element, node: org.nativescript.mason.masonkit.Node, index: number): void;
						public static removeChildAt($this: org.nativescript.mason.masonkit.Element, index: number): void;
						public static removeChild($this: org.nativescript.mason.masonkit.Element, node: org.nativescript.mason.masonkit.Node): void;
						public static removeEventListener($this: org.nativescript.mason.masonkit.Element, type: string, id: java.util.UUID): void;
						public static dispatch($this: org.nativescript.mason.masonkit.Element, event: org.nativescript.mason.masonkit.events.Event): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ElementKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ElementKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class EventTarget {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.EventTarget>;
					/**
					 * Constructs a new instance of the org.nativescript.mason.masonkit.EventTarget interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getNode(): org.nativescript.mason.masonkit.Node;
						addEventListener(param0: string, param1: any): java.util.UUID;
						removeEventListener(param0: string, param1: java.util.UUID): void;
						dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
					});
					public constructor();
					public getNode(): org.nativescript.mason.masonkit.Node;
					public addEventListener(param0: string, param1: any): java.util.UUID;
					public removeEventListener(param0: string, param1: java.util.UUID): void;
					public dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module EventTarget {
					export class DefaultImpls {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.EventTarget.DefaultImpls>;
						public static addEventListener($this: org.nativescript.mason.masonkit.EventTarget, type: string, listener: any): java.util.UUID;
						public static removeEventListener($this: org.nativescript.mason.masonkit.EventTarget, type: string, id: java.util.UUID): void;
						public static dispatch($this: org.nativescript.mason.masonkit.EventTarget, event: org.nativescript.mason.masonkit.events.Event): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GC {
					export class NativePhantomReference extends java.lang.ref.PhantomReference<org.nativescript.mason.masonkit.NativeObject> {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GC.NativePhantomReference>;
						public constructor(referent: org.nativescript.mason.masonkit.NativeObject, release: any, queue: java.lang.ref.ReferenceQueue<any>);
						public getRelease(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GC {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GC.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class GeometryBox {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.GeometryBox>;
					public static BORDER_BOX: org.nativescript.mason.masonkit.GeometryBox;
					public static PADDING_BOX: org.nativescript.mason.masonkit.GeometryBox;
					public static CONTENT_BOX: org.nativescript.mason.masonkit.GeometryBox;
					public static MARGIN_BOX: org.nativescript.mason.masonkit.GeometryBox;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.GeometryBox>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.GeometryBox;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GeometryBox {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GeometryBox.Companion>;
						public parse(value: string): org.nativescript.mason.masonkit.GeometryBox | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Gradient {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Gradient>;
					public constructor(type: string, direction: string | null, stops: java.util.List<string>, interpolation: org.nativescript.mason.masonkit.ColorInterpolation | null, repeating: boolean);
					public getType(): string;
					public getDirection(): string | null;
					public getStops(): java.util.List<string>;
					public getInterpolation(): org.nativescript.mason.masonkit.ColorInterpolation | null;
					public getRepeating(): boolean;
					public component1(): string;
					public component2(): string | null;
					public component3(): java.util.List<string>;
					public component4(): org.nativescript.mason.masonkit.ColorInterpolation | null;
					public component5(): boolean;
					public copy(type: string, direction: string | null, stops: java.util.List<string>, interpolation: org.nativescript.mason.masonkit.ColorInterpolation | null, repeating: boolean): org.nativescript.mason.masonkit.Gradient;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class GridPlacement {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement>;
					public getJsonValue(): string;
					public getCssValue(): string;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridPlacement {
					export class Auto extends org.nativescript.mason.masonkit.GridPlacement {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.GridPlacement.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridPlacement {
					export class Line extends org.nativescript.mason.masonkit.GridPlacement {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement.Line>;
						public constructor(value: number);
						public getValue(): number;
						public setValue(param0: number): void;
						public component1(): number;
						public copy(value: number): org.nativescript.mason.masonkit.GridPlacement.Line;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridPlacement {
					export class NamedLine extends org.nativescript.mason.masonkit.GridPlacement {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement.NamedLine>;
						public constructor(name: string, line: number);
						public getName(): string;
						public setName(param0: string): void;
						public getLine(): number;
						public setLine(param0: number): void;
						public component1(): string;
						public component2(): number;
						public copy(name: string, line: number): org.nativescript.mason.masonkit.GridPlacement.NamedLine;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridPlacement {
					export class NamedSpan extends org.nativescript.mason.masonkit.GridPlacement {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement.NamedSpan>;
						public constructor(name: string, span: number);
						public getName(): string;
						public setName(param0: string): void;
						public getSpan(): number;
						public setSpan(param0: number): void;
						public component1(): string;
						public component2(): number;
						public copy(name: string, span: number): org.nativescript.mason.masonkit.GridPlacement.NamedSpan;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridPlacement {
					export class Span extends org.nativescript.mason.masonkit.GridPlacement {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridPlacement.Span>;
						public constructor(value: number);
						public getValue(): number;
						public setValue(param0: number): void;
						public component1(): number;
						public copy(value: number): org.nativescript.mason.masonkit.GridPlacement.Span;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridStateKeys {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridStateKeys.Companion>;
						public "getGridTemplateAreas-8t4EpgM"(): number;
						public "getGridAutoRows-8t4EpgM"(): number;
						public "getGridAutoColumns-8t4EpgM"(): number;
						public "getGridRowStart-8t4EpgM"(): number;
						public "getGridRowEnd-8t4EpgM"(): number;
						public "getGridColumnStart-8t4EpgM"(): number;
						public "getGridColumnEnd-8t4EpgM"(): number;
						public "getGridTemplateRows-8t4EpgM"(): number;
						public "getGridTemplateColumns-8t4EpgM"(): number;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class GridTemplate {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTemplate>;
					public isRepeating(): boolean;
					public getCssValue(): string;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTemplate {
					export class AutoRepeat extends org.nativescript.mason.masonkit.GridTemplate {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTemplate.AutoRepeat>;
						public constructor(gridTrackRepetition: org.nativescript.mason.masonkit.GridTrackRepetition, value: androidNative.Array<org.nativescript.mason.masonkit.MinMax>, lineNames: androidNative.Array<androidNative.Array<string>>);
						public getGridTrackRepetition(): org.nativescript.mason.masonkit.GridTrackRepetition;
						public getValue(): androidNative.Array<org.nativescript.mason.masonkit.MinMax>;
						public getLineNames(): androidNative.Array<androidNative.Array<string>>;
						public gridTrackRepetitionNativeType(): number;
						public gridTrackRepetitionNativeValue(): number;
						public equals(other: any): boolean;
						public hashCode(): number;
						public getCssValue(): string;
						public component1(): org.nativescript.mason.masonkit.GridTrackRepetition;
						public component2(): androidNative.Array<org.nativescript.mason.masonkit.MinMax>;
						public component3(): androidNative.Array<androidNative.Array<string>>;
						public copy(gridTrackRepetition: org.nativescript.mason.masonkit.GridTrackRepetition, value: androidNative.Array<org.nativescript.mason.masonkit.MinMax>, lineNames: androidNative.Array<androidNative.Array<string>>): org.nativescript.mason.masonkit.GridTemplate.AutoRepeat;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTemplate {
					export class Single extends org.nativescript.mason.masonkit.GridTemplate {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTemplate.Single>;
						public constructor(value: org.nativescript.mason.masonkit.MinMax, lineNames: androidNative.Array<string>);
						public getValue(): org.nativescript.mason.masonkit.MinMax;
						public getLineNames(): androidNative.Array<string>;
						public getCssValue(): string;
						public equals(other: any): boolean;
						public hashCode(): number;
						public component1(): org.nativescript.mason.masonkit.MinMax;
						public component2(): androidNative.Array<string>;
						public copy(value: org.nativescript.mason.masonkit.MinMax, lineNames: androidNative.Array<string>): org.nativescript.mason.masonkit.GridTemplate.Single;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class GridTrackRepetition {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTrackRepetition>;
					public getType(): number;
					public getValue(): number;
					public getCssValue(): string;
					public toInt(): number;
					public static from(type: number, value: number): org.nativescript.mason.masonkit.GridTrackRepetition;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTrackRepetition {
					export class AutoFill extends org.nativescript.mason.masonkit.GridTrackRepetition {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTrackRepetition.AutoFill>;
						public static INSTANCE: org.nativescript.mason.masonkit.GridTrackRepetition.AutoFill;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTrackRepetition {
					export class AutoFit extends org.nativescript.mason.masonkit.GridTrackRepetition {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTrackRepetition.AutoFit>;
						public static INSTANCE: org.nativescript.mason.masonkit.GridTrackRepetition.AutoFit;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTrackRepetition {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTrackRepetition.Companion>;
						public from(type: number, value: number): org.nativescript.mason.masonkit.GridTrackRepetition;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module GridTrackRepetition {
					export class Count extends org.nativescript.mason.masonkit.GridTrackRepetition {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.GridTrackRepetition.Count>;
						public constructor(count: number);
						public getCount(): number;
						public component1(): number;
						public copy(count: number): org.nativescript.mason.masonkit.GridTrackRepetition.Count;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module HitTesting {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.HitTesting.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class IdleHandler {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.IdleHandler>;
					public constructor(mason: org.nativescript.mason.masonkit.Mason);
					public getMason(): org.nativescript.mason.masonkit.Mason;
					public queueIdle(): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class InlineSegment {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.InlineSegment>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module InlineSegment {
					export class Br extends org.nativescript.mason.masonkit.InlineSegment {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.InlineSegment.Br>;
						public constructor();
						public toString(): string;
						public equals(o: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module InlineSegment {
					export class InlineChild extends org.nativescript.mason.masonkit.InlineSegment {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.InlineSegment.InlineChild>;
						public nodePtr: number;
						public descent: number;
						public constructor(nodePtr: number, descent: number);
						public getId(): number;
						public toString(): string;
						public equals(this_: any): boolean;
						public hashCode(): number;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module InlineSegment {
					export class Text extends org.nativescript.mason.masonkit.InlineSegment {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.InlineSegment.Text>;
						public flags: number;
						public width: number;
						public ascent: number;
						public descent: number;
						public constructor(flags: number, width: number, ascent: number, descent: number);
						public toString(): string;
						public equals(this_: any): boolean;
						public hashCode(): number;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Layout {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Layout>;
					public constructor(order: number, x: number, y: number, width: number, height: number, border: org.nativescript.mason.masonkit.Rect<java.lang.Float>, margin: org.nativescript.mason.masonkit.Rect<java.lang.Float>, padding: org.nativescript.mason.masonkit.Rect<java.lang.Float>, contentSize: org.nativescript.mason.masonkit.Size<java.lang.Float>, scrollbarSize: org.nativescript.mason.masonkit.Size<java.lang.Float>, children: java.util.List<org.nativescript.mason.masonkit.Layout>);
					public getOrder(): number;
					public getX(): number;
					public getY(): number;
					public getWidth(): number;
					public getHeight(): number;
					public getBorder(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public getMargin(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public getPadding(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public getContentSize(): org.nativescript.mason.masonkit.Size<java.lang.Float>;
					public getScrollbarSize(): org.nativescript.mason.masonkit.Size<java.lang.Float>;
					public getChildren(): java.util.List<org.nativescript.mason.masonkit.Layout>;
					public getBaseline(): number;
					public component1(): number;
					public component2(): number;
					public component3(): number;
					public component4(): number;
					public component5(): number;
					public component6(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public component7(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public component8(): org.nativescript.mason.masonkit.Rect<java.lang.Float>;
					public component9(): org.nativescript.mason.masonkit.Size<java.lang.Float>;
					public component10(): org.nativescript.mason.masonkit.Size<java.lang.Float>;
					public component11(): java.util.List<org.nativescript.mason.masonkit.Layout>;
					public copy(order: number, x: number, y: number, width: number, height: number, border: org.nativescript.mason.masonkit.Rect<java.lang.Float>, margin: org.nativescript.mason.masonkit.Rect<java.lang.Float>, padding: org.nativescript.mason.masonkit.Rect<java.lang.Float>, contentSize: org.nativescript.mason.masonkit.Size<java.lang.Float>, scrollbarSize: org.nativescript.mason.masonkit.Size<java.lang.Float>, children: java.util.List<org.nativescript.mason.masonkit.Layout>): org.nativescript.mason.masonkit.Layout;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public static getEmpty(): org.nativescript.mason.masonkit.Layout;
					public static fromMasonTree(tree: org.nativescript.mason.masonkit.MasonLayoutTree, index: number): org.nativescript.mason.masonkit.Layout;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Layout {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Layout.Companion>;
						public getEmpty(): org.nativescript.mason.masonkit.Layout;
						public fromMasonTree($this$atOrZero$iv: org.nativescript.mason.masonkit.MasonLayoutTree, $i$f$atOrZero: number): org.nativescript.mason.masonkit.Layout;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class LayoutDfsState {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LayoutDfsState>;
					public constructor();
					public getStack(): java.util.ArrayList<org.nativescript.mason.masonkit.LayoutStackFrame>;
					public getTop(): number;
					public setTop(param0: number): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class LayoutStackFrame {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LayoutStackFrame>;
					public constructor();
					public getTreeIdx(): number;
					public setTreeIdx(param0: number): void;
					public getNode(): org.nativescript.mason.masonkit.Node | null;
					public setNode(param0: org.nativescript.mason.masonkit.Node | null): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthContext {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthContext.Companion>;
						public forStyle(this_: org.nativescript.mason.masonkit.Style): org.nativescript.mason.masonkit.LengthContext;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class LengthPercentage {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage>;
					public getJsonValue(): string;
					public getCssValue(): string;
					public static isValid(type: number, value: number): boolean;
					public static from(value: org.nativescript.mason.masonkit.LengthPercentage): org.nativescript.mason.masonkit.LengthPercentage;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.LengthPercentage | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentage {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage.Companion>;
						public isValid(type: number, value: number): boolean;
						public from(value: org.nativescript.mason.masonkit.LengthPercentage): org.nativescript.mason.masonkit.LengthPercentage;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.LengthPercentage | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentage {
					export class Kind {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage.Kind>;
						public static Points: org.nativescript.mason.masonkit.LengthPercentage.Kind;
						public static Percent: org.nativescript.mason.masonkit.LengthPercentage.Kind;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.LengthPercentage.Kind>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.LengthPercentage.Kind;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentage {
					export class Percent extends org.nativescript.mason.masonkit.LengthPercentage {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.LengthPercentage.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentage {
					export class Points extends org.nativescript.mason.masonkit.LengthPercentage {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.LengthPercentage.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentage {
					export class Zero extends org.nativescript.mason.masonkit.LengthPercentage {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentage.Zero>;
						public static INSTANCE: org.nativescript.mason.masonkit.LengthPercentage.Zero;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class LengthPercentageAuto {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getJsonValue(): string;
					public getCssValue(): string;
					public static isValid(type: number, value: number): boolean;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.LengthPercentageAuto | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Auto extends org.nativescript.mason.masonkit.LengthPercentageAuto {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.LengthPercentageAuto.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Companion>;
						public isValid(type: number, value: number): boolean;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.LengthPercentageAuto | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Kind {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Kind>;
						public static Auto: org.nativescript.mason.masonkit.LengthPercentageAuto.Kind;
						public static Points: org.nativescript.mason.masonkit.LengthPercentageAuto.Kind;
						public static Percent: org.nativescript.mason.masonkit.LengthPercentageAuto.Kind;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.LengthPercentageAuto.Kind>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.LengthPercentageAuto.Kind;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Percent extends org.nativescript.mason.masonkit.LengthPercentageAuto {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.LengthPercentageAuto.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Points extends org.nativescript.mason.masonkit.LengthPercentageAuto {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.LengthPercentageAuto.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module LengthPercentageAuto {
					export class Zero extends org.nativescript.mason.masonkit.LengthPercentageAuto {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAuto.Zero>;
						public static INSTANCE: org.nativescript.mason.masonkit.LengthPercentageAuto.Zero;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class LengthPercentageAutoSerializer extends com.google.gson.JsonSerializer<org.nativescript.mason.masonkit.LengthPercentageAuto> {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageAutoSerializer>;
					public constructor();
					public serialize(this_: org.nativescript.mason.masonkit.LengthPercentageAuto | null, src: java.lang.reflect.Type | null, typeOfSrc: com.google.gson.JsonSerializationContext | null): com.google.gson.JsonElement;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class LengthPercentageSerializer extends com.google.gson.JsonSerializer<org.nativescript.mason.masonkit.LengthPercentage> {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LengthPercentageSerializer>;
					public constructor();
					public serialize(this_: org.nativescript.mason.masonkit.LengthPercentage | null, src: java.lang.reflect.Type | null, typeOfSrc: com.google.gson.JsonSerializationContext | null): com.google.gson.JsonElement;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Line<T>  extends java.lang.Object {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Line<any>>;
					public constructor(start: T, end: T);
					public getStart(): T;
					public getEnd(): T;
					public component1(): T;
					public component2(): T;
					public copy(start: T, end: T): org.nativescript.mason.masonkit.Line<T>;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class LoadingState {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.LoadingState>;
					public static Loading: org.nativescript.mason.masonkit.LoadingState;
					public static Loaded: org.nativescript.mason.masonkit.LoadingState;
					public static Error: org.nativescript.mason.masonkit.LoadingState;
					public getValue(): number;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.LoadingState>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.LoadingState;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Mask {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Mask>;
					public static IMAGE: number = 0;
					public static SIZE: number = 1;
					public static POSITION: number = 2;
					public static REPEAT: number = 3;
					public static ORIGIN: number = 4;
					public static CLIP: number = 5;
					public static MODE: number = 6;
					public static COMPOSITE: number = 7;
					public static BORDER_SOURCE: number = 8;
					public static BORDER_SLICE: number = 9;
					public static BORDER_WIDTH: number = 10;
					public static BORDER_OUTSET: number = 11;
					public static BORDER_REPEAT: number = 12;
					public static BORDER_MODE: number = 13;
					public constructor(style: org.nativescript.mason.masonkit.Style);
					public get(index: number): string;
					public set(index: number, value: string): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Mask {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Mask.Companion>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MaskClip {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskClip>;
					public static BORDER_BOX: org.nativescript.mason.masonkit.MaskClip;
					public static PADDING_BOX: org.nativescript.mason.masonkit.MaskClip;
					public static CONTENT_BOX: org.nativescript.mason.masonkit.MaskClip;
					public static NO_CLIP: org.nativescript.mason.masonkit.MaskClip;
					public getCss(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.MaskClip>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.MaskClip;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaskClip {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskClip.Companion>;
						public parse(value: string): org.nativescript.mason.masonkit.MaskClip | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MaskComposite {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskComposite>;
					public static ADD: org.nativescript.mason.masonkit.MaskComposite;
					public static SUBTRACT: org.nativescript.mason.masonkit.MaskComposite;
					public static INTERSECT: org.nativescript.mason.masonkit.MaskComposite;
					public static EXCLUDE: org.nativescript.mason.masonkit.MaskComposite;
					public getCss(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.MaskComposite>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.MaskComposite;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaskComposite {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskComposite.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.MaskComposite | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaskComposite {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskComposite.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MaskLayer {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskLayer>;
					public constructor(source: org.nativescript.mason.masonkit.BackgroundLayer | null, clip: org.nativescript.mason.masonkit.MaskClip, mode: org.nativescript.mason.masonkit.MaskMode, composite: org.nativescript.mason.masonkit.MaskComposite);
					public getSource(): org.nativescript.mason.masonkit.BackgroundLayer | null;
					public getClip(): org.nativescript.mason.masonkit.MaskClip;
					public setClip(param0: org.nativescript.mason.masonkit.MaskClip): void;
					public getMode(): org.nativescript.mason.masonkit.MaskMode;
					public setMode(param0: org.nativescript.mason.masonkit.MaskMode): void;
					public getComposite(): org.nativescript.mason.masonkit.MaskComposite;
					public setComposite(param0: org.nativescript.mason.masonkit.MaskComposite): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MaskMode {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskMode>;
					public static MATCH_SOURCE: org.nativescript.mason.masonkit.MaskMode;
					public static ALPHA: org.nativescript.mason.masonkit.MaskMode;
					public static LUMINANCE: org.nativescript.mason.masonkit.MaskMode;
					public getCss(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.MaskMode>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.MaskMode;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaskMode {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaskMode.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.MaskMode | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Mason {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Mason>;
					public inCompute: boolean;
					public constructor();
					public getScale(): number;
					public getRootFontSize(): number;
					public setRootFontSize(param0: number): void;
					public getViewportWidth(): number;
					public setViewportWidth(param0: number): void;
					public getViewportHeight(): number;
					public setViewportHeight(param0: number): void;
					public getViewportListener(): org.nativescript.mason.masonkit.Mason.ViewportListener | null;
					public setViewportListener(param0: org.nativescript.mason.masonkit.Mason.ViewportListener | null): void;
					public watchViewport(callbacks: globalAndroid.content.Context): void;
					public updateViewport(metrics: globalAndroid.content.Context): void;
					public setViewport(width: number, height: number, force: boolean): void;
					public drain(): void;
					public setDeviceScale(value: number): void;
					public clear(): void;
					public getNativePtr(): number;
					public printTree(node: org.nativescript.mason.masonkit.Node): void;
					public getFloatRects(node: org.nativescript.mason.masonkit.Node): androidNative.Array<number>;
					public getFloatRectAndroidIds(node: org.nativescript.mason.masonkit.Node): androidNative.Array<number>;
					public printArenaStats(): void;
					public debugStats(): java.util.Map<string,java.lang.Long>;
					public addEventListener(answer$iv: org.nativescript.mason.masonkit.Node, $i$f$getOrPut: string, value$iv: any): java.util.UUID;
					public removeEventListener(node: org.nativescript.mason.masonkit.Node, type: string, id: java.util.UUID): void;
					public dispatch(listeners: org.nativescript.mason.masonkit.events.Event): void;
					public createNode(it: androidNative.Array<org.nativescript.mason.masonkit.Node> | null, item$iv$iv: boolean): org.nativescript.mason.masonkit.Node;
					public createNode($this$createNode_u24lambda_u249: org.nativescript.mason.masonkit.MeasureFunc, func: boolean): org.nativescript.mason.masonkit.Node;
					public createView(context: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
					public createScrollView(context: globalAndroid.content.Context): org.nativescript.mason.masonkit.Scroll;
					public configureStyleForView(this_: globalAndroid.view.View, view: any): void;
					public nodeForView($this$nodeForView_u24lambda_u2410: globalAndroid.view.View): org.nativescript.mason.masonkit.Node;
					public syncStyleParts(high: globalAndroid.view.View, node: number, this_: number, view: number, lowLow: number): void;
					public styleForView(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Style;
					public setPercentWidth(view: globalAndroid.view.View, fraction: number): void;
					public setPercentHeight(view: globalAndroid.view.View, fraction: number): void;
					public styleForViewOrNode(view: any): org.nativescript.mason.masonkit.Style | null;
					public requestLayout(node: number): void;
					public requestLayout(view: globalAndroid.view.View): void;
					public finalize(): void;
					public getPreflight(): boolean;
					public setPreflight(value: boolean): void;
					public setViewport(width: number, height: number): void;
					public createNode(children: androidNative.Array<org.nativescript.mason.masonkit.Node> | null): org.nativescript.mason.masonkit.Node;
					public createNode(): org.nativescript.mason.masonkit.Node;
					public static getShared(): org.nativescript.mason.masonkit.Mason;
					public static nativeUaDefaultForTag(param0: string): androidNative.Array<number>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Mason {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Mason.Companion>;
						public getShared(): org.nativescript.mason.masonkit.Mason;
						public nativeUaDefaultForTag(tag: string): androidNative.Array<number>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Mason {
					export class ViewportListener {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Mason.ViewportListener>;
						/**
						 * Constructs a new instance of the org.nativescript.mason.masonkit.Mason$ViewportListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onViewportChanged(param0: number, param1: number): void;
						});
						public constructor();
						public onViewportChanged(param0: number, param1: number): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MasonBackgroundGlyphProvider {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MasonBackgroundGlyphProvider>;
					/**
					 * Constructs a new instance of the org.nativescript.mason.masonkit.MasonBackgroundGlyphProvider interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						drawGlyphMask(param0: globalAndroid.graphics.Canvas): void;
					});
					public constructor();
					public drawGlyphMask(param0: globalAndroid.graphics.Canvas): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MasonLayoutTree {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MasonLayoutTree>;
					public reading: boolean;
					public constructor();
					public getFrames(): androidNative.Array<number>;
					public getBorders(): androidNative.Array<number>;
					public getMargins(): androidNative.Array<number>;
					public getPaddings(): androidNative.Array<number>;
					public getContentSizes(): androidNative.Array<number>;
					public getScrollbarSizes(): androidNative.Array<number>;
					public getOrder(): androidNative.Array<number>;
					public getChildStart(): androidNative.Array<number>;
					public getChildCount(): androidNative.Array<number>;
					public getChildIndices(): androidNative.Array<number>;
					public getNodeCount(): number;
					public getCursor(): org.nativescript.mason.masonkit.MasonNodeView;
					public fromFloatArray(i: androidNative.Array<number>, parentIndex: number): boolean;
					public static getEmpty(): org.nativescript.mason.masonkit.MasonLayoutTree;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MasonLayoutTree {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MasonLayoutTree.Companion>;
						public getEmpty(): org.nativescript.mason.masonkit.MasonLayoutTree;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MasonNodeView {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MasonNodeView>;
					public constructor(tree: org.nativescript.mason.masonkit.MasonLayoutTree, index: number);
					public getTree(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public setTree(param0: org.nativescript.mason.masonkit.MasonLayoutTree): void;
					public getIndex(): number;
					public setIndex(param0: number): void;
					public pointTo(newIndex: number): void;
					public pointTo(newTree: org.nativescript.mason.masonkit.MasonLayoutTree, newIndex: number): void;
					public getX(): number;
					public getY(): number;
					public getWidth(): number;
					public getHeight(): number;
					public getBorderTop(): number;
					public getBorderRight(): number;
					public getBorderBottom(): number;
					public getBorderLeft(): number;
					public getMarginTop(): number;
					public getMarginRight(): number;
					public getMarginBottom(): number;
					public getMarginLeft(): number;
					public getPaddingTop(): number;
					public getPaddingRight(): number;
					public getPaddingBottom(): number;
					public getPaddingLeft(): number;
					public getContentWidth(): number;
					public getContentHeight(): number;
					public getScrollbarWidth(): number;
					public getScrollbarHeight(): number;
					public getOrder(): number;
					public getHasChildren(): boolean;
					public getChildNodeCount(): number;
					public childTreeIndex($this$atOrZero$iv: number): number;
					public childAt(i: number): org.nativescript.mason.masonkit.MasonNodeView;
					public getSizeIsEmpty(): boolean;
					public getPaddingIsEmpty(): boolean;
					public getMarginIsEmpty(): boolean;
					public getBorderIsEmpty(): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MasonPositioning {
					export class FixedOverlay {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MasonPositioning.FixedOverlay>;
						public constructor(context: globalAndroid.content.Context);
						public onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
						public onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class MaxSizing {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing>;
					public getType(): number;
					public getValue(): number;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.MaxSizing | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class Auto extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.MaxSizing.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.Companion>;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.MaxSizing | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class FitContent extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.FitContent>;
						public constructor(fitContent: number);
						public getFitContent(): number;
						public setFitContent(param0: number): void;
						public component1(): number;
						public copy(fitContent: number): org.nativescript.mason.masonkit.MaxSizing.FitContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class FitContentPercent extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.FitContentPercent>;
						public constructor(fitContent: number);
						public getFitContent(): number;
						public setFitContent(param0: number): void;
						public component1(): number;
						public copy(fitContent: number): org.nativescript.mason.masonkit.MaxSizing.FitContentPercent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class Fraction extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.Fraction>;
						public constructor(fraction: number);
						public getFraction(): number;
						public setFraction(param0: number): void;
						public component1(): number;
						public copy(fraction: number): org.nativescript.mason.masonkit.MaxSizing.Fraction;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class MaxContent extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.MaxContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MaxSizing.MaxContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class MinContent extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.MinContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MaxSizing.MinContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class Percent extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.MaxSizing.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MaxSizing {
					export class Points extends org.nativescript.mason.masonkit.MaxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MaxSizing.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.MaxSizing.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MeasureFunc {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MeasureFunc>;
					/**
					 * Constructs a new instance of the org.nativescript.mason.masonkit.MeasureFunc interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						measure(param0: number, param1: number, param2: number, param3: number): number;
					});
					public constructor();
					public measure(param0: number, param1: number, param2: number, param3: number): number;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class MeasureOutput {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MeasureOutput>;
					public static INSTANCE: org.nativescript.mason.masonkit.MeasureOutput;
					public static MIN_BITS: number = 2143289345;
					public static MAX_BITS: number = 2143289346;
					public static ZERO: number = 0;
					public static isMinContent(value: number): boolean;
					public static isMaxContent(value: number): boolean;
					public make(hBits: number, this_: number): number;
					public make(width: number, height: number): number;
					public getWidth(measureOutput: number): number;
					public getHeight(measureOutput: number): number;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class MinMax {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax>;
					public getMin(): org.nativescript.mason.masonkit.MinSizing;
					public getMax(): org.nativescript.mason.masonkit.MaxSizing;
					public getMinType(): number;
					public getMinValue(): number;
					public getMaxType(): number;
					public getMaxValue(): number;
					public getCssValue(): string;
					public static fromTypeValue(minType: number, minValue: number, maxType: number, maxValue: number): org.nativescript.mason.masonkit.MinMax | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Auto extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinMax.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Companion>;
						public fromTypeValue(max: number, this_: number, minType: number, minValue: number): org.nativescript.mason.masonkit.MinMax | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class FitContent extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.FitContent>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.MinMax.FitContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class FitContentPercent extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.FitContentPercent>;
						public constructor(percent: number);
						public getPercent(): number;
						public setPercent(param0: number): void;
						public component1(): number;
						public copy(percent: number): org.nativescript.mason.masonkit.MinMax.FitContentPercent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Fraction extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Fraction>;
						public constructor(fraction: number);
						public getFraction(): number;
						public setFraction(param0: number): void;
						public component1(): number;
						public copy(fraction: number): org.nativescript.mason.masonkit.MinMax.Fraction;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class MaxContent extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.MaxContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinMax.MaxContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class MinContent extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.MinContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinMax.MinContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Percent extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.MinMax.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Points extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.MinMax.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinMax {
					export class Values extends org.nativescript.mason.masonkit.MinMax {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinMax.Values>;
						public constructor(minVal: org.nativescript.mason.masonkit.MinSizing, maxVal: org.nativescript.mason.masonkit.MaxSizing);
						public getMinVal(): org.nativescript.mason.masonkit.MinSizing;
						public getMaxVal(): org.nativescript.mason.masonkit.MaxSizing;
						public component1(): org.nativescript.mason.masonkit.MinSizing;
						public component2(): org.nativescript.mason.masonkit.MaxSizing;
						public copy(minVal: org.nativescript.mason.masonkit.MinSizing, maxVal: org.nativescript.mason.masonkit.MaxSizing): org.nativescript.mason.masonkit.MinMax.Values;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class MinSizing {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing>;
					public getType(): number;
					public getValue(): number;
					public static fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.MinSizing | null;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class Auto extends org.nativescript.mason.masonkit.MinSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.Auto>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinSizing.Auto;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.Companion>;
						public fromTypeValue(type: number, value: number): org.nativescript.mason.masonkit.MinSizing | null;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class MaxContent extends org.nativescript.mason.masonkit.MinSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.MaxContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinSizing.MaxContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class MinContent extends org.nativescript.mason.masonkit.MinSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.MinContent>;
						public static INSTANCE: org.nativescript.mason.masonkit.MinSizing.MinContent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class Percent extends org.nativescript.mason.masonkit.MinSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.Percent>;
						public constructor(percentage: number);
						public getPercentage(): number;
						public setPercentage(param0: number): void;
						public component1(): number;
						public copy(percentage: number): org.nativescript.mason.masonkit.MinSizing.Percent;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module MinSizing {
					export class Points extends org.nativescript.mason.masonkit.MinSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.MinSizing.Points>;
						public constructor(points: number);
						public getPoints(): number;
						public setPoints(param0: number): void;
						public component1(): number;
						public copy(points: number): org.nativescript.mason.masonkit.MinSizing.Points;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class NativeHelpers {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.NativeHelpers>;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module NativeObject {
					export class DefaultImpls {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.NativeObject.DefaultImpls>;
						public static nativePtr($this: org.nativescript.mason.masonkit.NativeObject): number;
						public static hasObjectId($this: org.nativescript.mason.masonkit.NativeObject): boolean;
						public static objectId($this: org.nativescript.mason.masonkit.NativeObject): number;
						public static setTracked($this: org.nativescript.mason.masonkit.NativeObject, value: boolean): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class NativeObjectType {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.NativeObjectType>;
					public static Mason: org.nativescript.mason.masonkit.NativeObjectType;
					public static Node: org.nativescript.mason.masonkit.NativeObjectType;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.NativeObjectType>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.NativeObjectType;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module NineSliceKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.NineSliceKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Node extends org.nativescript.mason.masonkit.NativeObject {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Node>;
					public touchAction: number;
					public constructor(mason: org.nativescript.mason.masonkit.Mason, nativePtr: number, nodeType: org.nativescript.mason.masonkit.NodeType);
					public getComputeCache(): any;
					public setComputeCache(value: any): void;
					public getComputedX(): number;
					public getComputedY(): number;
					public getComputedWidth(): number;
					public getComputedHeight(): number;
					public getComputedBorderTop(): number;
					public getComputedBorderRight(): number;
					public getComputedBorderBottom(): number;
					public getComputedBorderLeft(): number;
					public getComputedMarginTop(): number;
					public getComputedMarginRight(): number;
					public getComputedMarginBottom(): number;
					public getComputedMarginLeft(): number;
					public getComputedPaddingTop(): number;
					public getComputedPaddingRight(): number;
					public getComputedPaddingBottom(): number;
					public getComputedPaddingLeft(): number;
					public getComputedContentWidth(): number;
					public getComputedContentHeight(): number;
					public getComputedScrollbarWidth(): number;
					public getComputedScrollbarHeight(): number;
					public getComputedOrder(): number;
					public getComputedHasChildren(): boolean;
					public getComputedChildNodeCount(): number;
					public getComputedSizeIsEmpty(): boolean;
					public computedWidthSafe(): number;
					public getComputedLayout(): org.nativescript.mason.masonkit.Layout;
					public getComputedPaddingIsEmpty(): boolean;
					public getComputedMarginIsEmpty(): boolean;
					public getComputedBorderIsEmpty(): boolean;
					public getParent(): org.nativescript.mason.masonkit.Node | null;
					public nativePtr(): number;
					public hasObjectId(): boolean;
					public objectId(): number;
					public getObjectType(): org.nativescript.mason.masonkit.NativeObjectType;
					public isTracked(): boolean;
					public setTracked(value: boolean): void;
					public getOnNodeAttached(): any | null;
					public setOnNodeAttached(param0: any | null): void;
					public getOnNodeDetached(): any | null;
					public setOnNodeDetached(param0: any | null): void;
					public getParentNode(): org.nativescript.mason.masonkit.Node | null;
					public getParentElement(): org.nativescript.mason.masonkit.Element | null;
					public setComputedSize(width: number, height: number): void;
					public getType(): org.nativescript.mason.masonkit.NodeType;
					public getView(): any;
					public setView(param0: any): void;
					public getNativePtr(): number;
					public getRootNode(): org.nativescript.mason.masonkit.Node | null;
					public getChildAt(index: number): org.nativescript.mason.masonkit.Node | null;
					public getChildren(): java.util.List<org.nativescript.mason.masonkit.Node>;
					public getLayoutChildren(): java.util.List<org.nativescript.mason.masonkit.Node>;
					public getPseudoMask(): number;
					public getPseudoStates(): java.util.Set<org.nativescript.mason.masonkit.PseudoState>;
					public hasPseudo(state: org.nativescript.mason.masonkit.PseudoState): boolean;
					public hasPseudoSetFor(mask: org.nativescript.mason.masonkit.StateKeys): boolean;
					public hasPseudoSetInBuffer(setLow: number, setHigh: org.nativescript.mason.masonkit.StateKeys): boolean;
					public getPseudoSetFlags(this_: number): org.nativescript.mason.masonkit.StateKeys;
					public setPseudo(state: org.nativescript.mason.masonkit.PseudoState, enabled: boolean): void;
					public setPseudoString(it: number, param1: string, answer$iv: string): void;
					public getPseudoString(flags: number, key: string): string | null;
					public clearPseudoString(dict: number, this_: string): void;
					public getPseudoBuffer(it: number): java.nio.ByteBuffer;
					public preparePseudoBuffer(it: number): java.nio.ByteBuffer;
					public isActive(): boolean;
					public isHover(): boolean;
					public isFocused(): boolean;
					public isDisabled(): boolean;
					public appendChild(child: org.nativescript.mason.masonkit.Node, attach: boolean): void;
					public addChildAt(child: org.nativescript.mason.masonkit.Node, index: number): void;
					public replaceChildAt(this_: org.nativescript.mason.masonkit.Node, child: number): void;
					public removeChildAt(this_: number): org.nativescript.mason.masonkit.Node | null;
					public removeChild(this_: org.nativescript.mason.masonkit.Node): org.nativescript.mason.masonkit.Node | null;
					public appendChild(this_: globalAndroid.view.View): void;
					public dirty(): void;
					public isDirty(): boolean;
					public getChildCount(): number;
					public setMeasureFunction(this_: org.nativescript.mason.masonkit.MeasureFunc): void;
					public removeMeasureFunction(): void;
					public removeChildren(): void;
					public appendChild(child: org.nativescript.mason.masonkit.Node): void;
					public static measure(id: number, knownDimensionsSpec: number, availableSpaceSpec: number): number;
					public static setComputedSizeTestCallback(cb: any | null): void;
					public static setComputedSize(node: number, width: number, height: number): void;
					public static getComputedSize(node: number): number;
					public static markPseudoSet(buf: java.nio.ByteBuffer, key: org.nativescript.mason.masonkit.StateKeys): void;
					public setTracked(param0: boolean): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Node {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Node.Companion>;
						public measure(id: number, knownDimensionsSpec: number, availableSpaceSpec: number): number;
						public setComputedSizeTestCallback(cb: any | null): void;
						public setComputedSize(this_: number, node: number, width: number): void;
						public getComputedSize(it: number): number;
						public markPseudoSet(buf: java.nio.ByteBuffer, key: org.nativescript.mason.masonkit.StateKeys): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class NodeHelper {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.NodeHelper>;
					public constructor(mason: org.nativescript.mason.masonkit.Mason);
					public getMason(): org.nativescript.mason.masonkit.Mason;
					public getViews(): java.util.ArrayList<org.nativescript.mason.masonkit.View>;
					public configure(view: globalAndroid.view.View, block: any): void;
					public logPerf(time: number): void;
					public longRunningFunction(): number;
					public batchCreateViews(this_: globalAndroid.content.Context): void;
					public getDisplay(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Display;
					public setDisplay(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Display): void;
					public getPosition(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Position;
					public setPosition(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Position): void;
					public getDirection(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Direction;
					public setDirection(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Direction): void;
					public getFlexDirection(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.FlexDirection;
					public setFlexDirection(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.FlexDirection): void;
					public getFlexWrap(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.FlexWrap;
					public setFlexWrap(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.FlexWrap): void;
					public getOverflow(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>;
					public setOverflow(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>): void;
					public getOverflowX(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowX(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getOverflowY(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowY(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getScrollBarWidth(this_: globalAndroid.view.View): number;
					public setScrollBarWidth(this_: globalAndroid.view.View, view: number): void;
					public getFloat(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.Float;
					public setFloat(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.Float): void;
					public getFloatRectsWithAndroidIds(this_: globalAndroid.view.View): androidNative.Array<number>;
					public getFloatRectsLocalToView(this_: globalAndroid.view.View): any;
					public getCachedFloatInsetsForView(w: globalAndroid.view.View, rects: number, leftInset: number): any;
					public getAlignItems(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.AlignItems;
					public setAlignItems(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.AlignItems): void;
					public getAlignSelf(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.AlignSelf;
					public setAlignSelf(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.AlignSelf): void;
					public getAlignContent(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.AlignContent;
					public setAlignContent(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.AlignContent): void;
					public getJustifyItems(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.JustifyItems;
					public setJustifyItems(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.JustifyItems): void;
					public getJustifySelf(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.JustifySelf;
					public setJustifySelf(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.JustifySelf): void;
					public getJustifyContent(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.JustifyContent;
					public setJustifyContent(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.JustifyContent): void;
					public getFlexGrow(this_: globalAndroid.view.View): number;
					public setFlexGrow(this_: globalAndroid.view.View, view: number): void;
					public getFlexShrink(this_: globalAndroid.view.View): number;
					public setFlexShrink(this_: globalAndroid.view.View, view: number): void;
					public setFlexBasis(this_: globalAndroid.view.View, view: number, value: number): void;
					public getFlexBasis(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public setFlexBasis(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public getPadding(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public getStylePaddingLeft(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingRight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingTop(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingBottom(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getPaddingCssValue(this_: globalAndroid.view.View): string;
					public getPaddingJsonValue(this_: globalAndroid.view.View): string;
					public setPadding(this_: globalAndroid.view.View, view: number, left: number, top: number, right: number): void;
					public setPadding(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.LengthPercentage, left: org.nativescript.mason.masonkit.LengthPercentage, top: org.nativescript.mason.masonkit.LengthPercentage, right: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setPadding(this_: globalAndroid.view.View, view: number, left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number): void;
					public setPaddingIfChanged(current: globalAndroid.view.View, newLeft: number, newRight: number, newTop: number, newBottom: number): void;
					public setPaddingLeft(this_: globalAndroid.view.View, view: number, value: number): void;
					public setPaddingRight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setPaddingTop(this_: globalAndroid.view.View, view: number, value: number): void;
					public setPaddingBottom(this_: globalAndroid.view.View, view: number, value: number): void;
					public setPaddingWithValueType(this_: globalAndroid.view.View, view: number, value: number): void;
					public getBorderWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public getBorderLeftWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderRightWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderTopWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderBottomWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderWidthCssValue(this_: globalAndroid.view.View): string;
					public getBorderWidthJsonValue(this_: globalAndroid.view.View): string;
					public setBorder(this_: globalAndroid.view.View, view: string): void;
					public getBorder(this_: globalAndroid.view.View): string;
					public setBorderLeft(this_: globalAndroid.view.View, view: string): void;
					public setBorderTop(this_: globalAndroid.view.View, view: string): void;
					public setBorderRight(this_: globalAndroid.view.View, view: string): void;
					public setBorderBottom(this_: globalAndroid.view.View, view: string): void;
					public setPaddingCss(this_: globalAndroid.view.View, view: string): void;
					public setMarginCss(this_: globalAndroid.view.View, view: string): void;
					public setInsetCss(this_: globalAndroid.view.View, view: string): void;
					public setBorderWidth(this_: globalAndroid.view.View, view: number, left: number, top: number, right: number): void;
					public setBorderWidth(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.LengthPercentage, left: org.nativescript.mason.masonkit.LengthPercentage, top: org.nativescript.mason.masonkit.LengthPercentage, right: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setBorderWidth(this_: globalAndroid.view.View, view: number, left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number): void;
					public setBorderLeftWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setBorderRightWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setBorderTopWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setBorderBottomWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setBorderWithValueType(this_: globalAndroid.view.View, view: number, value: number): void;
					public getMargin(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getMarginLeft(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginRight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginTop(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginBottom(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginCssValue(this_: globalAndroid.view.View): string;
					public getMarginJsonValue(this_: globalAndroid.view.View): string;
					public setMargin(this_: globalAndroid.view.View, view: number, left: number, top: number, right: number): void;
					public setMargin(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.LengthPercentageAuto, left: org.nativescript.mason.masonkit.LengthPercentageAuto, top: org.nativescript.mason.masonkit.LengthPercentageAuto, right: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public setMargin(this_: globalAndroid.view.View, view: number, left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number): void;
					public setMarginLeft(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMarginRight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMarginTop(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMarginBottom(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMarginWithValueType(this_: globalAndroid.view.View, view: number, value: number): void;
					public getInset(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getInsetLeft(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetRight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetTop(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetBottom(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetCssValue(this_: globalAndroid.view.View): string;
					public getInsetJsonValue(this_: globalAndroid.view.View): string;
					public setPosition(this_: globalAndroid.view.View, view: number, left: number, top: number, right: number): void;
					public setPosition(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.LengthPercentageAuto, left: org.nativescript.mason.masonkit.LengthPercentageAuto, top: org.nativescript.mason.masonkit.LengthPercentageAuto, right: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public setInset(this_: globalAndroid.view.View, view: number, left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number): void;
					public setInsetLeft(this_: globalAndroid.view.View, view: number, value: number): void;
					public setInsetRight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setInsetTop(this_: globalAndroid.view.View, view: number, value: number): void;
					public setInsetBottom(this_: globalAndroid.view.View, view: number, value: number): void;
					public setInsetWithValueType(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMinSize(this_: globalAndroid.view.View, view: number, width: number): void;
					public getMinSize(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getMinSizeWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public getMinSizeHeight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public getMinSizeCssValue(this_: globalAndroid.view.View): string;
					public getMinSizeJsonValue(this_: globalAndroid.view.View): string;
					public setMinSize(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension, width: org.nativescript.mason.masonkit.Dimension): void;
					public setMinSize(this_: globalAndroid.view.View, view: number, width: number, widthType: number, height: number): void;
					public setMinSizeWidth(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public setMinSizeHeight(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public setMinSizeWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMinSizeHeight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setSize(this_: globalAndroid.view.View, view: number, width: number): void;
					public getSize(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getSizeCssValue(this_: globalAndroid.view.View): string;
					public getSizeJsonValue(this_: globalAndroid.view.View): string;
					public getSizeWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public getSizeHeight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public setSize(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension, width: org.nativescript.mason.masonkit.Dimension): void;
					public setSize(this_: globalAndroid.view.View, view: number, width: number, widthType: number, height: number): void;
					public setSizeWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setSizeWidth(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public setSizeHeight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMaxSize(this_: globalAndroid.view.View, view: number, width: number): void;
					public getMaxSize(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getMaxSizeWidth(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public getMaxSizeHeight(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Dimension;
					public getMaxSizeCssValue(this_: globalAndroid.view.View): string;
					public getMaxSizeJsonValue(this_: globalAndroid.view.View): string;
					public setMaxSize(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension, width: org.nativescript.mason.masonkit.Dimension): void;
					public setMaxSize(this_: globalAndroid.view.View, view: number, width: number, widthType: number, height: number): void;
					public setMaxSizeWidth(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMaxSizeHeight(this_: globalAndroid.view.View, view: number, value: number): void;
					public setMaxSizeWidth(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public setMaxSizeHeight(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.Dimension): void;
					public setGap(this_: globalAndroid.view.View, view: number, width: number): void;
					public getGap(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.LengthPercentage>;
					public getGapRow(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public getGapColumn(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.LengthPercentage;
					public setGap(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.LengthPercentage, row: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setGap(this_: globalAndroid.view.View, view: number, width: number, widthType: number, height: number): void;
					public setGapRow(view: globalAndroid.view.View, value: number, type: number): void;
					public setRowGap(this_: globalAndroid.view.View, view: number, value: number): void;
					public setGapColumn(view: globalAndroid.view.View, value: number, type: number): void;
					public setColumnGap(this_: globalAndroid.view.View, view: number, value: number): void;
					public getAspectRatio(this_: globalAndroid.view.View): java.lang.Float | null;
					public setAspectRatio(this_: globalAndroid.view.View, view: java.lang.Float | null): void;
					public getTextAlign(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.TextAlign;
					public setTextAlign(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.TextAlign): void;
					public getBoxSizing(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.BoxSizing;
					public setTextAlign(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.BoxSizing): void;
					public getGridAutoRows(this_: globalAndroid.view.View): string;
					public setGridAutoRows(this_: globalAndroid.view.View, view: string): void;
					public getGridAutoColumns(this_: globalAndroid.view.View): string;
					public setGridAutoColumns(this_: globalAndroid.view.View, view: string): void;
					public getGridAutoFlow(this_: globalAndroid.view.View): org.nativescript.mason.masonkit.enums.GridAutoFlow;
					public setGridAutoFlow(this_: globalAndroid.view.View, view: org.nativescript.mason.masonkit.enums.GridAutoFlow): void;
					public getGridColumn(this_: globalAndroid.view.View): string;
					public setGridColumn(this_: globalAndroid.view.View, view: string): void;
					public getGridColumnStart(this_: globalAndroid.view.View): string;
					public setGridColumnStart(this_: globalAndroid.view.View, view: string): void;
					public getGridColumnEnd(this_: globalAndroid.view.View): string;
					public setGridColumnEnd(this_: globalAndroid.view.View, view: string): void;
					public getGridRow(this_: globalAndroid.view.View): string;
					public setGridRow(this_: globalAndroid.view.View, view: string): void;
					public getGridRowStart(this_: globalAndroid.view.View): string;
					public setGridRowStart(this_: globalAndroid.view.View, view: string): void;
					public getGridRowEnd(this_: globalAndroid.view.View): string;
					public setGridRowEnd(this_: globalAndroid.view.View, view: string): void;
					public getGridTemplateRows(this_: globalAndroid.view.View): string;
					public setGridTemplateRows(this_: globalAndroid.view.View, view: string): void;
					public getGridTemplateColumns(this_: globalAndroid.view.View): string;
					public setGridTemplateColumns(this_: globalAndroid.view.View, view: string): void;
					public getGridArea(this_: globalAndroid.view.View): string;
					public setGridArea(this_: globalAndroid.view.View, view: string): void;
					public getGridTemplateAreas(this_: globalAndroid.view.View): string;
					public setGridTemplateAreas(this_: globalAndroid.view.View, view: string): void;
					public getBackground(this_: globalAndroid.view.View): string;
					public setBackground(this_: globalAndroid.view.View, view: string): void;
					public getFilter(this_: globalAndroid.view.View): string;
					public setFilter(this_: globalAndroid.view.View, view: string): void;
					public getBorderRadius(this_: globalAndroid.view.View): string;
					public setBorderRadius(this_: globalAndroid.view.View, view: string): void;
					public setFontFamily(this_: globalAndroid.view.View, view: string): void;
					public getFontFamily(this_: globalAndroid.view.View): string;
					public setTextDecoration(view: globalAndroid.view.View, value: string): void;
					public getTextDecorationLine(view: globalAndroid.view.View): string;
					public setTextDecorationLine(view: globalAndroid.view.View, value: string): void;
					public getTextDecorationStyle(view: globalAndroid.view.View): string;
					public setTextDecorationStyle(view: globalAndroid.view.View, value: string): void;
					public getTextDecorationColor(view: globalAndroid.view.View): string;
					public setTextDecorationColor(view: globalAndroid.view.View, value: string): void;
					public setBorderColor(it: globalAndroid.view.View, item$iv$iv: string): void;
					public setListStyleType(type: globalAndroid.view.View, this_: string): void;
					public setListStylePosition(pos: globalAndroid.view.View, this_: string): void;
					public getBackgroundColor(this_: globalAndroid.view.View): string;
					public setBackgroundColor(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundImage(this_: globalAndroid.view.View): string;
					public setBackgroundImage(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundRepeat(this_: globalAndroid.view.View): string;
					public setBackgroundRepeat(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundPosition(this_: globalAndroid.view.View): string;
					public setBackgroundPosition(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundSize(this_: globalAndroid.view.View): string;
					public setBackgroundSize(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundClip(this_: globalAndroid.view.View): string;
					public setBackgroundClip(this_: globalAndroid.view.View, view: string): void;
					public getBackgroundPositionX(view: globalAndroid.view.View): string;
					public setBackgroundPositionX(view: globalAndroid.view.View, value: string): void;
					public getBackgroundPositionY(view: globalAndroid.view.View): string;
					public setBackgroundPositionY(view: globalAndroid.view.View, value: string): void;
					public getBackgroundOrigin(view: globalAndroid.view.View): string;
					public setBackgroundOrigin(view: globalAndroid.view.View, value: string): void;
					public getBackgroundAttachment(view: globalAndroid.view.View): string;
					public setBackgroundAttachment(view: globalAndroid.view.View, value: string): void;
					public getBackgroundBlendMode(view: globalAndroid.view.View): string;
					public setBackgroundBlendMode(view: globalAndroid.view.View, value: string): void;
					public getTextShadow(this_: globalAndroid.view.View): string;
					public setTextShadow(this_: globalAndroid.view.View, view: string): void;
					public getCornerShape(this_: globalAndroid.view.View): string;
					public setCornerShape(this_: globalAndroid.view.View, view: string): void;
					public getCornerShapeTopLeft(this_: globalAndroid.view.View): string;
					public setCornerShapeTopLeft(this_: globalAndroid.view.View, view: string): void;
					public getCornerShapeTopRight(this_: globalAndroid.view.View): string;
					public setCornerShapeTopRight(this_: globalAndroid.view.View, view: string): void;
					public getCornerShapeBottomRight(this_: globalAndroid.view.View): string;
					public setCornerShapeBottomRight(this_: globalAndroid.view.View, view: string): void;
					public getCornerShapeBottomLeft(this_: globalAndroid.view.View): string;
					public setCornerShapeBottomLeft(this_: globalAndroid.view.View, view: string): void;
					public getBoxShadow(this_: globalAndroid.view.View): string;
					public setBoxShadow(this_: globalAndroid.view.View, view: string): void;
					public setBoxShadowRenderMode(mode: string | null): void;
					public setBoxShadowSoftwareRasterScale(it: number): void;
					public getTransform(this_: globalAndroid.view.View): string;
					public setTransform(this_: globalAndroid.view.View, view: string): void;
					public getBorderImage(this_: globalAndroid.view.View): string;
					public setBorderImage(this_: globalAndroid.view.View, view: string): void;
					public getBackdropFilter(this_: globalAndroid.view.View): string;
					public setBackdropFilter(this_: globalAndroid.view.View, view: string): void;
					public getMaskImage(this_: globalAndroid.view.View): string;
					public setMaskImage(this_: globalAndroid.view.View, view: string): void;
					public getMaskSize(this_: globalAndroid.view.View): string;
					public setMaskSize(this_: globalAndroid.view.View, view: string): void;
					public getMaskPosition(this_: globalAndroid.view.View): string;
					public setMaskPosition(this_: globalAndroid.view.View, view: string): void;
					public getMaskRepeat(this_: globalAndroid.view.View): string;
					public setMaskRepeat(this_: globalAndroid.view.View, view: string): void;
					public getMaskOrigin(this_: globalAndroid.view.View): string;
					public setMaskOrigin(this_: globalAndroid.view.View, view: string): void;
					public getMaskClip(this_: globalAndroid.view.View): string;
					public setMaskClip(this_: globalAndroid.view.View, view: string): void;
					public getMaskMode(this_: globalAndroid.view.View): string;
					public setMaskMode(this_: globalAndroid.view.View, view: string): void;
					public getMaskComposite(this_: globalAndroid.view.View): string;
					public setMaskComposite(this_: globalAndroid.view.View, view: string): void;
					public getClipPath(this_: globalAndroid.view.View): string;
					public setClipPath(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderSource(this_: globalAndroid.view.View): string;
					public setMaskBorderSource(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderSlice(this_: globalAndroid.view.View): string;
					public setMaskBorderSlice(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderWidth(this_: globalAndroid.view.View): string;
					public setMaskBorderWidth(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderOutset(this_: globalAndroid.view.View): string;
					public setMaskBorderOutset(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderRepeat(this_: globalAndroid.view.View): string;
					public setMaskBorderRepeat(this_: globalAndroid.view.View, view: string): void;
					public getMaskBorderMode(this_: globalAndroid.view.View): string;
					public setMaskBorderMode(this_: globalAndroid.view.View, view: string): void;
					public getFontFeatureSettings(this_: globalAndroid.view.View): string;
					public setFontFeatureSettings(this_: globalAndroid.view.View, view: string): void;
					public compute(node: org.nativescript.mason.masonkit.Node): void;
					public static getShared(): org.nativescript.mason.masonkit.NodeHelper;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module NodeHelper {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.NodeHelper.Companion>;
						public getShared(): org.nativescript.mason.masonkit.NodeHelper;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class NodeStateKeys {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.NodeStateKeys>;
					public static INSTANCE: org.nativescript.mason.masonkit.NodeStateKeys;
					public static IS_NODE_DIRTY: number = 0;
					public static IS_VIRTUAL: number = 1;
					public static IS_MUTABLE: number = 2;
					public static PSEUDO_FLAGS_INDEX: number = 3;
					public static IS_HIDDEN: number = 5;
					public static NODE_STATE_BUFFER_SIZE: number = 6;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class NodeType {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.NodeType>;
					public static Element: org.nativescript.mason.masonkit.NodeType;
					public static Text: org.nativescript.mason.masonkit.NodeType;
					public static Document: org.nativescript.mason.masonkit.NodeType;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.NodeType>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.NodeType;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module NodeUtils {
					export class PendingRemoval {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.NodeUtils.PendingRemoval>;
						public constructor(expected: globalAndroid.view.ViewGroup, view: globalAndroid.view.View, oldVisibility: number);
						public getExpected(): globalAndroid.view.ViewGroup;
						public getView(): globalAndroid.view.View;
						public getOldVisibility(): number;
						public getCancelled(): boolean;
						public setCancelled(param0: boolean): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ObjectManager {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ObjectManager>;
					public add(recycled: any): number;
					public remove(id: number): void;
					public getSize(): number;
					public get(id: number): any;
					public clear(): void;
					public static getShared(): org.nativescript.mason.masonkit.ObjectManager;
					public static addItem(value: any): number;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ObjectManager {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ObjectManager.Companion>;
						public getShared(): org.nativescript.mason.masonkit.ObjectManager;
						public addItem(value: any): number;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Point<T>  extends java.lang.Object {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Point<any>>;
					public constructor(x: T, y: T);
					public getX(): T;
					public getY(): T;
					public component1(): T;
					public component2(): T;
					public copy(x: T, y: T): org.nativescript.mason.masonkit.Point<T>;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module PositionAxis {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.PositionAxis.Companion>;
						public getCENTER(): org.nativescript.mason.masonkit.PositionAxis;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class PseudoState {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.PseudoState>;
					public static DEFAULT: org.nativescript.mason.masonkit.PseudoState;
					public static HOVER: org.nativescript.mason.masonkit.PseudoState;
					public static ACTIVE: org.nativescript.mason.masonkit.PseudoState;
					public static FOCUS: org.nativescript.mason.masonkit.PseudoState;
					public static FOCUS_WITHIN: org.nativescript.mason.masonkit.PseudoState;
					public static FOCUS_VISIBLE: org.nativescript.mason.masonkit.PseudoState;
					public static DISABLED: org.nativescript.mason.masonkit.PseudoState;
					public static CHECKED: org.nativescript.mason.masonkit.PseudoState;
					public getMask(): number;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.PseudoState>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.PseudoState;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Rect<T>  extends java.lang.Object {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Rect<any>>;
					public constructor(top: T, right: T, bottom: T, left: T);
					public getTop(): T;
					public getRight(): T;
					public getBottom(): T;
					public getLeft(): T;
					public component1(): T;
					public component2(): T;
					public component3(): T;
					public component4(): T;
					public copy(top: T, right: T, bottom: T, left: T): org.nativescript.mason.masonkit.Rect<T>;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public static uniform(value: any): org.nativescript.mason.masonkit.Rect<any>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Rect {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Rect.Companion>;
						public uniform(value: any): org.nativescript.mason.masonkit.Rect<any>;
						public getZeroAuto(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
						public getZero(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
						public withPx(top: number, right: number, bottom: number, left: number): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
						public withPxAuto(top: number, right: number, bottom: number, left: number): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class RepeatStyle {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.RepeatStyle>;
					public static REPEAT: org.nativescript.mason.masonkit.RepeatStyle;
					public static SPACE: org.nativescript.mason.masonkit.RepeatStyle;
					public static ROUND: org.nativescript.mason.masonkit.RepeatStyle;
					public static NO_REPEAT: org.nativescript.mason.masonkit.RepeatStyle;
					public getValue(): string;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.RepeatStyle>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.RepeatStyle;
					public static getEntries(): any;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module RepeatStyle {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.RepeatStyle.Companion>;
						public parse(it: string): org.nativescript.mason.masonkit.RepeatStyle | null;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ResolvedClip {
					export class Ellipse extends org.nativescript.mason.masonkit.ResolvedClip {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ResolvedClip.Ellipse>;
						public constructor(cx: number, cy: number, rx: number, ry: number);
						public getCx(): number;
						public getCy(): number;
						public getRx(): number;
						public getRy(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public copy(cx: number, cy: number, rx: number, ry: number): org.nativescript.mason.masonkit.ResolvedClip.Ellipse;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ResolvedClip {
					export class PathShape extends org.nativescript.mason.masonkit.ResolvedClip {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ResolvedClip.PathShape>;
						public constructor(commands: java.util.List<any>, evenOdd: boolean, dx: number, dy: number, scale: number);
						public getCommands(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
						public getEvenOdd(): boolean;
						public getDx(): number;
						public getDy(): number;
						public getScale(): number;
						public component1(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
						public component2(): boolean;
						public component3(): number;
						public component4(): number;
						public component5(): number;
						public copy(commands: java.util.List<any>, evenOdd: boolean, dx: number, dy: number, scale: number): org.nativescript.mason.masonkit.ResolvedClip.PathShape;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ResolvedClip {
					export class Polygon extends org.nativescript.mason.masonkit.ResolvedClip {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ResolvedClip.Polygon>;
						public constructor(points: androidNative.Array<number>, evenOdd: boolean);
						public getPoints(): androidNative.Array<number>;
						public getEvenOdd(): boolean;
						public equals(other: any): boolean;
						public hashCode(): number;
						public component1(): androidNative.Array<number>;
						public component2(): boolean;
						public copy(points: androidNative.Array<number>, evenOdd: boolean): org.nativescript.mason.masonkit.ResolvedClip.Polygon;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ResolvedClip {
					export class RoundRect extends org.nativescript.mason.masonkit.ResolvedClip {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ResolvedClip.RoundRect>;
						public constructor(rect: org.nativescript.mason.masonkit.RectBox, radii: androidNative.Array<number>);
						public getRect(): org.nativescript.mason.masonkit.RectBox;
						public getRadii(): androidNative.Array<number>;
						public equals(other: any): boolean;
						public hashCode(): number;
						public component1(): org.nativescript.mason.masonkit.RectBox;
						public component2(): androidNative.Array<number>;
						public copy(rect: org.nativescript.mason.masonkit.RectBox, radii: androidNative.Array<number>): org.nativescript.mason.masonkit.ResolvedClip.RoundRect;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Scroll extends org.nativescript.mason.masonkit.TwoDScrollView implements org.nativescript.mason.masonkit.Element, org.nativescript.mason.masonkit.StyleChangeListener {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Scroll>;
					public node: org.nativescript.mason.masonkit.Node;
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null);
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null, defStyle: number);
					public constructor(context: globalAndroid.content.Context);
					public constructor($this$_init__u24lambda_u241: globalAndroid.content.Context, this_: globalAndroid.util.AttributeSet | null, context: number, attrs: boolean);
					public getNode(): org.nativescript.mason.masonkit.Node;
					public setNode(param0: org.nativescript.mason.masonkit.Node): void;
					public getView(): globalAndroid.view.View;
					public getStyle(): org.nativescript.mason.masonkit.Style;
					public getEnableScrollX(): boolean;
					public setEnableScrollX(value: boolean): void;
					public getEnableScrollY(): boolean;
					public setEnableScrollY(value: boolean): void;
					public getVisibleOverflowScrolls(): boolean;
					public setVisibleOverflowScrolls(param0: boolean): void;
					public constructor($this$_init__u24lambda_u240: globalAndroid.content.Context, this_: org.nativescript.mason.masonkit.Mason);
					public registerSticky(view: globalAndroid.view.View): void;
					public onScrollMotionEnded(): void;
					public onChange(low: number, high: number): void;
					public onSizeChanged(it: number, element$iv: number, $i$f$forEach: number, $this$forEach$iv: number): void;
					public draw(this_: globalAndroid.graphics.Canvas): void;
					public dispatchTouchEvent(ev: globalAndroid.view.MotionEvent): boolean;
					public onDescendantInvalidated(child: globalAndroid.view.View, target: globalAndroid.view.View): void;
					public dispatchDraw(canvas: globalAndroid.graphics.Canvas): void;
					public addView(this_: globalAndroid.view.View): void;
					public addView(this_: globalAndroid.view.View, child: number): void;
					public addView(this_: globalAndroid.view.View, child: globalAndroid.view.ViewGroup.LayoutParams): void;
					public addView(this_: globalAndroid.view.View, child: number, index: globalAndroid.view.ViewGroup.LayoutParams): void;
					public removeView(this_: globalAndroid.view.View | null): void;
					public removeViewAt(index: number): void;
					public onMeasure(heightArg: number, stale: number): void;
					public onAttachedToWindow(): void;
					public onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
					public generateDefaultLayoutParams(): globalAndroid.widget.FrameLayout.LayoutParams;
					public layout(): org.nativescript.mason.masonkit.Layout;
					public getWritableStyleBuffer(): java.nio.ByteBuffer;
					public addEventListener(type: string, listener: any): java.util.UUID;
					public ensureNativeClickDispatch(): void;
					public syncStyleParts(lowLow: number, lowHigh: number, highLow: number, highHigh: number): void;
					public syncStyle(low: number, high: number): void;
					public onNodeAttached(): void;
					public onNodeDetached(): void;
					public markNodeDirty(): void;
					public isNodeDirty(): boolean;
					public configure(block: any): org.nativescript.mason.masonkit.Element;
					public elementFromPoint(x: number, y: number): globalAndroid.view.View | null;
					public layoutFlat(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public compute(): void;
					public compute(widthArg: number, heightArg: number): void;
					public computeMaxContent(): void;
					public computeMinContent(): void;
					public computeWithViewSize(): void;
					public computeWithViewSize(layout: boolean): void;
					public computeNestedRootLater(widthArg: number, heightArg: number): void;
					public computeOrDeferNested(widthArg: number, heightArg: number): boolean;
					public invalidateForeignHost(): void;
					public computeAndLayout(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeAndLayout(width: number, height: number): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeWithSize(width: number, height: number): void;
					public computeWithMaxContent(): void;
					public computeWithMinContent(): void;
					public attachAndApply(): void;
					public append(element: org.nativescript.mason.masonkit.Element): void;
					public append(node: org.nativescript.mason.masonkit.Node): void;
					public append(nodes: java.util.List<any>): void;
					public append(elements: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public append(nodes: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public prepend(element: org.nativescript.mason.masonkit.Element): void;
					public prepend(node: org.nativescript.mason.masonkit.Node): void;
					public prepend(elements: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public prepend(nodes: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public invalidateLayout(): void;
					public invalidateLayout(invalidateRoot: boolean): void;
					public recomputeRoot(): void;
					public appendView(view: globalAndroid.view.View): void;
					public appendView(views: androidNative.Array<globalAndroid.view.View>): void;
					public prependView(view: globalAndroid.view.View): void;
					public prependView(views: androidNative.Array<globalAndroid.view.View>): void;
					public addChildAt(element: org.nativescript.mason.masonkit.Element, index: number): void;
					public addChildAt(node: org.nativescript.mason.masonkit.Node, index: number): void;
					public replaceChildAt(element: org.nativescript.mason.masonkit.Element, index: number): void;
					public replaceChildAt(node: org.nativescript.mason.masonkit.Node, index: number): void;
					public removeChildAt(index: number): void;
					public removeChild(node: org.nativescript.mason.masonkit.Node): void;
					public removeEventListener(type: string, id: java.util.UUID): void;
					public dispatch(event: org.nativescript.mason.masonkit.events.Event): void;
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null, defStyleAttr: number);
					public addEventListener(param0: string, param1: any): java.util.UUID;
					public syncStyleParts(param0: number, param1: number, param2: number, param3: number): void;
					public syncStyle(param0: number, param1: number): void;
					public configure(param0: any): org.nativescript.mason.masonkit.Element;
					public elementFromPoint(param0: number, param1: number): globalAndroid.view.View | null;
					public compute(param0: number, param1: number): void;
					public computeNestedRootLater(param0: number, param1: number): void;
					public computeOrDeferNested(param0: number, param1: number): boolean;
					public computeAndLayout(param0: number, param1: number): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeWithSize(param0: number, param1: number): void;
					public computeWithViewSize(param0: boolean): void;
					public append(param0: org.nativescript.mason.masonkit.Element): void;
					public append(param0: org.nativescript.mason.masonkit.Node): void;
					public append(param0: java.util.List<any>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public prepend(param0: org.nativescript.mason.masonkit.Element): void;
					public prepend(param0: org.nativescript.mason.masonkit.Node): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public invalidateLayout(param0: boolean): void;
					public appendView(param0: globalAndroid.view.View): void;
					public appendView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public prependView(param0: globalAndroid.view.View): void;
					public prependView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public removeChildAt(param0: number): void;
					public removeChild(param0: org.nativescript.mason.masonkit.Node): void;
					public onChange(param0: number, param1: number): void;
					public removeEventListener(param0: string, param1: java.util.UUID): void;
					public dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Shadow {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Shadow>;
					public constructor();
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Shadow {
					export class BoxShadow {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Shadow.BoxShadow>;
						public constructor(offsetX: number, offsetY: number, blurRadius: number, spreadRadius: number, color: number, inset: boolean);
						public getOffsetX(): number;
						public getOffsetY(): number;
						public getBlurRadius(): number;
						public getSpreadRadius(): number;
						public getColor(): number;
						public getInset(): boolean;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public component5(): number;
						public component6(): boolean;
						public copy(offsetX: number, offsetY: number, blurRadius: number, spreadRadius: number, color: number, inset: boolean): org.nativescript.mason.masonkit.Shadow.BoxShadow;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Shadow {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Shadow.Companion>;
						public parseTextShadow(parsedColor: org.nativescript.mason.masonkit.Style, token: string): java.util.List<org.nativescript.mason.masonkit.Shadow.TextShadow>;
						public parseBoxShadow(parsedColor: org.nativescript.mason.masonkit.Style, token: string): java.util.List<org.nativescript.mason.masonkit.Shadow.BoxShadow>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Shadow {
					export class TextShadow {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Shadow.TextShadow>;
						public constructor(offsetX: number, offsetY: number, blurRadius: number, color: number);
						public getOffsetX(): number;
						public getOffsetY(): number;
						public getBlurRadius(): number;
						public getColor(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public copy(offsetX: number, offsetY: number, blurRadius: number, color: number): org.nativescript.mason.masonkit.Shadow.TextShadow;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapePosition {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapePosition.Companion>;
						public getCENTER(): org.nativescript.mason.masonkit.ShapePosition;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapeRadius {
					export class ClosestCorner extends org.nativescript.mason.masonkit.ShapeRadius {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapeRadius.ClosestCorner>;
						public static INSTANCE: org.nativescript.mason.masonkit.ShapeRadius.ClosestCorner;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapeRadius {
					export class ClosestSide extends org.nativescript.mason.masonkit.ShapeRadius {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapeRadius.ClosestSide>;
						public static INSTANCE: org.nativescript.mason.masonkit.ShapeRadius.ClosestSide;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapeRadius {
					export class FarthestCorner extends org.nativescript.mason.masonkit.ShapeRadius {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapeRadius.FarthestCorner>;
						public static INSTANCE: org.nativescript.mason.masonkit.ShapeRadius.FarthestCorner;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapeRadius {
					export class FarthestSide extends org.nativescript.mason.masonkit.ShapeRadius {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapeRadius.FarthestSide>;
						public static INSTANCE: org.nativescript.mason.masonkit.ShapeRadius.FarthestSide;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ShapeRadius {
					export class Length extends org.nativescript.mason.masonkit.ShapeRadius {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ShapeRadius.Length>;
						public constructor(length: org.nativescript.mason.masonkit.CssLength);
						public getLength(): org.nativescript.mason.masonkit.CssLength;
						public component1(): org.nativescript.mason.masonkit.CssLength;
						public copy(length: org.nativescript.mason.masonkit.CssLength): org.nativescript.mason.masonkit.ShapeRadius.Length;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SharedBoxShadowCache {
					export class Key {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SharedBoxShadowCache.Key>;
						public constructor(widthBits: number, heightBits: number, radiiBits: java.util.List<java.lang.Integer>, blurBits: number, spreadBits: number, color: number, offsetXBits: number, offsetYBits: number, densityDpi: number, rasterScaleBits: number);
						public getWidthBits(): number;
						public getHeightBits(): number;
						public getRadiiBits(): java.util.List<java.lang.Integer>;
						public getBlurBits(): number;
						public getSpreadBits(): number;
						public getColor(): number;
						public getOffsetXBits(): number;
						public getOffsetYBits(): number;
						public getDensityDpi(): number;
						public getRasterScaleBits(): number;
						public component1(): number;
						public component2(): number;
						public component3(): java.util.List<java.lang.Integer>;
						public component4(): number;
						public component5(): number;
						public component6(): number;
						public component7(): number;
						public component8(): number;
						public component9(): number;
						public component10(): number;
						public copy(widthBits: number, heightBits: number, radiiBits: java.util.List<java.lang.Integer>, blurBits: number, spreadBits: number, color: number, offsetXBits: number, offsetYBits: number, densityDpi: number, rasterScaleBits: number): org.nativescript.mason.masonkit.SharedBoxShadowCache.Key;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Size<T>  extends java.lang.Object {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Size<any>>;
					public constructor(width: T, height: T);
					public getWidth(): T;
					public setWidth(param0: T): void;
					public getHeight(): T;
					public setHeight(param0: T): void;
					public component1(): T;
					public component2(): T;
					public copy(width: T, height: T): org.nativescript.mason.masonkit.Size<T>;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Size {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Size.Companion>;
						public uniform(value: any): org.nativescript.mason.masonkit.Size<any>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Span {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Span>;
					public start: number;
					public end: number;
					public tile: number;
					public origin: number;
					public repeat: boolean;
					public constructor(start: number, end: number, tile: number, origin: number, repeat: boolean);
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class StateKeys {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.StateKeys>;
					public constructor(low: number, high: number);
					public getLow(): number;
					public getHigh(): number;
					public getBits(): number;
					public or(other: org.nativescript.mason.masonkit.StateKeys): org.nativescript.mason.masonkit.StateKeys;
					public and(other: org.nativescript.mason.masonkit.StateKeys): org.nativescript.mason.masonkit.StateKeys;
					public hasFlag(flag: org.nativescript.mason.masonkit.StateKeys): boolean;
					public equals(other: any): boolean;
					public hashCode(): number;
					public static flag(n: number): org.nativescript.mason.masonkit.StateKeys;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module StateKeys {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.StateKeys.Companion>;
						public flag(n: number): org.nativescript.mason.masonkit.StateKeys;
						public getNONE(): org.nativescript.mason.masonkit.StateKeys;
						public getINVALIDATE_TEXT(): org.nativescript.mason.masonkit.StateKeys;
						public getDISPLAY(): org.nativescript.mason.masonkit.StateKeys;
						public getPOSITION(): org.nativescript.mason.masonkit.StateKeys;
						public getDIRECTION(): org.nativescript.mason.masonkit.StateKeys;
						public getFLEX_DIRECTION(): org.nativescript.mason.masonkit.StateKeys;
						public getFLEX_WRAP(): org.nativescript.mason.masonkit.StateKeys;
						public getOVERFLOW_X(): org.nativescript.mason.masonkit.StateKeys;
						public getOVERFLOW_Y(): org.nativescript.mason.masonkit.StateKeys;
						public getALIGN_ITEMS(): org.nativescript.mason.masonkit.StateKeys;
						public getALIGN_SELF(): org.nativescript.mason.masonkit.StateKeys;
						public getALIGN_CONTENT(): org.nativescript.mason.masonkit.StateKeys;
						public getJUSTIFY_ITEMS(): org.nativescript.mason.masonkit.StateKeys;
						public getJUSTIFY_SELF(): org.nativescript.mason.masonkit.StateKeys;
						public getJUSTIFY_CONTENT(): org.nativescript.mason.masonkit.StateKeys;
						public getINSET(): org.nativescript.mason.masonkit.StateKeys;
						public getMARGIN(): org.nativescript.mason.masonkit.StateKeys;
						public getPADDING(): org.nativescript.mason.masonkit.StateKeys;
						public getBORDER(): org.nativescript.mason.masonkit.StateKeys;
						public getFLEX_GROW(): org.nativescript.mason.masonkit.StateKeys;
						public getFLEX_SHRINK(): org.nativescript.mason.masonkit.StateKeys;
						public getFLEX_BASIS(): org.nativescript.mason.masonkit.StateKeys;
						public getSIZE(): org.nativescript.mason.masonkit.StateKeys;
						public getMIN_SIZE(): org.nativescript.mason.masonkit.StateKeys;
						public getMAX_SIZE(): org.nativescript.mason.masonkit.StateKeys;
						public getGAP(): org.nativescript.mason.masonkit.StateKeys;
						public getASPECT_RATIO(): org.nativescript.mason.masonkit.StateKeys;
						public getGRID_AUTO_FLOW(): org.nativescript.mason.masonkit.StateKeys;
						public getGRID_COLUMN(): org.nativescript.mason.masonkit.StateKeys;
						public getGRID_ROW(): org.nativescript.mason.masonkit.StateKeys;
						public getSCROLLBAR_WIDTH(): org.nativescript.mason.masonkit.StateKeys;
						public getALIGN(): org.nativescript.mason.masonkit.StateKeys;
						public getBOX_SIZING(): org.nativescript.mason.masonkit.StateKeys;
						public getOVERFLOW(): org.nativescript.mason.masonkit.StateKeys;
						public getITEM_IS_TABLE(): org.nativescript.mason.masonkit.StateKeys;
						public getITEM_IS_REPLACED(): org.nativescript.mason.masonkit.StateKeys;
						public getDISPLAY_MODE(): org.nativescript.mason.masonkit.StateKeys;
						public getFORCE_INLINE(): org.nativescript.mason.masonkit.StateKeys;
						public getMIN_CONTENT_WIDTH(): org.nativescript.mason.masonkit.StateKeys;
						public getMIN_CONTENT_HEIGHT(): org.nativescript.mason.masonkit.StateKeys;
						public getMAX_CONTENT_WIDTH(): org.nativescript.mason.masonkit.StateKeys;
						public getMAX_CONTENT_HEIGHT(): org.nativescript.mason.masonkit.StateKeys;
						public getBORDER_STYLE(): org.nativescript.mason.masonkit.StateKeys;
						public getBORDER_RADIUS(): org.nativescript.mason.masonkit.StateKeys;
						public getBORDER_COLOR(): org.nativescript.mason.masonkit.StateKeys;
						public getFLOAT(): org.nativescript.mason.masonkit.StateKeys;
						public getCLEAR(): org.nativescript.mason.masonkit.StateKeys;
						public getOBJECT_FIT(): org.nativescript.mason.masonkit.StateKeys;
						public getZ_INDEX(): org.nativescript.mason.masonkit.StateKeys;
						public getLIST_STYLE_POSITION(): org.nativescript.mason.masonkit.StateKeys;
						public getLIST_STYLE_TYPE(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_COLOR(): org.nativescript.mason.masonkit.StateKeys;
						public getDECORATION_LINE(): org.nativescript.mason.masonkit.StateKeys;
						public getDECORATION_COLOR(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_ALIGN(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_JUSTIFY(): org.nativescript.mason.masonkit.StateKeys;
						public getBACKGROUND_COLOR(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_SIZE(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_TRANSFORM(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_STYLE(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_STYLE_SLANT(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_WRAP(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_OVERFLOW(): org.nativescript.mason.masonkit.StateKeys;
						public getDECORATION_STYLE(): org.nativescript.mason.masonkit.StateKeys;
						public getWHITE_SPACE(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_WEIGHT(): org.nativescript.mason.masonkit.StateKeys;
						public getLINE_HEIGHT(): org.nativescript.mason.masonkit.StateKeys;
						public getVERTICAL_ALIGN(): org.nativescript.mason.masonkit.StateKeys;
						public getDECORATION_THICKNESS(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_SHADOWS(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_FAMILY(): org.nativescript.mason.masonkit.StateKeys;
						public getLETTER_SPACING(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_VARIANT_NUMERIC(): org.nativescript.mason.masonkit.StateKeys;
						public getOBJECT_POSITION(): org.nativescript.mason.masonkit.StateKeys;
						public getWRITING_MODE(): org.nativescript.mason.masonkit.StateKeys;
						public getUNICODE_BIDI(): org.nativescript.mason.masonkit.StateKeys;
						public getHYPHENS(): org.nativescript.mason.masonkit.StateKeys;
						public getCARET_COLOR(): org.nativescript.mason.masonkit.StateKeys;
						public getWORD_SPACING(): org.nativescript.mason.masonkit.StateKeys;
						public getFONT_STRETCH(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_INDENT(): org.nativescript.mason.masonkit.StateKeys;
						public getLINE_CLAMP(): org.nativescript.mason.masonkit.StateKeys;
						public getTRANSFORM_ORIGIN(): org.nativescript.mason.masonkit.StateKeys;
						public getALL_TEXT(): org.nativescript.mason.masonkit.StateKeys;
						public getTEXT_LAYOUT(): org.nativescript.mason.masonkit.StateKeys;
						public getLAYOUT_MASK(): org.nativescript.mason.masonkit.StateKeys;
						public hasFlag(low: number, high: number, flag: org.nativescript.mason.masonkit.StateKeys): boolean;
						public hasFlag(low: number, high: number, otherLow: number, otherHigh: number): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Style {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Style>;
					public inMeasure: boolean;
					public constructor(node: org.nativescript.mason.masonkit.Node);
					public getFont(): org.nativescript.fontmanager.FontFace;
					public setFont(this_: org.nativescript.fontmanager.FontFace): void;
					public prepareMut(): void;
					public getWritableValue(): java.nio.ByteBuffer;
					public getValues(): java.nio.ByteBuffer;
					public getInBatch(): boolean;
					public setInBatch(this_: boolean): void;
					public configure(block: any): void;
					public getZIndex(): number;
					public setZIndex(value: number): void;
					public getObjectFit(): org.nativescript.mason.masonkit.enums.ObjectFit;
					public setObjectFit(value: org.nativescript.mason.masonkit.enums.ObjectFit): void;
					public getFloat(): org.nativescript.mason.masonkit.enums.Float;
					public setFloat(value: org.nativescript.mason.masonkit.enums.Float): void;
					public getClear(): org.nativescript.mason.masonkit.enums.Clear;
					public setClear(value: org.nativescript.mason.masonkit.enums.Clear): void;
					public getFilter(): string;
					public setFilter(this_: string): void;
					public getTransform(): string;
					public setTransform(this_: string): void;
					public getBackground(): string;
					public setBackground(old: string): void;
					public getBackgroundImage(): string;
					public setBackgroundImage(this_: string): void;
					public getBackgroundRepeat(): string;
					public setBackgroundRepeat(value: string): void;
					public getBackgroundPosition(): string;
					public setBackgroundPosition(value: string): void;
					public getBackgroundPositionX(): string;
					public setBackgroundPositionX(value: string): void;
					public getBackgroundPositionY(): string;
					public setBackgroundPositionY(value: string): void;
					public getBackgroundSize(): string;
					public setBackgroundSize(value: string): void;
					public getBackgroundClip(): string;
					public setBackgroundClip(value: string): void;
					public getBackgroundOrigin(): string;
					public setBackgroundOrigin(value: string): void;
					public getBackgroundAttachment(): string;
					public setBackgroundAttachment(value: string): void;
					public getBackgroundBlendMode(): string;
					public setBackgroundBlendMode(value: string): void;
					public setBackgroundColor(it: string): void;
					public getTextJustify(): org.nativescript.mason.masonkit.Styles.TextJustify;
					public setTextJustify(this_$iv: org.nativescript.mason.masonkit.Styles.TextJustify): void;
					public getColor(): number;
					public setColor(this_$iv: number): void;
					public setColor(it: string): void;
					public getFontFamily(): string;
					public setFontFamily($this$_set_fontFamily__u24lambda_u2422: string): void;
					public getFontVariant(): string;
					public setFontVariant(this_$iv: string): void;
					public getFontStretch(): string;
					public setFontStretch(this_$iv: string): void;
					public getFontFeatureSettings(): string;
					public setFontFeatureSettings(this_$iv: string): void;
					public getFontKerning(): string;
					public setFontKerning(this_$iv: string): void;
					public getFontVariantLigatures(): string;
					public setFontVariantLigatures(this_$iv: string): void;
					public getFontSize(): number;
					public setFontSize(this_$iv: number): void;
					public getFontWeight(): org.nativescript.fontmanager.FontWeight;
					public setFontWeight(this_$iv: org.nativescript.fontmanager.FontWeight): void;
					public getFontStyle(): org.nativescript.fontmanager.FontStyle;
					public setFontStyle(this_$iv: org.nativescript.fontmanager.FontStyle): void;
					public getLetterSpacing(): number;
					public setLetterSpacing(this_$iv: number): void;
					public getFontVariantNumeric(): number;
					public setFontVariantNumeric(this_$iv: number): void;
					public getFontVariantNumericString(): string;
					public setFontVariantNumericString(value: string): void;
					public getTextWrap(): org.nativescript.mason.masonkit.Styles.TextWrap;
					public setTextWrap(this_$iv: org.nativescript.mason.masonkit.Styles.TextWrap): void;
					public getWhiteSpace(): org.nativescript.mason.masonkit.Styles.WhiteSpace;
					public setWhiteSpace(this_$iv: org.nativescript.mason.masonkit.Styles.WhiteSpace): void;
					public getTextTransform(): org.nativescript.mason.masonkit.Styles.TextTransform;
					public setTextTransform(this_$iv: org.nativescript.mason.masonkit.Styles.TextTransform): void;
					public getVerticalAlign(): org.nativescript.mason.masonkit.enums.VerticalAlign;
					public setVerticalAlign(this_$iv: org.nativescript.mason.masonkit.enums.VerticalAlign): void;
					public getBackgroundColor(): number;
					public setBackgroundColor(this_$iv: number): void;
					public getDecorationLine(): org.nativescript.mason.masonkit.Styles.DecorationLine;
					public setDecorationLine(this_$iv: org.nativescript.mason.masonkit.Styles.DecorationLine): void;
					public getTextDecorationLine(): string;
					public setTextDecorationLine(it: string): void;
					public getTextDecorationStyle(): string;
					public setTextDecorationStyle(it: string): void;
					public getTextDecorationColor(): string;
					public setTextDecorationColor(it: string): void;
					public setTextDecoration(parsedColor: string): void;
					public getDecorationColor(): number;
					public setDecorationColor(this_$iv: number): void;
					public getDecorationStyle(): org.nativescript.mason.masonkit.Styles.DecorationStyle;
					public setDecorationStyle(this_$iv: org.nativescript.mason.masonkit.Styles.DecorationStyle): void;
					public getDecorationThickness(): number;
					public setDecorationThickness(this_$iv: number): void;
					public getLineHeight(): number;
					public setLineHeight(this_$iv: number): void;
					public setLineHeight(this_$iv: number, state$iv: boolean): void;
					public setTextIndent(value: number, isPercent: boolean): void;
					public getTextIndent(): string;
					public setTextIndent(it: string): void;
					public getLineClamp(): number;
					public setLineClamp(value: number): void;
					public setTransformOrigin(this_: number, x: boolean, xIsPercent: number, y: boolean): void;
					public getTransformOrigin(): string;
					public setTransformOrigin(it: string): void;
					public getTextOverflow(): org.nativescript.mason.masonkit.Styles.TextOverflow;
					public setTextOverflow(this_$iv: org.nativescript.mason.masonkit.Styles.TextOverflow): void;
					public getDisplay(): org.nativescript.mason.masonkit.enums.Display;
					public setDisplay(display: org.nativescript.mason.masonkit.enums.Display): void;
					public getPosition(): org.nativescript.mason.masonkit.enums.Position;
					public setPosition(value: org.nativescript.mason.masonkit.enums.Position): void;
					public getDirection(): org.nativescript.mason.masonkit.enums.Direction;
					public setDirection(value: org.nativescript.mason.masonkit.enums.Direction): void;
					public getFlexDirection(): org.nativescript.mason.masonkit.enums.FlexDirection;
					public setFlexDirection(value: org.nativescript.mason.masonkit.enums.FlexDirection): void;
					public getFlexWrap(): org.nativescript.mason.masonkit.enums.FlexWrap;
					public setFlexWrap(value: org.nativescript.mason.masonkit.enums.FlexWrap): void;
					public getOverflow(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>;
					public setOverflow(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>): void;
					public getOverflowX(): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowX(value: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getOverflowY(): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowY(value: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getAlignItems(): org.nativescript.mason.masonkit.enums.AlignItems;
					public setAlignItems(value: org.nativescript.mason.masonkit.enums.AlignItems): void;
					public getAlignSelf(): org.nativescript.mason.masonkit.enums.AlignSelf;
					public setAlignSelf(value: org.nativescript.mason.masonkit.enums.AlignSelf): void;
					public getAlignContent(): org.nativescript.mason.masonkit.enums.AlignContent;
					public setAlignContent(value: org.nativescript.mason.masonkit.enums.AlignContent): void;
					public getJustifyItems(): org.nativescript.mason.masonkit.enums.JustifyItems;
					public setJustifyItems(value: org.nativescript.mason.masonkit.enums.JustifyItems): void;
					public getJustifySelf(): org.nativescript.mason.masonkit.enums.JustifySelf;
					public setJustifySelf(value: org.nativescript.mason.masonkit.enums.JustifySelf): void;
					public getJustifyContent(): org.nativescript.mason.masonkit.enums.JustifyContent;
					public setJustifyContent(value: org.nativescript.mason.masonkit.enums.JustifyContent): void;
					public getAlign(): org.nativescript.mason.masonkit.enums.Align;
					public setAlign(value: org.nativescript.mason.masonkit.enums.Align): void;
					public getTextAlign(): org.nativescript.mason.masonkit.enums.TextAlign;
					public setTextAlign(value: org.nativescript.mason.masonkit.enums.TextAlign): void;
					public getBoxSizing(): org.nativescript.mason.masonkit.enums.BoxSizing;
					public setBoxSizing(value: org.nativescript.mason.masonkit.enums.BoxSizing): void;
					public getInset(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public setInset(value: org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>): void;
					public setInsetLeft(value: number, type: number): void;
					public setInsetRight(value: number, type: number): void;
					public setInsetTop(value: number, type: number): void;
					public setInsetBottom(value: number, type: number): void;
					public setInsetWithValueType(value: number, type: number): void;
					public getMargin(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public setMargin(value: org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>): void;
					public setMargin(left: number, top: number, right: number, bottom: number): void;
					public setMarginLeft(value: number, type: number): void;
					public setMarginRight(value: number, type: number): void;
					public setMarginTop(value: number, type: number): void;
					public setMarginBottom(value: number, type: number): void;
					public setMarginWithValueType(value: number, type: number): void;
					public getMarginTop(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public setMarginTop(value: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public getMarginRight(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public setMarginRight(value: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public getMarginBottom(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public setMarginBottom(value: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public getMarginLeft(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public setMarginLeft(value: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public getPadding(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public setPadding(value: org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public setPadding(left: number, top: number, right: number, bottom: number): void;
					public setPaddingLeft(value: number, type: number): void;
					public setPaddingRight(value: number, type: number): void;
					public setPaddingTop(value: number, type: number): void;
					public setPaddingBottom(value: number, type: number): void;
					public setPaddingWithValueType(value: number, type: number): void;
					public hasOutsetBoxShadow(): boolean;
					public boxShadowsHash(): number;
					public getBoxShadow(): string;
					public setBoxShadow(it: string): void;
					public getTextShadow(): string;
					public setTextShadow(this_$iv: string): void;
					public getBorder(): string;
					public setBorder(value: string): void;
					public getBorderLeft(): string;
					public setBorderLeft(value: string): void;
					public getBorderTop(): string;
					public setBorderTop(value: string): void;
					public getBorderRight(): string;
					public setBorderRight(value: string): void;
					public getBorderBottom(): string;
					public setBorderBottom(value: string): void;
					public getBorderRadius(): string;
					public setBorderRadius(value: string): void;
					public getPaddingCss(): string;
					public setPaddingCss(value: string): void;
					public getMarginCss(): string;
					public setMarginCss(value: string): void;
					public getInsetCss(): string;
					public setInsetCss(value: string): void;
					public getCornerShape(): string;
					public setCornerShape(value: string): void;
					public getCornerShapeTopLeft(): string;
					public setCornerShapeTopLeft(it: string): void;
					public getCornerShapeTopRight(): string;
					public setCornerShapeTopRight(it: string): void;
					public getCornerShapeBottomRight(): string;
					public setCornerShapeBottomRight(it: string): void;
					public getCornerShapeBottomLeft(): string;
					public setCornerShapeBottomLeft(it: string): void;
					public getBorderImage(): string;
					public setBorderImage(it: string): void;
					public getBackdropFilter(): string;
					public setBackdropFilter(value: string): void;
					public getMaskImage(): string;
					public setMaskImage(value: string): void;
					public getMaskSize(): string;
					public setMaskSize(value: string): void;
					public getMaskPosition(): string;
					public setMaskPosition(value: string): void;
					public getMaskRepeat(): string;
					public setMaskRepeat(value: string): void;
					public getMaskOrigin(): string;
					public setMaskOrigin(value: string): void;
					public getMaskClip(): string;
					public setMaskClip(value: string): void;
					public getMaskMode(): string;
					public setMaskMode(value: string): void;
					public getMaskComposite(): string;
					public setMaskComposite(value: string): void;
					public getMaskBorderSource(): string;
					public setMaskBorderSource(value: string): void;
					public getMaskBorderSlice(): string;
					public setMaskBorderSlice(value: string): void;
					public getMaskBorderWidth(): string;
					public setMaskBorderWidth(value: string): void;
					public getMaskBorderOutset(): string;
					public setMaskBorderOutset(value: string): void;
					public getMaskBorderRepeat(): string;
					public setMaskBorderRepeat(value: string): void;
					public getMaskBorderMode(): string;
					public setMaskBorderMode(value: string): void;
					public getClipPath(): string;
					public setClipPath(value: string): void;
					public setBorderStyle($this$setBorderStyle_u24lambda_u2464: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getBorderStyle(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.enums.BorderStyle>;
					public setBorderStyle($this$_set_borderStyle__u24lambda_u2468: org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.enums.BorderStyle>): void;
					public getBorderLeftStyle(): org.nativescript.mason.masonkit.enums.BorderStyle;
					public setBorderLeftStyle(value: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getBorderTopStyle(): org.nativescript.mason.masonkit.enums.BorderStyle;
					public setBorderTopStyle(value: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getBorderRightStyle(): org.nativescript.mason.masonkit.enums.BorderStyle;
					public setBorderRightStyle(value: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getBorderBottomStyle(): org.nativescript.mason.masonkit.enums.BorderStyle;
					public setBorderBottomStyle(value: org.nativescript.mason.masonkit.enums.BorderStyle): void;
					public getBorderTopLeftRadius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setBorderTopLeftRadius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getBorderTopRightRadius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setBorderTopRightRadius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getBorderBottomRightRadius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setBorderBottomRightRadius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getBorderBottomLeftRadius(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>;
					public setBorderBottomLeftRadius(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getBorderColor(): org.nativescript.mason.masonkit.Rect<java.lang.Integer>;
					public setBorderColor($this$_set_borderColor__u24lambda_u2472: org.nativescript.mason.masonkit.Rect<java.lang.Integer>): void;
					public setBorderColor($this$setBorderColor_u24lambda_u2476: number): void;
					public getBorderWidth(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public setBorderWidth($this$_set_borderWidth__u24lambda_u2480: org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public getBorderLeftWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public setBorderLeftWidth(value: org.nativescript.mason.masonkit.LengthPercentage): void;
					public getBorderTopWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public setBorderTopWidth(value: org.nativescript.mason.masonkit.LengthPercentage): void;
					public getBorderRightWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public setBorderRightWidth(value: org.nativescript.mason.masonkit.LengthPercentage): void;
					public getBorderBottomWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public setBorderBottomWidth(value: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setBorderLeftWidth(value: number, type: number): void;
					public setBorderRightWidth(value: number, type: number): void;
					public setBorderTopWidth(value: number, type: number): void;
					public setBorderBottomWidth(value: number, type: number): void;
					public setBorderWidth($this$setBorderWidth_u24lambda_u2484: number, param1: number): void;
					public getFlexGrow(): number;
					public setFlexGrow(value: number): void;
					public getFlexShrink(): number;
					public setFlexShrink(value: number): void;
					public getFlexBasis(): org.nativescript.mason.masonkit.Dimension;
					public setFlexBasis(value: org.nativescript.mason.masonkit.Dimension): void;
					public getScrollBarWidth(): number;
					public setScrollBarWidth(value: number): void;
					public setFlexBasis(value: number, type: number): void;
					public getMinSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public setMinSize(value: org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>): void;
					public setMinSizeWidth(value: number, type: number): void;
					public setMinSizeHeight(value: number, type: number): void;
					public setMinSizeWidth(value: org.nativescript.mason.masonkit.Dimension): void;
					public setMinSizeHeight(value: org.nativescript.mason.masonkit.Dimension): void;
					public getMinWidth(): org.nativescript.mason.masonkit.Dimension;
					public setMinWidth(value: org.nativescript.mason.masonkit.Dimension): void;
					public getMinHeight(): org.nativescript.mason.masonkit.Dimension;
					public setMinHeight(value: org.nativescript.mason.masonkit.Dimension): void;
					public getSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public setSize(value: org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>): void;
					public setSizePoints(width: number, height: number): void;
					public setSizeWidth(value: number, type: number): void;
					public setSizeWidth(value: org.nativescript.mason.masonkit.Dimension): void;
					public setSizeHeight(value: number, type: number): void;
					public setSizeHeight(value: org.nativescript.mason.masonkit.Dimension): void;
					public getMaxSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public setMaxSize(value: org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>): void;
					public setMaxSizeWidth(value: number, type: number): void;
					public setMaxSizeHeight(value: number, type: number): void;
					public setMaxSizeWidth(value: org.nativescript.mason.masonkit.Dimension): void;
					public setMaxSizeHeight(value: org.nativescript.mason.masonkit.Dimension): void;
					public getMaxWidth(): org.nativescript.mason.masonkit.Dimension;
					public setMaxWidth(value: org.nativescript.mason.masonkit.Dimension): void;
					public getMaxHeight(): org.nativescript.mason.masonkit.Dimension;
					public setMaxHeight(value: org.nativescript.mason.masonkit.Dimension): void;
					public getGap(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.LengthPercentage>;
					public setGap(value: org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.LengthPercentage>): void;
					public setGap(widthValue: number, widthType: number, heightValue: number, heightType: number): void;
					public setGapRow(value: number, type: number): void;
					public setGapColumn(value: number, type: number): void;
					public getAspectRatio(): java.lang.Float | null;
					public setAspectRatio(value: java.lang.Float | null): void;
					public setGridAutoRows(value: androidNative.Array<org.nativescript.mason.masonkit.MinMax>): void;
					public setGridAutoColumns(value: androidNative.Array<org.nativescript.mason.masonkit.MinMax>): void;
					public setGridColumn(value: org.nativescript.mason.masonkit.Line<org.nativescript.mason.masonkit.GridPlacement>): void;
					public setGridColumnStart(value: org.nativescript.mason.masonkit.GridPlacement): void;
					public setGridRow(value: org.nativescript.mason.masonkit.Line<org.nativescript.mason.masonkit.GridPlacement>): void;
					public setGridTemplateRows(value: androidNative.Array<org.nativescript.mason.masonkit.GridTemplate>): void;
					public setGridTemplateColumns(value: androidNative.Array<org.nativescript.mason.masonkit.GridTemplate>): void;
					public getGridArea(): string;
					public setGridArea(value: string): void;
					public getGridTemplateAreas(): string;
					public setGridTemplateAreas(value: string): void;
					public getGridAutoRows(): string;
					public setGridAutoRows(value: string): void;
					public getGridAutoColumns(): string;
					public setGridAutoColumns(value: string): void;
					public getGridAutoFlow(): org.nativescript.mason.masonkit.enums.GridAutoFlow;
					public setGridAutoFlow(value: org.nativescript.mason.masonkit.enums.GridAutoFlow): void;
					public getGridColumn(): string;
					public setGridColumn(value: string): void;
					public getGridColumnStart(): string;
					public setGridColumnStart(value: string): void;
					public getGridColumnEnd(): string;
					public setGridColumnEnd(value: string): void;
					public getGridRow(): string;
					public setGridRow(value: string): void;
					public getGridRowStart(): string;
					public setGridRowStart(value: string): void;
					public getGridRowEnd(): string;
					public setGridRowEnd(value: string): void;
					public getGridTemplateRows(): string;
					public setGridTemplateRows(value: string): void;
					public getGridTemplateColumns(): string;
					public setGridTemplateColumns(value: string): void;
					public getNativeMargins(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getNativeSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getListStylePosition(): org.nativescript.mason.masonkit.enums.ListStylePosition;
					public setListStylePosition(value: org.nativescript.mason.masonkit.enums.ListStylePosition): void;
					public getListStyleType(): org.nativescript.mason.masonkit.enums.ListStyleType;
					public setListStyleType(value: org.nativescript.mason.masonkit.enums.ListStyleType): void;
					public toString(): string;
					public getResolvedBackgroundColor(): number;
					public resetFontFamilyToInherit(): void;
					public resetFontWeightToInherit(): void;
					public resetFontStyleToInherit(): void;
					public static nativeGetStyleBuffer(param0: number, param1: number): number;
					public static nativePrepareMut(param0: number, param1: number): number;
					public static nativeNonBufferData(param0: number, param1: number, param2: number, param3: string | null, param4: string | null, param5: string | null, param6: string | null, param7: string | null, param8: string | null, param9: string | null, param10: string | null, param11: string | null, param12: string | null, param13: string | null, param14: string | null): void;
					public static nativeGetGridArea(param0: number, param1: number): string | null;
					public static nativeGetGridTemplateAreas(param0: number, param1: number): string | null;
					public static nativeGetGridAutoRows(param0: number, param1: number): string | null;
					public static nativeGetGridAutoColumns(param0: number, param1: number): string | null;
					public static nativeGetGridColumn(param0: number, param1: number): string | null;
					public static nativeGetGridColumnStart(param0: number, param1: number): string | null;
					public static nativeGetGridColumnEnd(param0: number, param1: number): string | null;
					public static nativeGetGridRow(param0: number, param1: number): string | null;
					public static nativeGetGridRowStart(param0: number, param1: number): string | null;
					public static nativeGetGridRowEnd(param0: number, param1: number): string | null;
					public static nativeGetGridTemplateRows(param0: number, param1: number): string | null;
					public static nativeGetGridTemplateColumns(param0: number, param1: number): string | null;
					public static nativeUpdateWithValues(param0: number, param1: number, param2: number, param3: number, param4: number, param5: number, param6: number, param7: number, param8: number, param9: number, param10: number, param11: number, param12: number, param13: number, param14: number, param15: number, param16: number, param17: number, param18: number, param19: number, param20: number, param21: number, param22: number, param23: number, param24: number, param25: number, param26: number, param27: number, param28: number, param29: number, param30: number, param31: number, param32: number, param33: number, param34: number, param35: number, param36: number, param37: number, param38: number, param39: number, param40: number, param41: number, param42: number, param43: number, param44: number, param45: number, param46: number, param47: number, param48: number, param49: number, param50: number, param51: number, param52: number, param53: number, param54: number, param55: number, param56: number, param57: number, param58: number, param59: number, param60: number, param61: number, param62: number, param63: number, param64: number, param65: number, param66: number, param67: string | null, param68: string | null, param69: number, param70: string | null, param71: string | null, param72: string | null, param73: string | null, param74: string | null, param75: string | null, param76: string | null, param77: string | null, param78: number, param79: number, param80: number, param81: number, param82: number, param83: string | null, param84: string | null): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.Companion>;
						public nativeGetStyleBuffer(mason: number, node: number): number;
						public nativePrepareMut(mason: number, node: number): number;
						public nativeNonBufferData(mason: number, node: number, flags: number, gridAutoRows: string | null, gridAutoColumns: string | null, gridColumn: string | null, gridColumnStart: string | null, gridColumnEnd: string | null, gridRow: string | null, gridRowStart: string | null, gridRowEnd: string | null, gridTemplateRows: string | null, gridTemplateColumns: string | null, gridArea: string | null, gridTemplateAreas: string | null): void;
						public nativeGetGridArea(mason: number, node: number): string | null;
						public nativeGetGridTemplateAreas(mason: number, node: number): string | null;
						public nativeGetGridAutoRows(mason: number, node: number): string | null;
						public nativeGetGridAutoColumns(mason: number, node: number): string | null;
						public nativeGetGridColumn(mason: number, node: number): string | null;
						public nativeGetGridColumnStart(mason: number, node: number): string | null;
						public nativeGetGridColumnEnd(mason: number, node: number): string | null;
						public nativeGetGridRow(mason: number, node: number): string | null;
						public nativeGetGridRowStart(mason: number, node: number): string | null;
						public nativeGetGridRowEnd(mason: number, node: number): string | null;
						public nativeGetGridTemplateRows(mason: number, node: number): string | null;
						public nativeGetGridTemplateColumns(mason: number, node: number): string | null;
						public nativeUpdateWithValues(mason: number, node: number, display: number, position: number, direction: number, flexDirection: number, flexWrap: number, overflow: number, alignItems: number, alignSelf: number, alignContent: number, justifyItems: number, justifySelf: number, justifyContent: number, insetLeftType: number, insetLeftValue: number, insetRightType: number, insetRightValue: number, insetTopType: number, insetTopValue: number, insetBottomType: number, insetBottomValue: number, marginLeftType: number, marginLeftValue: number, marginRightType: number, marginRightValue: number, marginTopType: number, marginTopValue: number, marginBottomType: number, marginBottomValue: number, paddingLeftType: number, paddingLeftValue: number, paddingRightType: number, paddingRightValue: number, paddingTopType: number, paddingTopValue: number, paddingBottomType: number, paddingBottomValue: number, borderLeftType: number, borderLeftValue: number, borderRightType: number, borderRightValue: number, borderTopType: number, borderTopValue: number, borderBottomType: number, borderBottomValue: number, flexGrow: number, flexShrink: number, flexBasisType: number, flexBasisValue: number, widthType: number, widthValue: number, heightType: number, heightValue: number, minWidthType: number, minWidthValue: number, minHeightType: number, minHeightValue: number, maxWidthType: number, maxWidthValue: number, maxHeightType: number, maxHeightValue: number, gapRowType: number, gapRowValue: number, gapColumnType: number, gapColumnValue: number, aspectRatio: number, gridAutoRows: string | null, gridAutoColumns: string | null, gridAutoFlow: number, gridColumn: string | null, gridColumnStart: string | null, gridColumnEnd: string | null, gridRow: string | null, gridRowStart: string | null, gridRowEnd: string | null, gridTemplateRows: string | null, gridTemplateColumns: string | null, overflowX: number, overflowY: number, scrollbarWidth: number, textAlign: number, boxSizing: number, gridArea: string | null, gridTemplateAreas: string | null): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export module Companion {
						export class FontMetricsKey {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.Companion.FontMetricsKey>;
							public constructor(typeface: globalAndroid.graphics.Typeface | null, textSize: number, variation: string | null);
							public getTypeface(): globalAndroid.graphics.Typeface | null;
							public getTextSize(): number;
							public getVariation(): string | null;
							public component1(): globalAndroid.graphics.Typeface | null;
							public component2(): number;
							public component3(): string | null;
							public copy(typeface: globalAndroid.graphics.Typeface | null, textSize: number, variation: string | null): org.nativescript.mason.masonkit.Style.Companion.FontMetricsKey;
							public toString(): string;
							public hashCode(): number;
							public equals(other: any): boolean;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export module Companion {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.Companion.WhenMappings>;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export class FontMetrics {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.FontMetrics>;
						public constructor(ascent: number, descent: number, xHeight: number, leading: number, capHeight: number);
						public getAscent(): number;
						public getDescent(): number;
						public getXHeight(): number;
						public getLeading(): number;
						public getCapHeight(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public component5(): number;
						public copy(ascent: number, descent: number, xHeight: number, leading: number, capHeight: number): org.nativescript.mason.masonkit.Style.FontMetrics;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
						public static from(style: org.nativescript.mason.masonkit.Style): org.nativescript.mason.masonkit.Style.FontMetrics;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export module FontMetrics {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.FontMetrics.Companion>;
							public from(style: org.nativescript.mason.masonkit.Style): org.nativescript.mason.masonkit.Style.FontMetrics;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Style {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Style.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class StyleChangeListener {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.StyleChangeListener>;
					/**
					 * Constructs a new instance of the org.nativescript.mason.masonkit.StyleChangeListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onChange(param0: number, param1: number): void;
					});
					public constructor();
					public onChange(param0: number, param1: number): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class StyleHelpers {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.StyleHelpers>;
					public constructor();
					public static gridTemplateColumnsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
					public static gridTemplateRowsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
					public static gridAutoColumnsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
					public static gridAutoRowsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module StyleHelpers {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.StyleHelpers.Companion>;
						public gridTemplateColumnsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
						public gridTemplateRowsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
						public gridAutoColumnsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
						public gridAutoRowsCSS(mason: org.nativescript.mason.masonkit.Mason, view: globalAndroid.view.View): string;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class StyleKeys {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.StyleKeys>;
					public static INSTANCE: org.nativescript.mason.masonkit.StyleKeys;
					public static STYLE_BUFFER_SIZE: number = 612;
					public static DISPLAY: number = 0;
					public static POSITION: number = 1;
					public static DIRECTION: number = 2;
					public static FLEX_DIRECTION: number = 3;
					public static FLEX_WRAP: number = 4;
					public static OVERFLOW_X: number = 5;
					public static OVERFLOW_Y: number = 6;
					public static ALIGN_ITEMS: number = 7;
					public static ALIGN_SELF: number = 8;
					public static ALIGN_CONTENT: number = 9;
					public static JUSTIFY_ITEMS: number = 10;
					public static JUSTIFY_SELF: number = 11;
					public static JUSTIFY_CONTENT: number = 12;
					public static INSET_LEFT_TYPE: number = 13;
					public static INSET_RIGHT_TYPE: number = 14;
					public static INSET_TOP_TYPE: number = 15;
					public static INSET_BOTTOM_TYPE: number = 16;
					public static INSET_LEFT_VALUE: number = 17;
					public static INSET_RIGHT_VALUE: number = 21;
					public static INSET_TOP_VALUE: number = 25;
					public static INSET_BOTTOM_VALUE: number = 29;
					public static MARGIN_LEFT_TYPE: number = 33;
					public static MARGIN_RIGHT_TYPE: number = 34;
					public static MARGIN_TOP_TYPE: number = 35;
					public static MARGIN_BOTTOM_TYPE: number = 36;
					public static MARGIN_LEFT_VALUE: number = 37;
					public static MARGIN_RIGHT_VALUE: number = 41;
					public static MARGIN_TOP_VALUE: number = 45;
					public static MARGIN_BOTTOM_VALUE: number = 49;
					public static PADDING_LEFT_TYPE: number = 53;
					public static PADDING_RIGHT_TYPE: number = 54;
					public static PADDING_TOP_TYPE: number = 55;
					public static PADDING_BOTTOM_TYPE: number = 56;
					public static PADDING_LEFT_VALUE: number = 57;
					public static PADDING_RIGHT_VALUE: number = 61;
					public static PADDING_TOP_VALUE: number = 65;
					public static PADDING_BOTTOM_VALUE: number = 69;
					public static BORDER_LEFT_TYPE: number = 73;
					public static BORDER_RIGHT_TYPE: number = 74;
					public static BORDER_TOP_TYPE: number = 75;
					public static BORDER_BOTTOM_TYPE: number = 76;
					public static BORDER_LEFT_VALUE: number = 77;
					public static BORDER_RIGHT_VALUE: number = 81;
					public static BORDER_TOP_VALUE: number = 85;
					public static BORDER_BOTTOM_VALUE: number = 89;
					public static FLEX_GROW: number = 93;
					public static FLEX_SHRINK: number = 97;
					public static FLEX_BASIS_TYPE: number = 101;
					public static FLEX_BASIS_VALUE: number = 102;
					public static WIDTH_TYPE: number = 106;
					public static HEIGHT_TYPE: number = 107;
					public static WIDTH_VALUE: number = 108;
					public static HEIGHT_VALUE: number = 112;
					public static MIN_WIDTH_TYPE: number = 116;
					public static MIN_HEIGHT_TYPE: number = 117;
					public static MIN_WIDTH_VALUE: number = 118;
					public static MIN_HEIGHT_VALUE: number = 122;
					public static MAX_WIDTH_TYPE: number = 126;
					public static MAX_HEIGHT_TYPE: number = 127;
					public static MAX_WIDTH_VALUE: number = 128;
					public static MAX_HEIGHT_VALUE: number = 132;
					public static GAP_ROW_TYPE: number = 136;
					public static GAP_COLUMN_TYPE: number = 137;
					public static GAP_ROW_VALUE: number = 138;
					public static GAP_COLUMN_VALUE: number = 142;
					public static ASPECT_RATIO: number = 146;
					public static GRID_AUTO_FLOW: number = 150;
					public static GRID_COLUMN_START_TYPE: number = 151;
					public static GRID_COLUMN_END_TYPE: number = 152;
					public static GRID_ROW_START_TYPE: number = 153;
					public static GRID_ROW_END_TYPE: number = 154;
					public static GRID_COLUMN_START_VALUE: number = 155;
					public static GRID_COLUMN_END_VALUE: number = 159;
					public static GRID_ROW_START_VALUE: number = 163;
					public static GRID_ROW_END_VALUE: number = 167;
					public static SCROLLBAR_WIDTH: number = 171;
					public static ALIGN: number = 175;
					public static BOX_SIZING: number = 176;
					public static OVERFLOW: number = 177;
					public static ITEM_IS_TABLE: number = 178;
					public static ITEM_IS_REPLACED: number = 179;
					public static DISPLAY_MODE: number = 180;
					public static FORCE_INLINE: number = 181;
					public static MIN_CONTENT_WIDTH: number = 182;
					public static MIN_CONTENT_HEIGHT: number = 186;
					public static MAX_CONTENT_WIDTH: number = 190;
					public static MAX_CONTENT_HEIGHT: number = 194;
					public static BORDER_LEFT_STYLE: number = 198;
					public static BORDER_RIGHT_STYLE: number = 199;
					public static BORDER_TOP_STYLE: number = 200;
					public static BORDER_BOTTOM_STYLE: number = 201;
					public static BORDER_LEFT_COLOR: number = 202;
					public static BORDER_RIGHT_COLOR: number = 206;
					public static BORDER_TOP_COLOR: number = 210;
					public static BORDER_BOTTOM_COLOR: number = 214;
					public static BORDER_RADIUS_TOP_LEFT_X_TYPE: number = 218;
					public static BORDER_RADIUS_TOP_LEFT_Y_TYPE: number = 219;
					public static BORDER_RADIUS_TOP_RIGHT_X_TYPE: number = 220;
					public static BORDER_RADIUS_TOP_RIGHT_Y_TYPE: number = 221;
					public static BORDER_RADIUS_BOTTOM_RIGHT_X_TYPE: number = 222;
					public static BORDER_RADIUS_BOTTOM_RIGHT_Y_TYPE: number = 223;
					public static BORDER_RADIUS_BOTTOM_LEFT_X_TYPE: number = 224;
					public static BORDER_RADIUS_BOTTOM_LEFT_Y_TYPE: number = 225;
					public static BORDER_RADIUS_TOP_LEFT_X_VALUE: number = 226;
					public static BORDER_RADIUS_TOP_LEFT_Y_VALUE: number = 230;
					public static BORDER_RADIUS_TOP_RIGHT_X_VALUE: number = 234;
					public static BORDER_RADIUS_TOP_RIGHT_Y_VALUE: number = 238;
					public static BORDER_RADIUS_BOTTOM_RIGHT_X_VALUE: number = 242;
					public static BORDER_RADIUS_BOTTOM_RIGHT_Y_VALUE: number = 246;
					public static BORDER_RADIUS_BOTTOM_LEFT_X_VALUE: number = 250;
					public static BORDER_RADIUS_BOTTOM_LEFT_Y_VALUE: number = 254;
					public static BORDER_RADIUS_TOP_LEFT_EXPONENT: number = 258;
					public static BORDER_RADIUS_TOP_RIGHT_EXPONENT: number = 262;
					public static BORDER_RADIUS_BOTTOM_RIGHT_EXPONENT: number = 266;
					public static BORDER_RADIUS_BOTTOM_LEFT_EXPONENT: number = 270;
					public static FLOAT: number = 274;
					public static CLEAR: number = 275;
					public static OBJECT_FIT: number = 276;
					public static FONT_METRICS_ASCENT_OFFSET: number = 277;
					public static FONT_METRICS_DESCENT_OFFSET: number = 281;
					public static FONT_METRICS_X_HEIGHT_OFFSET: number = 285;
					public static FONT_METRICS_LEADING_OFFSET: number = 289;
					public static FONT_METRICS_CAP_HEIGHT_OFFSET: number = 293;
					public static VERTICAL_ALIGN_OFFSET_OFFSET: number = 297;
					public static VERTICAL_ALIGN_IS_PERCENT_OFFSET: number = 301;
					public static VERTICAL_ALIGN_ENUM_OFFSET: number = 302;
					public static FIRST_BASELINE_OFFSET: number = 306;
					public static Z_INDEX: number = 310;
					public static ITEM_IS_LIST: number = 314;
					public static ITEM_IS_LIST_ITEM: number = 315;
					public static LIST_STYLE_POSITION: number = 316;
					public static LIST_STYLE_TYPE: number = 317;
					public static LIST_STYLE_POSITION_STATE: number = 318;
					public static LIST_STYLE_TYPE_STATE: number = 319;
					public static REF_COUNT: number = 320;
					public static FONT_COLOR: number = 324;
					public static FONT_COLOR_STATE: number = 328;
					public static FONT_SIZE: number = 329;
					public static FONT_SIZE_TYPE: number = 333;
					public static FONT_SIZE_STATE: number = 334;
					public static FONT_WEIGHT: number = 335;
					public static FONT_WEIGHT_STATE: number = 339;
					public static FONT_STYLE_SLANT: number = 340;
					public static FONT_STYLE_TYPE: number = 344;
					public static FONT_STYLE_STATE: number = 345;
					public static FONT_FAMILY_STATE: number = 346;
					public static FONT_RESOLVED_DIRTY: number = 347;
					public static BACKGROUND_COLOR: number = 348;
					public static BACKGROUND_COLOR_STATE: number = 352;
					public static BACKGROUND_COLOR_TYPE: number = 353;
					public static DECORATION_LINE: number = 354;
					public static DECORATION_LINE_STATE: number = 355;
					public static DECORATION_COLOR: number = 356;
					public static DECORATION_COLOR_STATE: number = 360;
					public static DECORATION_STYLE: number = 361;
					public static DECORATION_STYLE_STATE: number = 362;
					public static LETTER_SPACING: number = 363;
					public static LETTER_SPACING_STATE: number = 367;
					public static TEXT_WRAP: number = 368;
					public static TEXT_WRAP_STATE: number = 369;
					public static WHITE_SPACE: number = 370;
					public static WHITE_SPACE_STATE: number = 371;
					public static TEXT_TRANSFORM: number = 372;
					public static TEXT_TRANSFORM_STATE: number = 373;
					public static TEXT_ALIGN: number = 374;
					public static TEXT_ALIGN_STATE: number = 375;
					public static TEXT_JUSTIFY: number = 376;
					public static TEXT_JUSTIFY_STATE: number = 377;
					public static TEXT_INDENT: number = 378;
					public static TEXT_INDENT_TYPE: number = 382;
					public static TEXT_INDENT_STATE: number = 383;
					public static LINE_HEIGHT: number = 384;
					public static LINE_HEIGHT_STATE: number = 388;
					public static LINE_HEIGHT_TYPE: number = 389;
					public static DECORATION_THICKNESS: number = 390;
					public static DECORATION_THICKNESS_STATE: number = 394;
					public static TEXT_SHADOW_STATE: number = 395;
					public static TEXT_OVERFLOW: number = 396;
					public static TEXT_OVERFLOW_STATE: number = 397;
					public static PSEUDO_SET_MASK_LOW: number = 398;
					public static PSEUDO_SET_MASK_HIGH: number = 406;
					public static FONT_VARIANT_NUMERIC: number = 419;
					public static FONT_VARIANT_NUMERIC_STATE: number = 420;
					public static TRANSFORM_COUNT: number = 422;
					public static TRANSFORM_FLAGS: number = 423;
					public static TRANSFORM_OP_0: number = 424;
					public static TRANSFORM_OP_1: number = 436;
					public static TRANSFORM_OP_2: number = 448;
					public static TRANSFORM_OP_3: number = 460;
					public static TRANSFORM_OP_4: number = 472;
					public static TRANSFORM_OP_5: number = 484;
					public static TRANSFORM_MATRIX: number = 496;
					public static OBJECT_POSITION_X_TYPE: number = 560;
					public static OBJECT_POSITION_Y_TYPE: number = 561;
					public static OBJECT_POSITION_X_VALUE: number = 562;
					public static OBJECT_POSITION_Y_VALUE: number = 566;
					public static OBJECT_POSITION_STATE: number = 570;
					public static WRITING_MODE: number = 571;
					public static WRITING_MODE_STATE: number = 572;
					public static UNICODE_BIDI: number = 573;
					public static UNICODE_BIDI_STATE: number = 574;
					public static HYPHENS: number = 575;
					public static HYPHENS_STATE: number = 576;
					public static CARET_COLOR: number = 577;
					public static CARET_COLOR_STATE: number = 581;
					public static WORD_SPACING: number = 582;
					public static WORD_SPACING_TYPE: number = 586;
					public static WORD_SPACING_STATE: number = 587;
					public static FONT_STRETCH: number = 588;
					public static FONT_STRETCH_STATE: number = 592;
					public static LINE_CLAMP: number = 593;
					public static LINE_CLAMP_STATE: number = 597;
					public static TRANSFORM_ORIGIN_X_TYPE: number = 598;
					public static TRANSFORM_ORIGIN_Y_TYPE: number = 599;
					public static TRANSFORM_ORIGIN_X_VALUE: number = 600;
					public static TRANSFORM_ORIGIN_Y_VALUE: number = 604;
					public static TRANSFORM_ORIGIN_STATE: number = 608;
					public static TRANSFORM_OP_SIZE: number = 12;
					public static MAX_INLINE_TRANSFORM_OPS: number = 6;
					public static TRANSFORM_FLAG_HAS_MATRIX: number = 1;
					public static TRANSFORM_FLAG_IS_3D: number = 2;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module StyleKt {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.StyleKt.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class Styles {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles>;
					public constructor();
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class DecorationLine {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationLine>;
						public static UNDERLINE: number = 1;
						public static OVERLINE: number = 2;
						public static LINE_THROUGH: number = 4;
						public static None: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static Underline: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static Overline: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static UnderlineOverline: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static LineThrough: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static UnderlineLineThrough: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static OverlineLineThrough: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static UnderlineOverlineLineThrough: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static SpellingError: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static GrammarError: org.nativescript.mason.masonkit.Styles.DecorationLine;
						public getValue(): number;
						public getHasUnderline(): boolean;
						public getHasOverline(): boolean;
						public getHasLineThrough(): boolean;
						public isSpellingError(): boolean;
						public isGrammarError(): boolean;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.DecorationLine>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.DecorationLine;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module DecorationLine {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationLine.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.DecorationLine;
							public from(it: number): org.nativescript.mason.masonkit.Styles.DecorationLine;
							public parse(mask: string): org.nativescript.mason.masonkit.Styles.DecorationLine | null;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module DecorationLine {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationLine.WhenMappings>;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class DecorationStyle {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationStyle>;
						public static Solid: org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public static Double: org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public static Dotted: org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public static Dashed: org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public static Wavy: org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.DecorationStyle>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.DecorationStyle;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module DecorationStyle {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationStyle.Companion>;
							public parse(css: string): org.nativescript.mason.masonkit.Styles.DecorationStyle | null;
							public from(value: number): org.nativescript.mason.masonkit.Styles.DecorationStyle;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module DecorationStyle {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.DecorationStyle.WhenMappings>;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class FontStyle {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.FontStyle>;
						public static Normal: org.nativescript.mason.masonkit.Styles.FontStyle;
						public static Italic: org.nativescript.mason.masonkit.Styles.FontStyle;
						public static Oblique: org.nativescript.mason.masonkit.Styles.FontStyle;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.FontStyle>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.FontStyle;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module FontStyle {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.FontStyle.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.FontStyle;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class TextJustify {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextJustify>;
						public static None: org.nativescript.mason.masonkit.Styles.TextJustify;
						public static Auto: org.nativescript.mason.masonkit.Styles.TextJustify;
						public static InterWord: org.nativescript.mason.masonkit.Styles.TextJustify;
						public static InterCharacter: org.nativescript.mason.masonkit.Styles.TextJustify;
						public static Distribute: org.nativescript.mason.masonkit.Styles.TextJustify;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.TextJustify>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.TextJustify;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module TextJustify {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextJustify.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.TextJustify;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module TextJustify {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextJustify.WhenMappings>;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class TextOverflow {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextOverflow>;
						public static Clip: org.nativescript.mason.masonkit.Styles.TextOverflow;
						public static Ellipse: org.nativescript.mason.masonkit.Styles.TextOverflow;
						public static Custom: org.nativescript.mason.masonkit.Styles.TextOverflow;
						public getValue(): number;
						public getToken(): string | null;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.TextOverflow>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.TextOverflow;
						public static getEntries(): any;
						public static ellipse(token: string): org.nativescript.mason.masonkit.Styles.TextOverflow;
						public static custom(token: string): org.nativescript.mason.masonkit.Styles.TextOverflow;
						public static custom(): org.nativescript.mason.masonkit.Styles.TextOverflow;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module TextOverflow {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextOverflow.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.TextOverflow;
							public from($this$from_u24lambda_u240: number, param1: string | null): org.nativescript.mason.masonkit.Styles.TextOverflow;
							public ellipse($this$ellipse_u24lambda_u242: string): org.nativescript.mason.masonkit.Styles.TextOverflow;
							public custom($this$custom_u24lambda_u243: string): org.nativescript.mason.masonkit.Styles.TextOverflow;
							public custom(): org.nativescript.mason.masonkit.Styles.TextOverflow;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class TextTransform {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextTransform>;
						public static None: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static Capitalize: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static Uppercase: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static Lowercase: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static FullWidth: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static FullSizeKana: org.nativescript.mason.masonkit.Styles.TextTransform;
						public static MathAuto: org.nativescript.mason.masonkit.Styles.TextTransform;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.TextTransform>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.TextTransform;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module TextTransform {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextTransform.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.TextTransform;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class TextWrap {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextWrap>;
						public static Wrap: org.nativescript.mason.masonkit.Styles.TextWrap;
						public static NoWrap: org.nativescript.mason.masonkit.Styles.TextWrap;
						public static Balance: org.nativescript.mason.masonkit.Styles.TextWrap;
						public static Pretty: org.nativescript.mason.masonkit.Styles.TextWrap;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.TextWrap>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.TextWrap;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module TextWrap {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.TextWrap.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.TextWrap;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export class WhiteSpace {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.WhiteSpace>;
						public static Normal: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static Pre: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static PreWrap: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static PreLine: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static NoWrap: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static BreakSpaces: org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.Styles.WhiteSpace>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.Styles.WhiteSpace;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module Styles {
					export module WhiteSpace {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.Styles.WhiteSpace.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.Styles.WhiteSpace;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgBuilder {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgBuilder>;
					public constructor(tree: org.nativescript.mason.masonkit.SvgTree, vbW: number, vbH: number);
					public getTree(): org.nativescript.mason.masonkit.SvgTree;
					public getVbW(): number;
					public getVbH(): number;
					public getOps(): java.util.ArrayList<org.nativescript.mason.masonkit.SvgOp>;
					public getUsesCurrentColor(): boolean;
					public setUsesCurrentColor(param0: boolean): void;
					public cascade(it: org.nativescript.mason.masonkit.SvgNode): java.util.Map<string,string>;
					public shapeCommands(rx: org.nativescript.mason.masonkit.SvgNode): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
					public walk(node: org.nativescript.mason.masonkit.SvgNode, parent: org.nativescript.mason.masonkit.SvgStyleState, ctm: androidNative.Array<number>, depth: number): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgClip {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgClip>;
					public constructor(paths: java.util.List<org.nativescript.mason.masonkit.SvgClipPath>);
					public getPaths(): java.util.List<org.nativescript.mason.masonkit.SvgClipPath>;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgClipPath {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgClipPath>;
					public constructor(commands: java.util.List<any>, transform: androidNative.Array<number>, evenOdd: boolean);
					public getCommands(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
					public getTransform(): androidNative.Array<number>;
					public getEvenOdd(): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgDocument {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgDocument>;
					public constructor(width: number, height: number, viewBox: androidNative.Array<number> | null, alignX: java.lang.Integer | null, alignY: java.lang.Integer | null, slice: boolean, ops: java.util.List<any>, usesCurrentColor: boolean);
					public getWidth(): number;
					public getHeight(): number;
					public getViewBox(): androidNative.Array<number> | null;
					public getAlignX(): java.lang.Integer | null;
					public getAlignY(): java.lang.Integer | null;
					public getSlice(): boolean;
					public getOps(): java.util.List<org.nativescript.mason.masonkit.SvgOp>;
					public getUsesCurrentColor(): boolean;
					public getShapes(): java.util.List<org.nativescript.mason.masonkit.SvgShape>;
					public viewportTransform(this_: number, outW: number): androidNative.Array<number>;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgGradient {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgGradient>;
					public constructor(radial: boolean, x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, r: number, fx: number, fy: number, stops: java.util.List<org.nativescript.mason.masonkit.SvgGradientStop>, spread: org.nativescript.mason.masonkit.SvgSpread, transform: androidNative.Array<number>);
					public getRadial(): boolean;
					public getX1(): number;
					public getY1(): number;
					public getX2(): number;
					public getY2(): number;
					public getCx(): number;
					public getCy(): number;
					public getR(): number;
					public getFx(): number;
					public getFy(): number;
					public getStops(): java.util.List<org.nativescript.mason.masonkit.SvgGradientStop>;
					public getSpread(): org.nativescript.mason.masonkit.SvgSpread;
					public getTransform(): androidNative.Array<number>;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgGradientStop {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgGradientStop>;
					public constructor(offset: number, argb: number, currentColor: boolean);
					public getOffset(): number;
					public getArgb(): number;
					public getCurrentColor(): boolean;
					public component1(): number;
					public component2(): number;
					public component3(): boolean;
					public copy(offset: number, argb: number, currentColor: boolean): org.nativescript.mason.masonkit.SvgGradientStop;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgImage {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgImage>;
					public constructor(href: string, x: number, y: number, width: java.lang.Float | null, height: java.lang.Float | null, alignX: java.lang.Integer | null, alignY: java.lang.Integer | null, slice: boolean, transform: androidNative.Array<number>, opacity: number);
					public getHref(): string;
					public getX(): number;
					public getY(): number;
					public getWidth(): java.lang.Float | null;
					public getHeight(): java.lang.Float | null;
					public getAlignX(): java.lang.Integer | null;
					public getAlignY(): java.lang.Integer | null;
					public getSlice(): boolean;
					public getTransform(): androidNative.Array<number>;
					public getOpacity(): number;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgLineCap {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgLineCap>;
					public static BUTT: org.nativescript.mason.masonkit.SvgLineCap;
					public static ROUND: org.nativescript.mason.masonkit.SvgLineCap;
					public static SQUARE: org.nativescript.mason.masonkit.SvgLineCap;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.SvgLineCap>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.SvgLineCap;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgLineJoin {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgLineJoin>;
					public static MITER: org.nativescript.mason.masonkit.SvgLineJoin;
					public static ROUND: org.nativescript.mason.masonkit.SvgLineJoin;
					public static BEVEL: org.nativescript.mason.masonkit.SvgLineJoin;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.SvgLineJoin>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.SvgLineJoin;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgNode {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgNode>;
					public constructor(name: string, attrs: java.util.Map<string,string>, parent: org.nativescript.mason.masonkit.SvgNode | null);
					public getName(): string;
					public getAttrs(): java.util.Map<string,string>;
					public getParent(): org.nativescript.mason.masonkit.SvgNode | null;
					public getChildren(): java.util.ArrayList<org.nativescript.mason.masonkit.SvgNode>;
					public getClasses(): java.util.Set<string>;
					public getProps(): java.util.Map<string,string> | null;
					public setProps(param0: java.util.Map<string,string> | null): void;
					public getHref(): string | null;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class SvgOp {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class BeginClip extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.BeginClip>;
						public constructor(clip: org.nativescript.mason.masonkit.SvgClip);
						public getClip(): org.nativescript.mason.masonkit.SvgClip;
						public component1(): org.nativescript.mason.masonkit.SvgClip;
						public copy(clip: org.nativescript.mason.masonkit.SvgClip): org.nativescript.mason.masonkit.SvgOp.BeginClip;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class BeginGroup extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.BeginGroup>;
						public constructor(opacity: number);
						public getOpacity(): number;
						public component1(): number;
						public copy(opacity: number): org.nativescript.mason.masonkit.SvgOp.BeginGroup;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class EndClip extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.EndClip>;
						public static INSTANCE: org.nativescript.mason.masonkit.SvgOp.EndClip;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class EndGroup extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.EndGroup>;
						public static INSTANCE: org.nativescript.mason.masonkit.SvgOp.EndGroup;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class Image extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.Image>;
						public constructor(image: org.nativescript.mason.masonkit.SvgImage);
						public getImage(): org.nativescript.mason.masonkit.SvgImage;
						public component1(): org.nativescript.mason.masonkit.SvgImage;
						public copy(image: org.nativescript.mason.masonkit.SvgImage): org.nativescript.mason.masonkit.SvgOp.Image;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgOp {
					export class Shape extends org.nativescript.mason.masonkit.SvgOp {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgOp.Shape>;
						public constructor(shape: org.nativescript.mason.masonkit.SvgShape);
						public getShape(): org.nativescript.mason.masonkit.SvgShape;
						public component1(): org.nativescript.mason.masonkit.SvgShape;
						public copy(shape: org.nativescript.mason.masonkit.SvgShape): org.nativescript.mason.masonkit.SvgOp.Shape;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class SvgPaint {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPaint>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPaint {
					export class Color extends org.nativescript.mason.masonkit.SvgPaint {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPaint.Color>;
						public constructor(argb: number);
						public getArgb(): number;
						public component1(): number;
						public copy(argb: number): org.nativescript.mason.masonkit.SvgPaint.Color;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPaint {
					export class CurrentColor extends org.nativescript.mason.masonkit.SvgPaint {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPaint.CurrentColor>;
						public static INSTANCE: org.nativescript.mason.masonkit.SvgPaint.CurrentColor;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPaint {
					export class Gradient extends org.nativescript.mason.masonkit.SvgPaint {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPaint.Gradient>;
						public constructor(gradient: org.nativescript.mason.masonkit.SvgGradient);
						public getGradient(): org.nativescript.mason.masonkit.SvgGradient;
						public component1(): org.nativescript.mason.masonkit.SvgGradient;
						public copy(gradient: org.nativescript.mason.masonkit.SvgGradient): org.nativescript.mason.masonkit.SvgPaint.Gradient;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPaint {
					export class None extends org.nativescript.mason.masonkit.SvgPaint {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPaint.None>;
						public static INSTANCE: org.nativescript.mason.masonkit.SvgPaint.None;
						public toString(): string;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export abstract class SvgPathCommand {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand>;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPathCommand {
					export class Close extends org.nativescript.mason.masonkit.SvgPathCommand {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand.Close>;
						public static INSTANCE: org.nativescript.mason.masonkit.SvgPathCommand.Close;
						public toString(): string;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPathCommand {
					export class CubicTo extends org.nativescript.mason.masonkit.SvgPathCommand {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand.CubicTo>;
						public constructor(x1: number, y1: number, x2: number, y2: number, x: number, y: number);
						public getX1(): number;
						public getY1(): number;
						public getX2(): number;
						public getY2(): number;
						public getX(): number;
						public getY(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public component5(): number;
						public component6(): number;
						public copy(x1: number, y1: number, x2: number, y2: number, x: number, y: number): org.nativescript.mason.masonkit.SvgPathCommand.CubicTo;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPathCommand {
					export class LineTo extends org.nativescript.mason.masonkit.SvgPathCommand {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand.LineTo>;
						public constructor(x: number, y: number);
						public getX(): number;
						public getY(): number;
						public component1(): number;
						public component2(): number;
						public copy(x: number, y: number): org.nativescript.mason.masonkit.SvgPathCommand.LineTo;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPathCommand {
					export class MoveTo extends org.nativescript.mason.masonkit.SvgPathCommand {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand.MoveTo>;
						public constructor(x: number, y: number);
						public getX(): number;
						public getY(): number;
						public component1(): number;
						public component2(): number;
						public copy(x: number, y: number): org.nativescript.mason.masonkit.SvgPathCommand.MoveTo;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module SvgPathCommand {
					export class QuadTo extends org.nativescript.mason.masonkit.SvgPathCommand {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgPathCommand.QuadTo>;
						public constructor(x1: number, y1: number, x: number, y: number);
						public getX1(): number;
						public getY1(): number;
						public getX(): number;
						public getY(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public copy(x1: number, y1: number, x: number, y: number): org.nativescript.mason.masonkit.SvgPathCommand.QuadTo;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgShape {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgShape>;
					public constructor(commands: java.util.List<any>, transform: androidNative.Array<number>, fill: org.nativescript.mason.masonkit.SvgPaint, fillOpacity: number, evenOdd: boolean, stroke: org.nativescript.mason.masonkit.SvgPaint, strokeOpacity: number, strokeWidth: number, lineCap: org.nativescript.mason.masonkit.SvgLineCap, lineJoin: org.nativescript.mason.masonkit.SvgLineJoin, miterLimit: number, dashArray: androidNative.Array<number> | null, dashOffset: number);
					public getCommands(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
					public getTransform(): androidNative.Array<number>;
					public getFill(): org.nativescript.mason.masonkit.SvgPaint;
					public getFillOpacity(): number;
					public getEvenOdd(): boolean;
					public getStroke(): org.nativescript.mason.masonkit.SvgPaint;
					public getStrokeOpacity(): number;
					public getStrokeWidth(): number;
					public getLineCap(): org.nativescript.mason.masonkit.SvgLineCap;
					public getLineJoin(): org.nativescript.mason.masonkit.SvgLineJoin;
					public getMiterLimit(): number;
					public getDashArray(): androidNative.Array<number> | null;
					public getDashOffset(): number;
					public getHasFill(): boolean;
					public getHasStroke(): boolean;
					public equals(other: any): boolean;
					public hashCode(): number;
					public component1(): java.util.List<org.nativescript.mason.masonkit.SvgPathCommand>;
					public component2(): androidNative.Array<number>;
					public component3(): org.nativescript.mason.masonkit.SvgPaint;
					public component4(): number;
					public component5(): boolean;
					public component6(): org.nativescript.mason.masonkit.SvgPaint;
					public component7(): number;
					public component8(): number;
					public component9(): org.nativescript.mason.masonkit.SvgLineCap;
					public component10(): org.nativescript.mason.masonkit.SvgLineJoin;
					public component11(): number;
					public component12(): androidNative.Array<number> | null;
					public component13(): number;
					public copy(commands: java.util.List<any>, transform: androidNative.Array<number>, fill: org.nativescript.mason.masonkit.SvgPaint, fillOpacity: number, evenOdd: boolean, stroke: org.nativescript.mason.masonkit.SvgPaint, strokeOpacity: number, strokeWidth: number, lineCap: org.nativescript.mason.masonkit.SvgLineCap, lineJoin: org.nativescript.mason.masonkit.SvgLineJoin, miterLimit: number, dashArray: androidNative.Array<number> | null, dashOffset: number): org.nativescript.mason.masonkit.SvgShape;
					public toString(): string;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgSpread {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgSpread>;
					public static PAD: org.nativescript.mason.masonkit.SvgSpread;
					public static REFLECT: org.nativescript.mason.masonkit.SvgSpread;
					public static REPEAT: org.nativescript.mason.masonkit.SvgSpread;
					public static values(): androidNative.Array<org.nativescript.mason.masonkit.SvgSpread>;
					public static valueOf(value: string): org.nativescript.mason.masonkit.SvgSpread;
					public static getEntries(): any;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgStyleState {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgStyleState>;
					public constructor(fill: org.nativescript.mason.masonkit.SvgPaint, fillOpacity: number, evenOdd: boolean, stroke: org.nativescript.mason.masonkit.SvgPaint, strokeOpacity: number, strokeWidth: number, lineCap: org.nativescript.mason.masonkit.SvgLineCap, lineJoin: org.nativescript.mason.masonkit.SvgLineJoin, miterLimit: number, dashArray: androidNative.Array<number> | null, dashOffset: number, color: java.lang.Integer | null, visible: boolean, clipEvenOdd: boolean);
					public getFill(): org.nativescript.mason.masonkit.SvgPaint;
					public setFill(param0: org.nativescript.mason.masonkit.SvgPaint): void;
					public getFillOpacity(): number;
					public setFillOpacity(param0: number): void;
					public getEvenOdd(): boolean;
					public setEvenOdd(param0: boolean): void;
					public getStroke(): org.nativescript.mason.masonkit.SvgPaint;
					public setStroke(param0: org.nativescript.mason.masonkit.SvgPaint): void;
					public getStrokeOpacity(): number;
					public setStrokeOpacity(param0: number): void;
					public getStrokeWidth(): number;
					public setStrokeWidth(param0: number): void;
					public getLineCap(): org.nativescript.mason.masonkit.SvgLineCap;
					public setLineCap(param0: org.nativescript.mason.masonkit.SvgLineCap): void;
					public getLineJoin(): org.nativescript.mason.masonkit.SvgLineJoin;
					public setLineJoin(param0: org.nativescript.mason.masonkit.SvgLineJoin): void;
					public getMiterLimit(): number;
					public setMiterLimit(param0: number): void;
					public getDashArray(): androidNative.Array<number> | null;
					public setDashArray(param0: androidNative.Array<number> | null): void;
					public getDashOffset(): number;
					public setDashOffset(param0: number): void;
					public getColor(): java.lang.Integer | null;
					public setColor(param0: java.lang.Integer | null): void;
					public getVisible(): boolean;
					public setVisible(param0: boolean): void;
					public getClipEvenOdd(): boolean;
					public setClipEvenOdd(param0: boolean): void;
					public component1(): org.nativescript.mason.masonkit.SvgPaint;
					public component2(): number;
					public component3(): boolean;
					public component4(): org.nativescript.mason.masonkit.SvgPaint;
					public component5(): number;
					public component6(): number;
					public component7(): org.nativescript.mason.masonkit.SvgLineCap;
					public component8(): org.nativescript.mason.masonkit.SvgLineJoin;
					public component9(): number;
					public component10(): androidNative.Array<number> | null;
					public component11(): number;
					public component12(): java.lang.Integer | null;
					public component13(): boolean;
					public component14(): boolean;
					public copy(fill: org.nativescript.mason.masonkit.SvgPaint, fillOpacity: number, evenOdd: boolean, stroke: org.nativescript.mason.masonkit.SvgPaint, strokeOpacity: number, strokeWidth: number, lineCap: org.nativescript.mason.masonkit.SvgLineCap, lineJoin: org.nativescript.mason.masonkit.SvgLineJoin, miterLimit: number, dashArray: androidNative.Array<number> | null, dashOffset: number, color: java.lang.Integer | null, visible: boolean, clipEvenOdd: boolean): org.nativescript.mason.masonkit.SvgStyleState;
					public toString(): string;
					public hashCode(): number;
					public equals(other: any): boolean;
					public constructor();
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class SvgTree {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.SvgTree>;
					public constructor(root: org.nativescript.mason.masonkit.SvgNode, ids: java.util.Map<string,org.nativescript.mason.masonkit.SvgNode>, css: string);
					public getRoot(): org.nativescript.mason.masonkit.SvgNode;
					public getIds(): java.util.Map<string,org.nativescript.mason.masonkit.SvgNode>;
					public getCss(): string;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class TextDefaultAttributes {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.TextDefaultAttributes>;
					public constructor();
					public getColor(): java.lang.Integer | null;
					public setColor(value: java.lang.Integer | null): void;
					public getFontSize(): java.lang.Float | null;
					public setFontSize(value: java.lang.Float | null): void;
					public getFontWeight(): org.nativescript.fontmanager.FontWeight | null;
					public setFontWeight(value: org.nativescript.fontmanager.FontWeight | null): void;
					public getFontStyle(): org.nativescript.fontmanager.FontStyle | null;
					public setFontStyle(value: org.nativescript.fontmanager.FontStyle | null): void;
					public getFontFamily(): string | null;
					public setFontFamily(value: string | null): void;
					public getFont(): org.nativescript.fontmanager.FontFace | null;
					public setFont(value: org.nativescript.fontmanager.FontFace | null): void;
					public getTextWrap(): org.nativescript.mason.masonkit.Styles.TextWrap | null;
					public setTextWrap(value: org.nativescript.mason.masonkit.Styles.TextWrap | null): void;
					public getWhiteSpace(): org.nativescript.mason.masonkit.Styles.WhiteSpace | null;
					public setWhiteSpace(value: org.nativescript.mason.masonkit.Styles.WhiteSpace | null): void;
					public getTextTransform(): org.nativescript.mason.masonkit.Styles.TextTransform | null;
					public setTextTransform(value: org.nativescript.mason.masonkit.Styles.TextTransform | null): void;
					public getBackgroundColor(): java.lang.Integer | null;
					public setBackgroundColor(value: java.lang.Integer | null): void;
					public getDecorationLine(): org.nativescript.mason.masonkit.Styles.DecorationLine | null;
					public setDecorationLine(value: org.nativescript.mason.masonkit.Styles.DecorationLine | null): void;
					public getDecorationColor(): java.lang.Integer | null;
					public setDecorationColor(value: java.lang.Integer | null): void;
					public getDecorationStyle(): org.nativescript.mason.masonkit.Styles.DecorationStyle | null;
					public setDecorationStyle(value: org.nativescript.mason.masonkit.Styles.DecorationStyle | null): void;
					public getLetterSpacing(): java.lang.Float | null;
					public setLetterSpacing(value: java.lang.Float | null): void;
					public getLineHeight(): java.lang.Float | null;
					public setLineHeight(value: java.lang.Float | null): void;
					public getLineHeightType(): java.lang.Byte | null;
					public setLineHeightType(value: java.lang.Byte | null): void;
					public getTextAlign(): globalAndroid.text.Layout.Alignment | null;
					public setTextAlign(value: globalAndroid.text.Layout.Alignment | null): void;
					public getVerticalAlign(): org.nativescript.mason.masonkit.enums.VerticalAlign | null;
					public setVerticalAlign(value: org.nativescript.mason.masonkit.enums.VerticalAlign | null): void;
					public getDecorationThickness(): java.lang.Float | null;
					public setDecorationThickness(value: java.lang.Float | null): void;
					public getTextShadow(): java.util.List<org.nativescript.mason.masonkit.Shadow.TextShadow> | null;
					public setTextShadow(value: java.util.List<org.nativescript.mason.masonkit.Shadow.TextShadow> | null): void;
					public sync(style: org.nativescript.mason.masonkit.Style): void;
					public sync(attributes: org.nativescript.mason.masonkit.TextDefaultAttributes): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TextDefaultAttributes {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TextDefaultAttributes.Companion>;
						public empty(): org.nativescript.mason.masonkit.TextDefaultAttributes;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TextDefaultAttributes {
					export class WhenMappings {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TextDefaultAttributes.WhenMappings>;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ThemelessContext {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ThemelessContext.Companion>;
						public textPaint($this$textPaint_u24lambda_u240: globalAndroid.content.Context): globalAndroid.text.TextPaint;
						public wrap(it: globalAndroid.content.Context): globalAndroid.content.Context;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class TouchAction {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.TouchAction>;
					public static INSTANCE: org.nativescript.mason.masonkit.TouchAction;
					public static PAN_X: number = 1;
					public static PAN_Y: number = 2;
					public static PINCH_ZOOM: number = 4;
					public static AUTO: number = 7;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Matrix extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Matrix>;
						public constructor(m: androidNative.Array<number>);
						public getM(): androidNative.Array<number>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Perspective extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Perspective>;
						public constructor(length: org.nativescript.mason.masonkit.CssLength | null);
						public getLength(): org.nativescript.mason.masonkit.CssLength | null;
						public component1(): org.nativescript.mason.masonkit.CssLength | null;
						public copy(length: org.nativescript.mason.masonkit.CssLength | null): org.nativescript.mason.masonkit.TransformFn.Perspective;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Rotate extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Rotate>;
						public constructor(x: number, y: number, z: number, degrees: number);
						public getX(): number;
						public getY(): number;
						public getZ(): number;
						public getDegrees(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public component4(): number;
						public copy(x: number, y: number, z: number, degrees: number): org.nativescript.mason.masonkit.TransformFn.Rotate;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Scale extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Scale>;
						public constructor(x: number, y: number, z: number);
						public getX(): number;
						public getY(): number;
						public getZ(): number;
						public component1(): number;
						public component2(): number;
						public component3(): number;
						public copy(x: number, y: number, z: number): org.nativescript.mason.masonkit.TransformFn.Scale;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Skew extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Skew>;
						public constructor(xDegrees: number, yDegrees: number);
						public getXDegrees(): number;
						public getYDegrees(): number;
						public component1(): number;
						public component2(): number;
						public copy(xDegrees: number, yDegrees: number): org.nativescript.mason.masonkit.TransformFn.Skew;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TransformFn {
					export class Translate extends org.nativescript.mason.masonkit.TransformFn {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformFn.Translate>;
						public constructor(x: org.nativescript.mason.masonkit.CssLength, y: org.nativescript.mason.masonkit.CssLength, z: org.nativescript.mason.masonkit.CssLength);
						public getX(): org.nativescript.mason.masonkit.CssLength;
						public getY(): org.nativescript.mason.masonkit.CssLength;
						public getZ(): org.nativescript.mason.masonkit.CssLength;
						public component1(): org.nativescript.mason.masonkit.CssLength;
						public component2(): org.nativescript.mason.masonkit.CssLength;
						public component3(): org.nativescript.mason.masonkit.CssLength;
						public copy(x: org.nativescript.mason.masonkit.CssLength, y: org.nativescript.mason.masonkit.CssLength, z: org.nativescript.mason.masonkit.CssLength): org.nativescript.mason.masonkit.TransformFn.Translate;
						public toString(): string;
						public hashCode(): number;
						public equals(other: any): boolean;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class TransformOpType {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.TransformOpType>;
					public static INSTANCE: org.nativescript.mason.masonkit.TransformOpType;
					public static NONE: number = 0;
					public static TRANSLATE: number = 1;
					public static TRANSLATE_X: number = 2;
					public static TRANSLATE_Y: number = 3;
					public static SCALE: number = 4;
					public static SCALE_X: number = 5;
					public static SCALE_Y: number = 6;
					public static ROTATE: number = 7;
					public static SKEW_X: number = 8;
					public static SKEW_Y: number = 9;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class TwoDScrollView {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.TwoDScrollView>;
					public static ANIMATED_SCROLL_GAP: number = 250;
					public static SCROLL_ANIMATION_DURATION: number = 250;
					public static MAX_SCROLL_FACTOR: number = 0.5;
					public getEnableScrollX(): boolean;
					public setEnableScrollX(param0: boolean): void;
					public getEnableScrollY(): boolean;
					public setEnableScrollY(param0: boolean): void;
					public getScrollContentWidth(): number;
					public setScrollContentWidth(param0: number): void;
					public getScrollContentHeight(): number;
					public setScrollContentHeight(param0: number): void;
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null);
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null, defStyle: number);
					public setScrollChangeListner(listener: org.nativescript.mason.masonkit.TwoDScrollView.ScrollChangeListener | null): void;
					public isFillViewport(): boolean;
					public setFillViewport(fillViewport: boolean): void;
					public onMeasure($this$isNotEmpty$iv: number, lp: number): void;
					public onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
					public getMaxScrollAmountVertical(): number;
					public getMaxScrollAmountHorizontal(): number;
					public onScrollMotionEnded(): void;
					public dispatchTouchEvent(this_: globalAndroid.view.MotionEvent): boolean;
					public onDetachedFromWindow(): void;
					public executeKeyEvent(nextFocused: globalAndroid.view.KeyEvent): boolean;
					public onTouchEvent(deltaY: globalAndroid.view.MotionEvent): boolean;
					public onScrollChanged(x: number, y: number, oldx: number, oldy: number): void;
					public onSizeChanged(scrollDeltaX: number, scrollDeltaY: number, this_: number, w: number): void;
					public scrollTo(y: number, this_: number): void;
					public computeScroll(): void;
					public getTopFadingEdgeStrength(): number;
					public getBottomFadingEdgeStrength(): number;
					public getLeftFadingEdgeStrength(): number;
					public getRightFadingEdgeStrength(): number;
					public computeHorizontalScrollRange(): number;
					public computeVerticalScrollRange(): number;
					public requestLayout(): void;
					public fullScroll(height: number, right: boolean): boolean;
					public arrowScroll(scrollDelta: number, screenRight: boolean): boolean;
					public smoothScrollBy(this_: number, dx: number): void;
					public smoothScrollTo(x: number, y: number): void;
					public computeScrollDeltaToGetChildRectOnScreen(height: globalAndroid.graphics.Rect): number;
					public computeScrollDeltaXToGetChildRectOnScreen(width: globalAndroid.graphics.Rect): number;
					public requestChildFocus(child: globalAndroid.view.View | null, focused: globalAndroid.view.View): void;
					public requestChildRectangleOnScreen(child: globalAndroid.view.View, rectangle: globalAndroid.graphics.Rect, immediate: boolean): boolean;
					public dispatchKeyEvent(this_: globalAndroid.view.KeyEvent): boolean;
					public onInterceptTouchEvent(xDiff: globalAndroid.view.MotionEvent): boolean;
					public onRequestFocusInDescendants(nextFocus: number, this_: globalAndroid.graphics.Rect | null): boolean;
					public measureChild(childWidthMeasureSpec: globalAndroid.view.View, childHeightMeasureSpec: number, this_: number): void;
					public measureChildWithMargins(childWidthMeasureSpec: globalAndroid.view.View, childHeightMeasureSpec: number, this_: number, child: number, parentWidthMeasureSpec: number): void;
					public fling(movingRight: number, newFocused: number): void;
					public draw(w: globalAndroid.graphics.Canvas): void;
					public setNestedScrollingEnabled(enabled: boolean): void;
					public isNestedScrollingEnabled(): boolean;
					public startNestedScroll(axes: number): boolean;
					public startNestedScroll(axes: number, type: number): boolean;
					public stopNestedScroll(): void;
					public stopNestedScroll(type: number): void;
					public hasNestedScrollingParent(): boolean;
					public hasNestedScrollingParent(type: number): boolean;
					public dispatchNestedScroll(dxConsumed: number, dyConsumed: number, dxUnconsumed: number, dyUnconsumed: number, offsetInWindow: androidNative.Array<number> | null): boolean;
					public dispatchNestedScroll(dxConsumed: number, dyConsumed: number, dxUnconsumed: number, dyUnconsumed: number, offsetInWindow: androidNative.Array<number> | null, type: number): boolean;
					public dispatchNestedScroll(dxConsumed: number, dyConsumed: number, dxUnconsumed: number, dyUnconsumed: number, offsetInWindow: androidNative.Array<number> | null, type: number, consumed: androidNative.Array<number>): void;
					public dispatchNestedPreScroll(dx: number, dy: number, consumed: androidNative.Array<number> | null, offsetInWindow: androidNative.Array<number> | null): boolean;
					public dispatchNestedPreScroll(dx: number, dy: number, consumed: androidNative.Array<number> | null, offsetInWindow: androidNative.Array<number> | null, type: number): boolean;
					public dispatchNestedFling(velocityX: number, velocityY: number, consumed: boolean): boolean;
					public dispatchNestedPreFling(velocityX: number, velocityY: number): boolean;
					public onStartNestedScroll(child: globalAndroid.view.View, target: globalAndroid.view.View, axes: number): boolean;
					public onStartNestedScroll(child: globalAndroid.view.View, target: globalAndroid.view.View, axes: number, type: number): boolean;
					public onNestedScrollAccepted(child: globalAndroid.view.View, target: globalAndroid.view.View, axes: number): void;
					public onNestedScrollAccepted(child: globalAndroid.view.View, target: globalAndroid.view.View, axes: number, type: number): void;
					public onStopNestedScroll(target: globalAndroid.view.View): void;
					public onStopNestedScroll(target: globalAndroid.view.View, type: number): void;
					public getNestedScrollAxes(): number;
					public onNestedPreScroll(target: globalAndroid.view.View, dx: number, dy: number, consumed: androidNative.Array<number>, type: number): void;
					public onNestedScroll(target: globalAndroid.view.View, dxConsumed: number, dyConsumed: number, dxUnconsumed: number, dyUnconsumed: number, type: number): void;
					public onNestedScroll(myConsumedY: globalAndroid.view.View, this_: number, target: number, dxConsumed: number, dyConsumed: number, dxUnconsumed: number, dyUnconsumed: androidNative.Array<number>): void;
					public onNestedPreFling(target: globalAndroid.view.View, velocityX: number, velocityY: number): boolean;
					public onNestedFling(target: globalAndroid.view.View, velocityX: number, velocityY: number, consumed: boolean): boolean;
					public constructor(context: globalAndroid.content.Context);
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TwoDScrollView {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TwoDScrollView.Companion>;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TwoDScrollView {
					export class EdgeEffects {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TwoDScrollView.EdgeEffects>;
						public constructor(context: globalAndroid.content.Context);
						public getTop(): globalAndroid.widget.EdgeEffect;
						public getBottom(): globalAndroid.widget.EdgeEffect;
						public getLeft(): globalAndroid.widget.EdgeEffect;
						public getRight(): globalAndroid.widget.EdgeEffect;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module TwoDScrollView {
					export class ScrollChangeListener {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.TwoDScrollView.ScrollChangeListener>;
						/**
						 * Constructs a new instance of the org.nativescript.mason.masonkit.TwoDScrollView$ScrollChangeListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onScrollChanged(param0: globalAndroid.view.View | null, param1: number, param2: number, param3: number, param4: number): void;
						});
						public constructor();
						public onScrollChanged(param0: globalAndroid.view.View | null, param1: number, param2: number, param3: number, param4: number): void;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class View implements org.nativescript.mason.masonkit.Element, org.nativescript.mason.masonkit.StyleChangeListener {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.View>;
					public node: org.nativescript.mason.masonkit.Node;
					public constructor($this$_init__u24lambda_u241: globalAndroid.content.Context, this_: globalAndroid.util.AttributeSet | null, context: number, attrs: boolean);
					public getNode(): org.nativescript.mason.masonkit.Node;
					public setNode(param0: org.nativescript.mason.masonkit.Node): void;
					public getStyle(): org.nativescript.mason.masonkit.Style;
					public getView(): globalAndroid.view.View;
					public constructor($this$_init__u24lambda_u240: globalAndroid.content.Context, this_: org.nativescript.mason.masonkit.Mason);
					public onViewAdded(child: globalAndroid.view.View): void;
					public onViewRemoved(child: globalAndroid.view.View): void;
					public getChildDrawingOrder(this_: number, childCount: number): number;
					public dispatchTouchEvent(i: globalAndroid.view.MotionEvent): boolean;
					public onSizeChanged(i: number, param1: number, layers: number, this_: number): void;
					public draw(this_: globalAndroid.graphics.Canvas): void;
					public onDescendantInvalidated(child: globalAndroid.view.View, target: globalAndroid.view.View): void;
					public dispatchDraw(canvas: globalAndroid.graphics.Canvas): void;
					public dispatchDrawChildren(canvas: globalAndroid.graphics.Canvas): void;
					public updateNodeAndStyle(): void;
					public onChange(low: number, high: number): void;
					public getStyleAsString(): string | null;
					public onAttachedToWindow(): void;
					public onLayout(changed: boolean, l: number, t: number, r: number, b: number): void;
					public onMeasure(heightArg: number, stale: number): void;
					public addView(this_: globalAndroid.view.View | null): void;
					public addView(this_: globalAndroid.view.View | null, child: number): void;
					public addView(this_: globalAndroid.view.View | null, child: globalAndroid.view.ViewGroup.LayoutParams | null): void;
					public addView(this_: globalAndroid.view.View | null, child: number, index: globalAndroid.view.ViewGroup.LayoutParams | null): void;
					public removeView(this_: globalAndroid.view.View | null): void;
					public removeViewAt(index: number): void;
					public removeChildren(): void;
					public removeAllViews(): void;
					public removeViewInLayout(view: globalAndroid.view.View): void;
					public removeViews(this_: number, start: number): void;
					public removeViewsInLayout(this_: number, start: number): void;
					public removeAllViewsInLayout(): void;
					public applyLayoutParams($i$f$getSize: org.nativescript.mason.masonkit.View.LayoutParams, $this$size$iv: org.nativescript.mason.masonkit.Node, points: globalAndroid.view.View): void;
					public getDisplay(): org.nativescript.mason.masonkit.enums.Display;
					public setDisplay(value: org.nativescript.mason.masonkit.enums.Display): void;
					public getDirection(): org.nativescript.mason.masonkit.enums.Direction;
					public setDirection(value: org.nativescript.mason.masonkit.enums.Direction): void;
					public getFlexDirection(): org.nativescript.mason.masonkit.enums.FlexDirection;
					public setFlexDirection(value: org.nativescript.mason.masonkit.enums.FlexDirection): void;
					public getFlexWrap(): org.nativescript.mason.masonkit.enums.FlexWrap;
					public setFlexWrap(value: org.nativescript.mason.masonkit.enums.FlexWrap): void;
					public getOverflow(): org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>;
					public setOverflow(value: org.nativescript.mason.masonkit.Point<org.nativescript.mason.masonkit.enums.Overflow>): void;
					public getOverflowX(): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowX(value: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getOverflowY(): org.nativescript.mason.masonkit.enums.Overflow;
					public setOverflowY(value: org.nativescript.mason.masonkit.enums.Overflow): void;
					public getAlignItems(): org.nativescript.mason.masonkit.enums.AlignItems;
					public setAlignItems(value: org.nativescript.mason.masonkit.enums.AlignItems): void;
					public getAlignSelf(): org.nativescript.mason.masonkit.enums.AlignSelf;
					public setAlignSelf(value: org.nativescript.mason.masonkit.enums.AlignSelf): void;
					public getAlignContent(): org.nativescript.mason.masonkit.enums.AlignContent;
					public setAlignContent(value: org.nativescript.mason.masonkit.enums.AlignContent): void;
					public getJustifyItems(): org.nativescript.mason.masonkit.enums.JustifyItems;
					public setJustifyItems(value: org.nativescript.mason.masonkit.enums.JustifyItems): void;
					public getJustifySelf(): org.nativescript.mason.masonkit.enums.JustifySelf;
					public setJustifySelf(value: org.nativescript.mason.masonkit.enums.JustifySelf): void;
					public getJustifyContent(): org.nativescript.mason.masonkit.enums.JustifyContent;
					public setJustifyContent(value: org.nativescript.mason.masonkit.enums.JustifyContent): void;
					public getFlexGrow(): number;
					public setFlexGrow(value: number): void;
					public getFlexShrink(): number;
					public setFlexShrink(value: number): void;
					public getScrollBarWidth(): number;
					public setScrollBarWidth(value: number): void;
					public setFlexBasis(value: number, type: number): void;
					public getFlexBasis(): org.nativescript.mason.masonkit.Dimension;
					public setFlexBasis(value: org.nativescript.mason.masonkit.Dimension): void;
					public getPadding(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public getStylePaddingLeft(): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingRight(): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingTop(): org.nativescript.mason.masonkit.LengthPercentage;
					public getStylePaddingBottom(): org.nativescript.mason.masonkit.LengthPercentage;
					public getPaddingCssValue(): string;
					public getPaddingJsonValue(): string;
					public setPadding(left: number, top: number, right: number, bottom: number): void;
					public setPadding(left: org.nativescript.mason.masonkit.LengthPercentage, top: org.nativescript.mason.masonkit.LengthPercentage, right: org.nativescript.mason.masonkit.LengthPercentage, bottom: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setPadding(left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number, bottomType: number): void;
					public setPaddingLeft(value: number, type: number): void;
					public setPaddingRight(value: number, type: number): void;
					public setPaddingTop(value: number, type: number): void;
					public setPaddingBottom(value: number, type: number): void;
					public setPaddingWithValueType(value: number, type: number): void;
					public getBorderWidth(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentage>;
					public getBorderLeftWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderRightWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderTopWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderBottomWidth(): org.nativescript.mason.masonkit.LengthPercentage;
					public getBorderCssValue(): string;
					public getBorderJsonValue(): string;
					public setBorderWidth(left: number, top: number, right: number, bottom: number): void;
					public setBorder(left: org.nativescript.mason.masonkit.LengthPercentage, top: org.nativescript.mason.masonkit.LengthPercentage, right: org.nativescript.mason.masonkit.LengthPercentage, bottom: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setBorder(left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number, bottomType: number): void;
					public setBorderLeft(value: number, type: number): void;
					public setBorderRight(value: number, type: number): void;
					public setBorderTop(value: number, type: number): void;
					public setBorderBottom(value: number, type: number): void;
					public setBorderWithValueType(value: number, type: number): void;
					public getMargin(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getMarginLeft(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginRight(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginTop(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginBottom(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getMarginCssValue(): string;
					public getMarginJsonValue(): string;
					public setMargin(left: number, top: number, right: number, bottom: number): void;
					public setMargin(left: org.nativescript.mason.masonkit.LengthPercentageAuto, top: org.nativescript.mason.masonkit.LengthPercentageAuto, right: org.nativescript.mason.masonkit.LengthPercentageAuto, bottom: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public setMargin(left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number, bottomType: number): void;
					public setMarginLeft(value: number, type: number): void;
					public setMarginRight(value: number, type: number): void;
					public setMarginTop(value: number, type: number): void;
					public setMarginBottom(value: number, type: number): void;
					public setMarginWithValueType(value: number, type: number): void;
					public getInset(): org.nativescript.mason.masonkit.Rect<org.nativescript.mason.masonkit.LengthPercentageAuto>;
					public getInsetLeft(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetRight(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetTop(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetBottom(): org.nativescript.mason.masonkit.LengthPercentageAuto;
					public getInsetCssValue(): string;
					public getInsetJsonValue(): string;
					public setPosition(left: number, top: number, right: number, bottom: number): void;
					public setPosition(left: org.nativescript.mason.masonkit.LengthPercentageAuto, top: org.nativescript.mason.masonkit.LengthPercentageAuto, right: org.nativescript.mason.masonkit.LengthPercentageAuto, bottom: org.nativescript.mason.masonkit.LengthPercentageAuto): void;
					public setInset(left: number, leftType: number, top: number, topType: number, right: number, rightType: number, bottom: number, bottomType: number): void;
					public setInsetLeft(value: number, type: number): void;
					public setInsetRight(value: number, type: number): void;
					public setInsetTop(value: number, type: number): void;
					public setInsetBottom(value: number, type: number): void;
					public setInsetWithValueType(value: number, type: number): void;
					public setMinSize(width: number, height: number): void;
					public getMinSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getMinSizeWidth(): org.nativescript.mason.masonkit.Dimension;
					public getMinSizeHeight(): org.nativescript.mason.masonkit.Dimension;
					public getMinSizeCssValue(): string;
					public getMinSizeJsonValue(): string;
					public setMinSize(width: org.nativescript.mason.masonkit.Dimension, height: org.nativescript.mason.masonkit.Dimension): void;
					public setMinSize(width: number, widthType: number, height: number, heightType: number): void;
					public setMinSizeWidth(value: number, type: number): void;
					public setMinSizeHeight(value: number, type: number): void;
					public setSize(width: number, height: number): void;
					public getSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getSizeCssValue(): string;
					public getSizeJsonValue(): string;
					public getSizeWidth(): org.nativescript.mason.masonkit.Dimension;
					public getSizeHeight(): org.nativescript.mason.masonkit.Dimension;
					public setSize(width: org.nativescript.mason.masonkit.Dimension, height: org.nativescript.mason.masonkit.Dimension): void;
					public setSize(width: number, widthType: number, height: number, heightType: number): void;
					public setSizeWidth(value: number, type: number): void;
					public setSizeHeight(value: number, type: number): void;
					public setMaxSize(width: number, height: number): void;
					public getMaxSize(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.Dimension>;
					public getMaxSizeWidth(): org.nativescript.mason.masonkit.Dimension;
					public getMaxSizeHeight(): org.nativescript.mason.masonkit.Dimension;
					public getMaxSizeCssValue(): string;
					public getMaxSizeJsonValue(): string;
					public setMaxSize(width: org.nativescript.mason.masonkit.Dimension, height: org.nativescript.mason.masonkit.Dimension): void;
					public setMaxSize(width: number, widthType: number, height: number, heightType: number): void;
					public setMaxSizeWidth(value: number, type: number): void;
					public setMaxSizeHeight(value: number, type: number): void;
					public setGap(width: number, height: number): void;
					public getGap(): org.nativescript.mason.masonkit.Size<org.nativescript.mason.masonkit.LengthPercentage>;
					public getGapRow(): org.nativescript.mason.masonkit.LengthPercentage;
					public getGapColumn(): org.nativescript.mason.masonkit.LengthPercentage;
					public setGap(row: org.nativescript.mason.masonkit.LengthPercentage, column: org.nativescript.mason.masonkit.LengthPercentage): void;
					public setGap(width: number, widthType: number, height: number, heightType: number): void;
					public setGapRow(value: number, type: number): void;
					public setRowGap(value: number, type: number): void;
					public setGapColumn(value: number, type: number): void;
					public setColumnGap(value: number, type: number): void;
					public getAspectRatio(): java.lang.Float | null;
					public setAspectRatio(value: java.lang.Float | null): void;
					public getGridAutoRows(): string;
					public setGridAutoRows(value: string): void;
					public getGridAutoColumns(): string;
					public setGridAutoColumns(value: string): void;
					public getGridAutoFlow(): org.nativescript.mason.masonkit.enums.GridAutoFlow;
					public setGridAutoFlow(value: org.nativescript.mason.masonkit.enums.GridAutoFlow): void;
					public getGridColumn(): string;
					public setGridColumn(value: string): void;
					public getGridColumnStart(): string;
					public setGridColumnStart(value: string): void;
					public getGridColumnEnd(): string;
					public setGridColumnEnd(value: string): void;
					public getGridRow(): string;
					public setGridRow(value: string): void;
					public getGridRowStart(): string;
					public setGridRowStart(value: string): void;
					public getGridRowEnd(): string;
					public setGridRowEnd(value: string): void;
					public getGridTemplateRows(): string;
					public setGridTemplateRows(value: string): void;
					public getGridTemplateColumns(): string;
					public setGridTemplateColumns(value: string): void;
					public generateLayoutParams(attrs: globalAndroid.util.AttributeSet): globalAndroid.view.ViewGroup.LayoutParams;
					public generateDefaultLayoutParams(): globalAndroid.view.ViewGroup.LayoutParams;
					public generateLayoutParams(p: globalAndroid.view.ViewGroup.LayoutParams | null): globalAndroid.view.ViewGroup.LayoutParams;
					public checkLayoutParams(p: globalAndroid.view.ViewGroup.LayoutParams | null): boolean;
					public layout(): org.nativescript.mason.masonkit.Layout;
					public getWritableStyleBuffer(): java.nio.ByteBuffer;
					public addEventListener(type: string, listener: any): java.util.UUID;
					public ensureNativeClickDispatch(): void;
					public syncStyleParts(lowLow: number, lowHigh: number, highLow: number, highHigh: number): void;
					public syncStyle(low: number, high: number): void;
					public onNodeAttached(): void;
					public onNodeDetached(): void;
					public markNodeDirty(): void;
					public isNodeDirty(): boolean;
					public configure(block: any): org.nativescript.mason.masonkit.Element;
					public elementFromPoint(x: number, y: number): globalAndroid.view.View | null;
					public layoutFlat(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public compute(): void;
					public compute(widthArg: number, heightArg: number): void;
					public computeMaxContent(): void;
					public computeMinContent(): void;
					public computeWithViewSize(): void;
					public computeWithViewSize(layout: boolean): void;
					public computeNestedRootLater(widthArg: number, heightArg: number): void;
					public computeOrDeferNested(widthArg: number, heightArg: number): boolean;
					public invalidateForeignHost(): void;
					public computeAndLayout(): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeAndLayout(width: number, height: number): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeWithSize(width: number, height: number): void;
					public computeWithMaxContent(): void;
					public computeWithMinContent(): void;
					public attachAndApply(): void;
					public append(element: org.nativescript.mason.masonkit.Element): void;
					public append(node: org.nativescript.mason.masonkit.Node): void;
					public append(nodes: java.util.List<any>): void;
					public append(elements: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public append(nodes: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public prepend(element: org.nativescript.mason.masonkit.Element): void;
					public prepend(node: org.nativescript.mason.masonkit.Node): void;
					public prepend(elements: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public prepend(nodes: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public invalidateLayout(): void;
					public invalidateLayout(invalidateRoot: boolean): void;
					public recomputeRoot(): void;
					public appendView(view: globalAndroid.view.View): void;
					public appendView(views: androidNative.Array<globalAndroid.view.View>): void;
					public prependView(view: globalAndroid.view.View): void;
					public prependView(views: androidNative.Array<globalAndroid.view.View>): void;
					public addChildAt(element: org.nativescript.mason.masonkit.Element, index: number): void;
					public addChildAt(node: org.nativescript.mason.masonkit.Node, index: number): void;
					public replaceChildAt(element: org.nativescript.mason.masonkit.Element, index: number): void;
					public replaceChildAt(node: org.nativescript.mason.masonkit.Node, index: number): void;
					public removeChildAt(index: number): void;
					public removeChild(node: org.nativescript.mason.masonkit.Node): void;
					public removeEventListener(type: string, id: java.util.UUID): void;
					public dispatch(event: org.nativescript.mason.masonkit.events.Event): void;
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null, defStyleAttr: number);
					public constructor(context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet | null);
					public constructor(context: globalAndroid.content.Context);
					public static createGridView(mason: org.nativescript.mason.masonkit.Mason, context: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
					public static createFlexView(mason: org.nativescript.mason.masonkit.Mason, context: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
					public static createBlockView(mason: org.nativescript.mason.masonkit.Mason, context: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
					public addEventListener(param0: string, param1: any): java.util.UUID;
					public syncStyleParts(param0: number, param1: number, param2: number, param3: number): void;
					public syncStyle(param0: number, param1: number): void;
					public configure(param0: any): org.nativescript.mason.masonkit.Element;
					public elementFromPoint(param0: number, param1: number): globalAndroid.view.View | null;
					public compute(param0: number, param1: number): void;
					public computeNestedRootLater(param0: number, param1: number): void;
					public computeOrDeferNested(param0: number, param1: number): boolean;
					public computeAndLayout(param0: number, param1: number): org.nativescript.mason.masonkit.MasonLayoutTree;
					public computeWithSize(param0: number, param1: number): void;
					public computeWithViewSize(param0: boolean): void;
					public append(param0: org.nativescript.mason.masonkit.Element): void;
					public append(param0: org.nativescript.mason.masonkit.Node): void;
					public append(param0: java.util.List<any>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public append(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public prepend(param0: org.nativescript.mason.masonkit.Element): void;
					public prepend(param0: org.nativescript.mason.masonkit.Node): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Element>): void;
					public prepend(param0: androidNative.Array<org.nativescript.mason.masonkit.Node>): void;
					public invalidateLayout(param0: boolean): void;
					public appendView(param0: globalAndroid.view.View): void;
					public appendView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public prependView(param0: globalAndroid.view.View): void;
					public prependView(param0: androidNative.Array<globalAndroid.view.View>): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public addChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Element, param1: number): void;
					public replaceChildAt(param0: org.nativescript.mason.masonkit.Node, param1: number): void;
					public removeChildAt(param0: number): void;
					public removeChild(param0: org.nativescript.mason.masonkit.Node): void;
					public onChange(param0: number, param1: number): void;
					public removeEventListener(param0: string, param1: java.util.UUID): void;
					public dispatch(param0: org.nativescript.mason.masonkit.events.Event): void;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module View {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.View.Companion>;
						public createGridView($this$createGridView_u24lambda_u240: org.nativescript.mason.masonkit.Mason, this_: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
						public createFlexView($this$createFlexView_u24lambda_u241: org.nativescript.mason.masonkit.Mason, this_: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
						public createBlockView($this$createBlockView_u24lambda_u242: org.nativescript.mason.masonkit.Mason, this_: globalAndroid.content.Context): org.nativescript.mason.masonkit.View;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module View {
					export class LayoutParams {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.View.LayoutParams>;
						public constructor(width: number, height: number);
						public constructor(source: globalAndroid.view.ViewGroup.LayoutParams);
						public constructor(typedValue: globalAndroid.content.Context, i: globalAndroid.util.AttributeSet);
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ViewLayoutFactory {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ViewLayoutFactory>;
					public constructor();
					public onCreateView(name: string, context: globalAndroid.content.Context, attrs: globalAndroid.util.AttributeSet): globalAndroid.view.View | null;
					public static getInstance(): org.nativescript.mason.masonkit.ViewLayoutFactory;
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ViewLayoutFactory {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ViewLayoutFactory.Companion>;
						public getInstance(): org.nativescript.mason.masonkit.ViewLayoutFactory;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class ViewUtils {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.ViewUtils>;
					public constructor();
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ViewUtils {
					export class Companion {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.ViewUtils.Companion>;
						public drawChildrenOutsetShadows($this$drawChildrenOutsetShadows_u24lambda_u245: globalAndroid.view.ViewGroup, $i$f$withSave: globalAndroid.graphics.Canvas): void;
						public onDraw(view: globalAndroid.view.View, canvas: globalAndroid.graphics.Canvas, style: org.nativescript.mason.masonkit.Style, ignoreBorder: boolean, superDraw: any): void;
						public holdInitialFocus(root: globalAndroid.view.ViewGroup): void;
						public dispatchDraw(view: globalAndroid.view.View, canvas: globalAndroid.graphics.Canvas, style: org.nativescript.mason.masonkit.Style, ignoreBorder: boolean, beforeChildren: any | null, superDraw: any): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module ViewUtils {
					export module Companion {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.ViewUtils.Companion.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export class WebScroll {
					public static class: java.lang.Class<org.nativescript.mason.masonkit.WebScroll>;
					public static INSTANCE: org.nativescript.mason.masonkit.WebScroll;
					public static scrollLeft(view: globalAndroid.view.View): number;
					public static scrollTop(view: globalAndroid.view.View): number;
					public static clientWidth(view: globalAndroid.view.View): number;
					public static clientHeight(view: globalAndroid.view.View): number;
					public static scrollWidth(client: globalAndroid.view.View): number;
					public static scrollHeight(client: globalAndroid.view.View): number;
					public static scrollTo(scroller: globalAndroid.view.View, view: number, x: number, y: boolean): void;
					public static scrollIntoView(node: globalAndroid.view.View, bl: number, bt: number, portW: boolean): void;
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Align {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Align>;
						public static Auto: org.nativescript.mason.masonkit.enums.Align;
						public static Left: org.nativescript.mason.masonkit.enums.Align;
						public static Right: org.nativescript.mason.masonkit.enums.Align;
						public static Center: org.nativescript.mason.masonkit.enums.Align;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Align>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Align;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Align {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Align.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Align;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Align {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Align.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class AlignContent {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignContent>;
						public static Normal: org.nativescript.mason.masonkit.enums.AlignContent;
						public static Start: org.nativescript.mason.masonkit.enums.AlignContent;
						public static End: org.nativescript.mason.masonkit.enums.AlignContent;
						public static Center: org.nativescript.mason.masonkit.enums.AlignContent;
						public static Stretch: org.nativescript.mason.masonkit.enums.AlignContent;
						public static SpaceBetween: org.nativescript.mason.masonkit.enums.AlignContent;
						public static SpaceAround: org.nativescript.mason.masonkit.enums.AlignContent;
						public static SpaceEvenly: org.nativescript.mason.masonkit.enums.AlignContent;
						public static FlexStart: org.nativescript.mason.masonkit.enums.AlignContent;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.AlignContent;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.AlignContent>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.AlignContent;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignContent {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignContent.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.AlignContent;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignContent {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignContent.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class AlignItems {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignItems>;
						public static Normal: org.nativescript.mason.masonkit.enums.AlignItems;
						public static Start: org.nativescript.mason.masonkit.enums.AlignItems;
						public static End: org.nativescript.mason.masonkit.enums.AlignItems;
						public static Center: org.nativescript.mason.masonkit.enums.AlignItems;
						public static Baseline: org.nativescript.mason.masonkit.enums.AlignItems;
						public static Stretch: org.nativescript.mason.masonkit.enums.AlignItems;
						public static FlexStart: org.nativescript.mason.masonkit.enums.AlignItems;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.AlignItems;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.AlignItems>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.AlignItems;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignItems {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignItems.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.AlignItems;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignItems {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignItems.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class AlignSelf {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignSelf>;
						public static Normal: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static Start: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static End: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static Center: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static Baseline: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static Stretch: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static FlexStart: org.nativescript.mason.masonkit.enums.AlignSelf;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.AlignSelf;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.AlignSelf>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.AlignSelf;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignSelf {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignSelf.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.AlignSelf;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module AlignSelf {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.AlignSelf.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class BorderStyle {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.BorderStyle>;
						public static None: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Hidden: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Dotted: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Dashed: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Solid: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Double: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Groove: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Ridge: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Inset: org.nativescript.mason.masonkit.enums.BorderStyle;
						public static Outset: org.nativescript.mason.masonkit.enums.BorderStyle;
						public getValue(): number;
						public getCss(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.BorderStyle>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.BorderStyle;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module BorderStyle {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.BorderStyle.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.BorderStyle;
							public isValid(value: string): boolean;
							public fromName(value: string): org.nativescript.mason.masonkit.enums.BorderStyle | null;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class BoxSizing {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.BoxSizing>;
						public static BorderBox: org.nativescript.mason.masonkit.enums.BoxSizing;
						public static ContentBox: org.nativescript.mason.masonkit.enums.BoxSizing;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.BoxSizing>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.BoxSizing;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module BoxSizing {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.BoxSizing.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.BoxSizing;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module BoxSizing {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.BoxSizing.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Clear {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Clear>;
						public static None: org.nativescript.mason.masonkit.enums.Clear;
						public static Left: org.nativescript.mason.masonkit.enums.Clear;
						public static Right: org.nativescript.mason.masonkit.enums.Clear;
						public static Both: org.nativescript.mason.masonkit.enums.Clear;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Clear>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Clear;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Clear {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Clear.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Clear;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Direction {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Direction>;
						public static Inherit: org.nativescript.mason.masonkit.enums.Direction;
						public static LTR: org.nativescript.mason.masonkit.enums.Direction;
						public static RTL: org.nativescript.mason.masonkit.enums.Direction;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Direction>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Direction;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Direction {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Direction.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Direction;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Direction {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Direction.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Display {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Display>;
						public static None: org.nativescript.mason.masonkit.enums.Display;
						public static Flex: org.nativescript.mason.masonkit.enums.Display;
						public static Grid: org.nativescript.mason.masonkit.enums.Display;
						public static Block: org.nativescript.mason.masonkit.enums.Display;
						public static Inline: org.nativescript.mason.masonkit.enums.Display;
						public static InlineBlock: org.nativescript.mason.masonkit.enums.Display;
						public static InlineFlex: org.nativescript.mason.masonkit.enums.Display;
						public static InlineGrid: org.nativescript.mason.masonkit.enums.Display;
						public static ListItem: org.nativescript.mason.masonkit.enums.Display;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Display>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Display;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Display {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Display.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Display;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Display {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Display.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module DisplayMode {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.DisplayMode.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.DisplayMode;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class FlexDirection {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexDirection>;
						public static Row: org.nativescript.mason.masonkit.enums.FlexDirection;
						public static Column: org.nativescript.mason.masonkit.enums.FlexDirection;
						public static RowReverse: org.nativescript.mason.masonkit.enums.FlexDirection;
						public static ColumnReverse: org.nativescript.mason.masonkit.enums.FlexDirection;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.FlexDirection>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.FlexDirection;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module FlexDirection {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexDirection.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.FlexDirection;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module FlexDirection {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexDirection.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class FlexWrap {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexWrap>;
						public static NoWrap: org.nativescript.mason.masonkit.enums.FlexWrap;
						public static Wrap: org.nativescript.mason.masonkit.enums.FlexWrap;
						public static WrapReverse: org.nativescript.mason.masonkit.enums.FlexWrap;
						public static Balance: org.nativescript.mason.masonkit.enums.FlexWrap;
						public static BalanceReverse: org.nativescript.mason.masonkit.enums.FlexWrap;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.FlexWrap>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.FlexWrap;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module FlexWrap {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexWrap.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.FlexWrap;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module FlexWrap {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FlexWrap.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Float {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Float>;
						public static None: org.nativescript.mason.masonkit.enums.Float;
						public static Left: org.nativescript.mason.masonkit.enums.Float;
						public static Right: org.nativescript.mason.masonkit.enums.Float;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Float>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Float;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Float {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Float.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Float;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class FontVariantNumeric {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.FontVariantNumeric>;
						public static INSTANCE: org.nativescript.mason.masonkit.enums.FontVariantNumeric;
						public static NORMAL: number = 0;
						public static LINING_NUMS: number = 1;
						public static OLDSTYLE_NUMS: number = 2;
						public static PROPORTIONAL_NUMS: number = 4;
						public static TABULAR_NUMS: number = 8;
						public static DIAGONAL_FRACTIONS: number = 16;
						public static STACKED_FRACTIONS: number = 32;
						public static ORDINAL: number = 64;
						public static SLASHED_ZERO: number = 128;
						public toFontFeatureSettings(this_: number): string;
						public toCssString(this_: number): string;
						public parse(trimmed: string): number;
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class GridAutoFlow {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.GridAutoFlow>;
						public static Row: org.nativescript.mason.masonkit.enums.GridAutoFlow;
						public static Column: org.nativescript.mason.masonkit.enums.GridAutoFlow;
						public static RowDense: org.nativescript.mason.masonkit.enums.GridAutoFlow;
						public static ColumnDense: org.nativescript.mason.masonkit.enums.GridAutoFlow;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.GridAutoFlow>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.GridAutoFlow;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module GridAutoFlow {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.GridAutoFlow.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.GridAutoFlow;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module GridAutoFlow {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.GridAutoFlow.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class JustifyContent {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyContent>;
						public static Normal: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static Start: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static End: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static Center: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static Stretch: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static SpaceBetween: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static SpaceAround: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static SpaceEvenly: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static FlexStart: org.nativescript.mason.masonkit.enums.JustifyContent;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.JustifyContent;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.JustifyContent>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.JustifyContent;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifyContent {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyContent.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.JustifyContent;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifyContent {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyContent.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class JustifyItems {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyItems>;
						public static Normal: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static Start: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static End: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static Center: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static Baseline: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static Stretch: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static FlexStart: org.nativescript.mason.masonkit.enums.JustifyItems;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.JustifyItems;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.JustifyItems>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.JustifyItems;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifyItems {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyItems.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.JustifyItems;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifyItems {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifyItems.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class JustifySelf {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifySelf>;
						public static Normal: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static Start: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static End: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static Center: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static Baseline: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static Stretch: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static FlexStart: org.nativescript.mason.masonkit.enums.JustifySelf;
						public static FlexEnd: org.nativescript.mason.masonkit.enums.JustifySelf;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.JustifySelf>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.JustifySelf;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifySelf {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifySelf.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.JustifySelf;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module JustifySelf {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.JustifySelf.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class ListStylePosition {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStylePosition>;
						public static Outside: org.nativescript.mason.masonkit.enums.ListStylePosition;
						public static Inside: org.nativescript.mason.masonkit.enums.ListStylePosition;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.ListStylePosition>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.ListStylePosition;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module ListStylePosition {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStylePosition.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.ListStylePosition;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module ListStylePosition {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStylePosition.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class ListStyleType {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStyleType>;
						public static None: org.nativescript.mason.masonkit.enums.ListStyleType;
						public static Custom: org.nativescript.mason.masonkit.enums.ListStyleType;
						public static Disc: org.nativescript.mason.masonkit.enums.ListStyleType;
						public static Circle: org.nativescript.mason.masonkit.enums.ListStyleType;
						public static Square: org.nativescript.mason.masonkit.enums.ListStyleType;
						public static Decimal: org.nativescript.mason.masonkit.enums.ListStyleType;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.ListStyleType>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.ListStyleType;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module ListStyleType {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStyleType.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.ListStyleType;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module ListStyleType {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ListStyleType.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class ObjectFit {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ObjectFit>;
						public static Contain: org.nativescript.mason.masonkit.enums.ObjectFit;
						public static Cover: org.nativescript.mason.masonkit.enums.ObjectFit;
						public static Fill: org.nativescript.mason.masonkit.enums.ObjectFit;
						public static None: org.nativescript.mason.masonkit.enums.ObjectFit;
						public static ScaleDown: org.nativescript.mason.masonkit.enums.ObjectFit;
						public getValue(): number;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.ObjectFit>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.ObjectFit;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module ObjectFit {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.ObjectFit.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.ObjectFit;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Overflow {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Overflow>;
						public static Visible: org.nativescript.mason.masonkit.enums.Overflow;
						public static Hidden: org.nativescript.mason.masonkit.enums.Overflow;
						public static Scroll: org.nativescript.mason.masonkit.enums.Overflow;
						public static Clip: org.nativescript.mason.masonkit.enums.Overflow;
						public static Auto: org.nativescript.mason.masonkit.enums.Overflow;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Overflow>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Overflow;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Overflow {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Overflow.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Overflow;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class Position {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Position>;
						public static Static: org.nativescript.mason.masonkit.enums.Position;
						public static Relative: org.nativescript.mason.masonkit.enums.Position;
						public static Absolute: org.nativescript.mason.masonkit.enums.Position;
						public static Fixed: org.nativescript.mason.masonkit.enums.Position;
						public static Sticky: org.nativescript.mason.masonkit.enums.Position;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.Position>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.Position;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Position {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Position.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.Position;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module Position {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.Position.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class TextAlign {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextAlign>;
						public static Auto: org.nativescript.mason.masonkit.enums.TextAlign;
						public static Left: org.nativescript.mason.masonkit.enums.TextAlign;
						public static Right: org.nativescript.mason.masonkit.enums.TextAlign;
						public static Center: org.nativescript.mason.masonkit.enums.TextAlign;
						public static Justify: org.nativescript.mason.masonkit.enums.TextAlign;
						public static Start: org.nativescript.mason.masonkit.enums.TextAlign;
						public static End: org.nativescript.mason.masonkit.enums.TextAlign;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.TextAlign>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.TextAlign;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module TextAlign {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextAlign.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.TextAlign;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module TextAlign {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextAlign.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class TextType {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextType>;
						public static None: org.nativescript.mason.masonkit.enums.TextType;
						public static P: org.nativescript.mason.masonkit.enums.TextType;
						public static Span: org.nativescript.mason.masonkit.enums.TextType;
						public static Code: org.nativescript.mason.masonkit.enums.TextType;
						public static H1: org.nativescript.mason.masonkit.enums.TextType;
						public static H2: org.nativescript.mason.masonkit.enums.TextType;
						public static H3: org.nativescript.mason.masonkit.enums.TextType;
						public static H4: org.nativescript.mason.masonkit.enums.TextType;
						public static H5: org.nativescript.mason.masonkit.enums.TextType;
						public static H6: org.nativescript.mason.masonkit.enums.TextType;
						public static Li: org.nativescript.mason.masonkit.enums.TextType;
						public static Blockquote: org.nativescript.mason.masonkit.enums.TextType;
						public static B: org.nativescript.mason.masonkit.enums.TextType;
						public static Pre: org.nativescript.mason.masonkit.enums.TextType;
						public static Strong: org.nativescript.mason.masonkit.enums.TextType;
						public static Em: org.nativescript.mason.masonkit.enums.TextType;
						public static I: org.nativescript.mason.masonkit.enums.TextType;
						public static A: org.nativescript.mason.masonkit.enums.TextType;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.TextType>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.TextType;
						public static getEntries(): any;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module TextType {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextType.Companion>;
							public from(value: number): org.nativescript.mason.masonkit.enums.TextType;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module TextType {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.TextType.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export class VerticalAlign {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.VerticalAlign>;
						public static Baseline: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Length: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Percent: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Sub: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Super: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Top: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static TextTop: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Middle: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static Bottom: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static TextBottom: org.nativescript.mason.masonkit.enums.VerticalAlign;
						public getType(): number;
						public getValue(): number;
						public getCssValue(): string;
						public static values(): androidNative.Array<org.nativescript.mason.masonkit.enums.VerticalAlign>;
						public static valueOf(value: string): org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static getEntries(): any;
						public static fromTypeValue(type: number, isPercent: boolean, value: number): org.nativescript.mason.masonkit.enums.VerticalAlign | null;
						public static length(value: number): org.nativescript.mason.masonkit.enums.VerticalAlign;
						public static percent(value: number): org.nativescript.mason.masonkit.enums.VerticalAlign;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module VerticalAlign {
						export class Companion {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.VerticalAlign.Companion>;
							public fromTypeValue($this$fromTypeValue_u24lambda_u240: number, param1: boolean, $this$fromTypeValue_u24lambda_u241: number): org.nativescript.mason.masonkit.enums.VerticalAlign | null;
							public length($this$length_u24lambda_u242: number): org.nativescript.mason.masonkit.enums.VerticalAlign;
							public percent($this$percent_u24lambda_u243: number): org.nativescript.mason.masonkit.enums.VerticalAlign;
						}
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module enums {
					export module VerticalAlign {
						export class WhenMappings {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.enums.VerticalAlign.WhenMappings>;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module events {
					export class Event {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.events.Event>;
						public constructor(type: string, options: org.nativescript.mason.masonkit.events.EventOptions | null);
						public getType(): string;
						public getBubbles(): boolean;
						public getCancelable(): boolean;
						public isComposing(): boolean;
						public getTimeStamp(): number;
						public getDefaultPrevented(): boolean;
						public getPropagationStopped(): boolean;
						public getImmediatePropagationStopped(): boolean;
						public getTarget(): org.nativescript.mason.masonkit.EventTarget | null;
						public getCurrentTarget(): org.nativescript.mason.masonkit.EventTarget | null;
						public preventDefault(): void;
						public stopPropagation(): void;
						public stopImmediatePropagation(): void;
					}
				}
			}
		}
	}
}
declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module events {
					export module Event {
						export class InputType {
							public static class: java.lang.Class<org.nativescript.mason.masonkit.events.Event.InputType>;
							public static InsertText: org.nativescript.mason.masonkit.events.Event.InputType;
							public static DeleteContentBackward: org.nativescript.mason.masonkit.events.Event.InputType;
							public static DeleteContentForward: org.nativescript.mason.masonkit.events.Event.InputType;
							public static InsertLineBreak: org.nativescript.mason.masonkit.events.Event.InputType;
							public static InsertReplacementText: org.nativescript.mason.masonkit.events.Event.InputType;
							public static HistoryUndo: org.nativescript.mason.masonkit.events.Event.InputType;
							public static HistoryRedo: org.nativescript.mason.masonkit.events.Event.InputType;
							public static InsertCompositionText: org.nativescript.mason.masonkit.events.Event.InputType;
							public static DeleteCompositionText: org.nativescript.mason.masonkit.events.Event.InputType;
							public static InsertFromPaste: org.nativescript.mason.masonkit.events.Event.InputType;
							public getValue(): string;
							public static values(): androidNative.Array<org.nativescript.mason.masonkit.events.Event.InputType>;
							public static valueOf(value: string): org.nativescript.mason.masonkit.events.Event.InputType;
							public static getEntries(): any;
						}
					}
				}
			}
		}
	}
}

declare module org {
	export module nativescript {
		export module mason {
			export module masonkit {
				export module events {
					export class EventOptions {
						public static class: java.lang.Class<org.nativescript.mason.masonkit.events.EventOptions>;
						public constructor();
						public getType(): string;
						public setType(param0: string): void;
						public getBubbles(): boolean;
						public setBubbles(param0: boolean): void;
						public getCancelable(): boolean;
						public setCancelable(param0: boolean): void;
						public isComposing(): boolean;
						public setComposing(param0: boolean): void;
						public getTarget(): any;
						public setTarget(param0: any): void;
					}
				}
			}
		}
	}
}

//Generics information:
//org.nativescript.mason.masonkit.Line:1
//org.nativescript.mason.masonkit.Point:1
//org.nativescript.mason.masonkit.Rect:1
//org.nativescript.mason.masonkit.Size:1

