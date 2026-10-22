
declare class SDAnimatedImage extends UIImage implements SDAnimatedImageProtocol {

	static alloc(): SDAnimatedImage; // inherited from NSObject

	static new(): SDAnimatedImage; // inherited from NSObject

	static objectWithItemProviderDataTypeIdentifierError(data: NSData, typeIdentifier: string, error?: interop.Reference<NSError>): SDAnimatedImage; // inherited from NSItemProviderReading

	readonly animatedImageFormat: number;

	readonly allFramesLoaded: boolean; // inherited from SDAnimatedImageProtocol

	readonly animatedCoder: SDAnimatedImageCoder | null; // inherited from SDAnimatedImageProtocol

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { animatedCoder: SDAnimatedImageCoder; scale: number; }); // inherited from SDAnimatedImageProtocol

	constructor(o: { data: NSData; scale: number; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageProtocol

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithAnimatedCoderScale(animatedCoder: SDAnimatedImageCoder, scale: number): this;

	initWithDataScaleOptions(data: NSData, scale: number, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	preloadAllFrames(): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	unloadAllFrames(): void;
}

interface SDAnimatedImageCoder extends SDAnimatedImageProvider, SDImageCoder {

	initWithAnimatedImageDataOptions?(data: NSData | null, options: NSDictionary<string, any> | null): SDAnimatedImageCoder;
}
declare var SDAnimatedImageCoder: {

	prototype: SDAnimatedImageCoder;
};

declare const enum SDAnimatedImagePlaybackMode {

	Normal = 0,

	Reverse = 1,

	Bounce = 2,

	ReversedBounce = 3
}

declare class SDAnimatedImagePlayer extends NSObject {

	static alloc(): SDAnimatedImagePlayer; // inherited from NSObject

	static new(): SDAnimatedImagePlayer; // inherited from NSObject

	static playerWithProvider(provider: SDAnimatedImageProvider): SDAnimatedImagePlayer;

	animationFrameHandler: (p1: number, p2: UIImage) => void | null;

	animationLoopHandler: (p1: number) => void | null;

	readonly currentFrame: UIImage | null;

	readonly currentFrameIndex: number;

	readonly currentLoopCount: number;

	readonly isPlaying: boolean;

	maxBufferSize: number;

	playbackMode: SDAnimatedImagePlaybackMode;

	playbackRate: number;

	runLoopMode: string;

	totalFrameCount: number;

	totalLoopCount: number;

	constructor(o: { provider: SDAnimatedImageProvider; });

	clearFrameBuffer(): void;

	initWithProvider(provider: SDAnimatedImageProvider): this;

	pausePlaying(): void;

	seekToFrameAtIndexLoopCount(index: number, loopCount: number): void;

	startPlaying(): void;

	stopPlaying(): void;
}

interface SDAnimatedImageProtocol extends SDAnimatedImageProvider {

	allFramesLoaded?: boolean;

	animatedCoder?: SDAnimatedImageCoder | null;

	initWithAnimatedCoderScale?(animatedCoder: SDAnimatedImageCoder, scale: number): SDAnimatedImageProtocol;

	initWithDataScaleOptions?(data: NSData, scale: number, options: NSDictionary<string, any> | null): SDAnimatedImageProtocol;

	preloadAllFrames?(): void;

	unloadAllFrames?(): void;
}
declare var SDAnimatedImageProtocol: {

	prototype: SDAnimatedImageProtocol;
};

interface SDAnimatedImageProvider extends NSObjectProtocol {

	animatedImageData: NSData | null;

	animatedImageFrameCount: number;

	animatedImageLoopCount: number;

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;
}
declare var SDAnimatedImageProvider: {

	prototype: SDAnimatedImageProvider;
};

declare class SDAnimatedImageView extends UIImageView {

	static alloc(): SDAnimatedImageView; // inherited from NSObject

	static appearance(): SDAnimatedImageView; // inherited from UIAppearance

	/**
	 * @since 8.0
	 */
	static appearanceForTraitCollection(trait: UITraitCollection): SDAnimatedImageView; // inherited from UIAppearance

	/**
	 * @since 8.0
	 * @deprecated 9.0
	 */
	static appearanceForTraitCollectionWhenContainedIn(trait: UITraitCollection, ContainerClass: typeof NSObject | null): SDAnimatedImageView; // inherited from UIAppearance

	/**
	 * @since 9.0
	 */
	static appearanceForTraitCollectionWhenContainedInInstancesOfClasses(trait: UITraitCollection, containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SDAnimatedImageView; // inherited from UIAppearance

	/**
	 * @since 5.0
	 * @deprecated 9.0
	 */
	static appearanceWhenContainedIn(ContainerClass: typeof NSObject | null): SDAnimatedImageView; // inherited from UIAppearance

	/**
	 * @since 9.0
	 */
	static appearanceWhenContainedInInstancesOfClasses(containerTypes: NSArray<typeof NSObject> | typeof NSObject[]): SDAnimatedImageView; // inherited from UIAppearance

	static new(): SDAnimatedImageView; // inherited from NSObject

	animationTransformer: SDImageTransformer | null;

	autoPlayAnimatedImage: boolean;

	clearBufferWhenStopped: boolean;

	readonly currentFrame: UIImage | null;

	readonly currentFrameIndex: number;

	readonly currentLoopCount: number;

	maxBufferSize: number;

	playbackMode: SDAnimatedImagePlaybackMode;

	playbackRate: number;

	readonly player: SDAnimatedImagePlayer | null;

	resetFrameIndexWhenStopped: boolean;

	runLoopMode: string;

	shouldCustomLoopCount: boolean;

	shouldIncrementalLoad: boolean;
}

declare const enum SDCallbackPolicy {

	SafeExecute = 0,

	Dispatch = 1,

	Invoke = 2,

	SafeAsyncMainThread = 3
}

declare class SDCallbackQueue extends NSObject {

	static alloc(): SDCallbackQueue; // inherited from NSObject

	static new(): SDCallbackQueue; // inherited from NSObject

	policy: SDCallbackPolicy;

	static readonly currentQueue: SDCallbackQueue;

	static readonly globalQueue: SDCallbackQueue;

	static readonly mainQueue: SDCallbackQueue;

	constructor(o: { dispatchQueue: NSObject & OS_dispatch_queue; });

	async(block: () => void): void;

	initWithDispatchQueue(queue: NSObject & OS_dispatch_queue): this;

	/**
	 * @since 8.0
	 * @deprecated 8.0
	 */
	sync(block: () => void): void;
}

declare class SDDiskCache extends NSObject implements SDDiskCacheProtocol {

	static alloc(): SDDiskCache; // inherited from NSObject

	static new(): SDDiskCache; // inherited from NSObject

	readonly config: SDImageCacheConfig;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { cachePath: string; config: SDImageCacheConfig; }); // inherited from SDDiskCacheProtocol

	cachePathForKey(key: string): string | null;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	containsDataForKey(key: string): boolean;

	dataForKey(key: string): NSData | null;

	extendedDataForKey(key: string): NSData | null;

	initWithCachePathConfig(cachePath: string, config: SDImageCacheConfig): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	moveCacheDirectoryFromPathToPath(srcPath: string, dstPath: string): void;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	removeAllData(): void;

	removeDataForKey(key: string): void;

	removeExpiredData(): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	setDataForKey(data: NSData | null, key: string): void;

	setExtendedDataForKey(extendedData: NSData | null, key: string): void;

	totalCount(): number;

	totalSize(): number;
}

interface SDDiskCacheProtocol extends NSObjectProtocol {

	cachePathForKey(key: string): string | null;

	containsDataForKey(key: string): boolean;

	dataForKey(key: string): NSData | null;

	extendedDataForKey(key: string): NSData | null;

	initWithCachePathConfig?(cachePath: string, config: SDImageCacheConfig): SDDiskCacheProtocol;

	removeAllData(): void;

	removeDataForKey(key: string): void;

	removeExpiredData(): void;

	setDataForKey(data: NSData | null, key: string): void;

	setExtendedDataForKey(extendedData: NSData | null, key: string): void;

	totalCount(): number;

	totalSize(): number;
}
declare var SDDiskCacheProtocol: {

	prototype: SDDiskCacheProtocol;
};

declare function SDGetDecodeOptionsFromContext(context: NSDictionary<string, any> | null, options: SDWebImageOptions, cacheKey: string): NSDictionary<string, any>;

declare function SDGraphicsBeginImageContext(size: CGSize): void;

declare function SDGraphicsBeginImageContextWithOptions(size: CGSize, opaque: boolean, scale: number): void;

declare function SDGraphicsEndImageContext(): void;

declare function SDGraphicsGetCurrentContext(): any | null;

declare function SDGraphicsGetImageFromCurrentImageContext(): UIImage | null;

declare class SDGraphicsImageRenderer extends NSObject {

	static alloc(): SDGraphicsImageRenderer; // inherited from NSObject

	static new(): SDGraphicsImageRenderer; // inherited from NSObject

	constructor(o: { size: CGSize; });

	constructor(o: { size: CGSize; format: SDGraphicsImageRendererFormat; });

	imageWithActions(actions: (p1: any) => void): UIImage;

	initWithSize(size: CGSize): this;

	initWithSizeFormat(size: CGSize, format: SDGraphicsImageRendererFormat): this;
}

declare class SDGraphicsImageRendererFormat extends NSObject {

	static alloc(): SDGraphicsImageRendererFormat; // inherited from NSObject

	static new(): SDGraphicsImageRendererFormat; // inherited from NSObject

	static preferredFormat(): SDGraphicsImageRendererFormat;

	opaque: boolean;

	preferredRange: SDGraphicsImageRendererFormatRange;

	scale: number;

	/**
	 * @since 10.0
	 */
	uiformat: UIGraphicsImageRendererFormat;
}

declare const enum SDGraphicsImageRendererFormatRange {

	Unspecified = -1,

	Automatic = 0,

	Extended = 1,

	Standard = 2
}

declare class SDImageAPNGCoder extends SDImageIOAnimatedCoder implements SDAnimatedImageCoder, SDProgressiveImageCoder {

	static alloc(): SDImageAPNGCoder; // inherited from NSObject

	static new(): SDImageAPNGCoder; // inherited from NSObject

	static readonly sharedCoder: SDImageAPNGCoder;

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	constructor(o: { animatedImageData: NSData | null; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageCoder

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	initWithAnimatedImageDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

/**
 * @since 14.0
 */
declare class SDImageAWebPCoder extends SDImageIOAnimatedCoder implements SDAnimatedImageCoder, SDProgressiveImageCoder {

	static alloc(): SDImageAWebPCoder; // inherited from NSObject

	static new(): SDImageAWebPCoder; // inherited from NSObject

	static readonly sharedCoder: SDImageAWebPCoder;

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	constructor(o: { animatedImageData: NSData | null; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageCoder

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	initWithAnimatedImageDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

declare class SDImageBaseTransformer extends NSObject implements SDImageTransformer {

	static alloc(): SDImageBaseTransformer; // inherited from NSObject

	static new(): SDImageBaseTransformer; // inherited from NSObject

	preserveImageMetadata: boolean;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly transformerKey: string; // inherited from SDImageTransformer

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	transformedImageWithImageForKey(image: UIImage, key: string): UIImage | null;
}

declare class SDImageBlurTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageBlurTransformer; // inherited from NSObject

	static new(): SDImageBlurTransformer; // inherited from NSObject

	static transformerWithRadius(blurRadius: number): SDImageBlurTransformer;

	readonly blurRadius: number;
}

declare class SDImageCache extends NSObject implements SDImageCacheProtocol {

	static alloc(): SDImageCache; // inherited from NSObject

	static new(): SDImageCache; // inherited from NSObject

	additionalCachePathBlock: (p1: string) => string | null | null;

	readonly config: SDImageCacheConfig;

	readonly diskCache: SDDiskCacheProtocol;

	readonly diskCachePath: string;

	readonly memoryCache: SDMemoryCacheProtocol;

	static defaultDiskCacheDirectory: string;

	static readonly sharedImageCache: SDImageCache;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { namespace: string; });

	constructor(o: { namespace: string; diskCacheDirectory: string | null; });

	constructor(o: { namespace: string; diskCacheDirectory: string | null; config: SDImageCacheConfig | null; });

	cachePathForKey(key: string | null): string | null;

	calculateSizeWithCompletionBlock(completionBlock: (p1: number, p2: number) => void | null): void;

	class(): typeof NSObject;

	clearDiskOnCompletion(completion: () => void | null): void;

	clearMemory(): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	clearWithCacheTypeCompletion(cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	containsImageForKeyCacheTypeCompletion(key: string | null, cacheType: SDImageCacheType, completionBlock: (p1: SDImageCacheType) => void | null): void;

	deleteOldFilesWithCompletionBlock(completionBlock: () => void | null): void;

	diskImageDataExistsWithKey(key: string | null): boolean;

	diskImageDataForKey(key: string | null): NSData | null;

	diskImageDataQueryForKeyCompletion(key: string | null, completionBlock: (p1: NSData | null) => void | null): void;

	diskImageExistsWithKeyCompletion(key: string | null, completionBlock: (p1: boolean) => void | null): void;

	imageFromCacheForKey(key: string | null): UIImage | null;

	imageFromCacheForKeyOptionsContext(key: string | null, options: SDImageCacheOptions, context: NSDictionary<string, any> | null): UIImage | null;

	imageFromDiskCacheForKey(key: string | null): UIImage | null;

	imageFromDiskCacheForKeyOptionsContext(key: string | null, options: SDImageCacheOptions, context: NSDictionary<string, any> | null): UIImage | null;

	imageFromMemoryCacheForKey(key: string | null): UIImage | null;

	initWithNamespace(ns: string): this;

	initWithNamespaceDiskCacheDirectory(ns: string, directory: string | null): this;

	initWithNamespaceDiskCacheDirectoryConfig(ns: string, directory: string | null, config: SDImageCacheConfig | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	queryCacheOperationForKeyDone(key: string | null, doneBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDImageCacheToken | null;

	queryCacheOperationForKeyOptionsContextCacheTypeDone(key: string | null, options: SDImageCacheOptions, context: NSDictionary<string, any> | null, queryCacheType: SDImageCacheType, doneBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDImageCacheToken | null;

	queryCacheOperationForKeyOptionsContextDone(key: string | null, options: SDImageCacheOptions, context: NSDictionary<string, any> | null, doneBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDImageCacheToken | null;

	queryCacheOperationForKeyOptionsDone(key: string | null, options: SDImageCacheOptions, doneBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDImageCacheToken | null;

	queryImageForKeyOptionsContextCacheTypeCompletion(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	queryImageForKeyOptionsContextCompletion(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	removeImageForKeyCacheTypeCompletion(key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	removeImageForKeyFromDiskWithCompletion(key: string | null, fromDisk: boolean, completion: () => void | null): void;

	removeImageForKeyWithCompletion(key: string | null, completion: () => void | null): void;

	removeImageFromDiskForKey(key: string | null): void;

	removeImageFromMemoryForKey(key: string | null): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	storeImageDataForKeyCompletion(imageData: NSData | null, key: string | null, completionBlock: () => void | null): void;

	storeImageDataToDiskForKey(imageData: NSData | null, key: string | null): void;

	storeImageForKeyCompletion(image: UIImage | null, key: string | null, completionBlock: () => void | null): void;

	storeImageForKeyToDiskCompletion(image: UIImage | null, key: string | null, toDisk: boolean, completionBlock: () => void | null): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	storeImageImageDataForKeyCacheTypeCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	storeImageImageDataForKeyOptionsContextCacheTypeCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	storeImageImageDataForKeyToDiskCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, toDisk: boolean, completionBlock: () => void | null): void;

	storeImageToMemoryForKey(image: UIImage | null, key: string | null): void;

	totalDiskCount(): number;

	totalDiskSize(): number;
}

declare class SDImageCacheConfig extends NSObject implements NSCopying {

	static alloc(): SDImageCacheConfig; // inherited from NSObject

	static new(): SDImageCacheConfig; // inherited from NSObject

	diskCacheClass: typeof NSObject;

	diskCacheExpireType: SDImageCacheConfigExpireType;

	diskCacheReadingOptions: NSDataReadingOptions;

	diskCacheWritingOptions: NSDataWritingOptions;

	fileManager: NSFileManager | null;

	ioQueueAttributes: NSObject & OS_dispatch_queue_attr | null;

	maxDiskAge: number;

	maxDiskSize: number;

	maxMemoryCost: number;

	maxMemoryCount: number;

	memoryCacheClass: typeof NSObject;

	shouldCacheImagesInMemory: boolean;

	shouldDisableiCloud: boolean;

	shouldRemoveExpiredDataWhenEnterBackground: boolean;

	shouldRemoveExpiredDataWhenTerminate: boolean;

	shouldUseWeakMemoryCache: boolean;

	static readonly defaultCacheConfig: SDImageCacheConfig;

	copyWithZone(zone: interop.Pointer | interop.Reference<any> | ArrayBufferLike | ArrayBufferView | null): any;
}

declare const enum SDImageCacheConfigExpireType {

	AccessDate = 0,

	ModificationDate = 1,

	CreationDate = 2,

	ChangeDate = 3
}

declare function SDImageCacheDecodeImageData(imageData: NSData, cacheKey: string, options: SDWebImageOptions, context: NSDictionary<string, any> | null): UIImage | null;

declare const enum SDImageCacheOptions {

	QueryMemoryData = 1,

	QueryMemoryDataSync = 2,

	QueryDiskDataSync = 4,

	ScaleDownLargeImages = 8,

	AvoidDecodeImage = 16,

	DecodeFirstFrameOnly = 32,

	PreloadAllFrames = 64,

	MatchAnimatedImageClass = 128
}

interface SDImageCacheProtocol extends NSObjectProtocol {

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	clearWithCacheTypeCompletion?(cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	containsImageForKeyCacheTypeCompletion?(key: string | null, cacheType: SDImageCacheType, completionBlock: (p1: SDImageCacheType) => void | null): void;

	queryImageForKeyOptionsContextCacheTypeCompletion?(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	queryImageForKeyOptionsContextCompletion(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	removeImageForKeyCacheTypeCompletion?(key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	storeImageImageDataForKeyCacheTypeCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	storeImageImageDataForKeyOptionsContextCacheTypeCompletion?(image: UIImage | null, imageData: NSData | null, key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;
}
declare var SDImageCacheProtocol: {

	prototype: SDImageCacheProtocol;
};

declare class SDImageCacheToken extends NSObject implements SDWebImageOperation {

	static alloc(): SDImageCacheToken; // inherited from NSObject

	static new(): SDImageCacheToken; // inherited from NSObject

	readonly key: string | null;

	readonly cancelled: boolean; // inherited from SDWebImageOperation

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	cancel(): void;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare const enum SDImageCacheType {

	None = 0,

	Disk = 1,

	Memory = 2,

	All = 3
}

declare class SDImageCachesManager extends NSObject implements SDImageCacheProtocol {

	static alloc(): SDImageCachesManager; // inherited from NSObject

	static new(): SDImageCachesManager; // inherited from NSObject

	caches: NSArray<SDImageCacheProtocol> | null;

	clearOperationPolicy: SDImageCachesManagerOperationPolicy;

	containsOperationPolicy: SDImageCachesManagerOperationPolicy;

	queryOperationPolicy: SDImageCachesManagerOperationPolicy;

	removeOperationPolicy: SDImageCachesManagerOperationPolicy;

	storeOperationPolicy: SDImageCachesManagerOperationPolicy;

	static readonly sharedManager: SDImageCachesManager;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	addCache(cache: SDImageCacheProtocol): void;

	class(): typeof NSObject;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	clearWithCacheTypeCompletion(cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	containsImageForKeyCacheTypeCompletion(key: string | null, cacheType: SDImageCacheType, completionBlock: (p1: SDImageCacheType) => void | null): void;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	queryImageForKeyOptionsContextCacheTypeCompletion(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	queryImageForKeyOptionsContextCompletion(key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, completionBlock: (p1: UIImage | null, p2: NSData | null, p3: SDImageCacheType) => void | null): SDWebImageOperation | null;

	removeCache(cache: SDImageCacheProtocol): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	removeImageForKeyCacheTypeCompletion(key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	storeImageImageDataForKeyCacheTypeCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;

	storeImageImageDataForKeyOptionsContextCacheTypeCompletion(image: UIImage | null, imageData: NSData | null, key: string | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, cacheType: SDImageCacheType, completionBlock: () => void | null): void;
}

declare const enum SDImageCachesManagerOperationPolicy {

	Serial = 0,

	Concurrent = 1,

	HighestOnly = 2,

	LowestOnly = 3
}

interface SDImageCoder extends NSObjectProtocol {

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions?(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;
}
declare var SDImageCoder: {

	prototype: SDImageCoder;
};

declare var SDImageCoderDecodeFileExtensionHint: string;

declare var SDImageCoderDecodeFirstFrameOnly: string;

declare var SDImageCoderDecodePreserveAspectRatio: string;

declare var SDImageCoderDecodeScaleDownLimitBytes: string;

declare var SDImageCoderDecodeScaleFactor: string;

declare const enum SDImageCoderDecodeSolution {

	Automatic = 0,

	CoreGraphics = 1,

	UIKit = 2
}

declare var SDImageCoderDecodeThumbnailPixelSize: string;

declare var SDImageCoderDecodeToHDR: string;

declare var SDImageCoderDecodeTypeIdentifierHint: string;

declare var SDImageCoderDecodeUseLazyDecoding: string;

declare var SDImageCoderEncodeBackgroundColor: string;

declare var SDImageCoderEncodeCompressionQuality: string;

declare var SDImageCoderEncodeEmbedThumbnail: string;

declare var SDImageCoderEncodeFirstFrameOnly: string;

declare var SDImageCoderEncodeMaxFileSize: string;

declare var SDImageCoderEncodeMaxPixelSize: string;

declare var SDImageCoderEncodeToHDR: string;

declare class SDImageCoderHelper extends NSObject {

	static CGImageContainsAlpha(cgImage: any): boolean;

	static CGImageCreateDecoded(cgImage: any): any | null;

	static CGImageCreateDecodedOrientation(cgImage: any, orientation: CGImagePropertyOrientation): any | null;

	static CGImageCreateScaledSize(cgImage: any, size: CGSize): any | null;

	static CGImageIsHDR(cgImage: any): boolean;

	static CGImageIsHardwareSupported(cgImage: any): boolean;

	static CGImageIsLazy(cgImage: any): boolean;

	static alloc(): SDImageCoderHelper; // inherited from NSObject

	static animatedImageWithFrames(frames: NSArray<SDImageFrame> | SDImageFrame[] | null): UIImage | null;

	static colorSpaceGetDeviceRGB(): any;

	static decodedAndScaledDownImageWithImageLimitBytes(image: UIImage | null, bytes: number): UIImage | null;

	static decodedAndScaledDownImageWithImageLimitBytesPolicy(image: UIImage | null, bytes: number, policy: SDImageForceDecodePolicy): UIImage | null;

	static decodedImageWithImage(image: UIImage | null): UIImage | null;

	static decodedImageWithImagePolicy(image: UIImage | null, policy: SDImageForceDecodePolicy): UIImage | null;

	static exifOrientationFromImageOrientation(imageOrientation: UIImageOrientation): CGImagePropertyOrientation;

	static framesFromAnimatedImage(animatedImage: UIImage | null): NSArray<SDImageFrame> | null;

	static imageOrientationFromEXIFOrientation(exifOrientation: CGImagePropertyOrientation): UIImageOrientation;

	static new(): SDImageCoderHelper; // inherited from NSObject

	static preferredPixelFormat(containsAlpha: boolean): SDImagePixelFormat;

	static scaledSizeWithImageSizeLimitBytesBytesPerPixelFrameCount(imageSize: CGSize, limitBytes: number, bytesPerPixel: number, frameCount: number): CGSize;

	static scaledSizeWithImageSizeScaleSizePreserveAspectRatioShouldScaleUp(imageSize: CGSize, scaleSize: CGSize, preserveAspectRatio: boolean, shouldScaleUp: boolean): CGSize;

	static defaultDecodeSolution: SDImageCoderDecodeSolution;

	static defaultScaleDownLimitBytes: number;
}

/**
 * @since 8.0
 * @deprecated 8.0
 */
declare var SDImageCoderWebImageContext: string;

declare class SDImageCodersManager extends NSObject implements SDImageCoder {

	static alloc(): SDImageCodersManager; // inherited from NSObject

	static new(): SDImageCodersManager; // inherited from NSObject

	coders: NSArray<SDImageCoder> | null;

	static readonly sharedManager: SDImageCodersManager;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	addCoder(coder: SDImageCoder): void;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	removeCoder(coder: SDImageCoder): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare class SDImageCroppingTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageCroppingTransformer; // inherited from NSObject

	static new(): SDImageCroppingTransformer; // inherited from NSObject

	static transformerWithRect(rect: CGRect): SDImageCroppingTransformer;

	readonly rect: CGRect;
}

declare class SDImageFilterTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageFilterTransformer; // inherited from NSObject

	static new(): SDImageFilterTransformer; // inherited from NSObject

	static transformerWithFilter(filter: CIFilter): SDImageFilterTransformer;

	readonly filter: CIFilter;
}

declare class SDImageFlippingTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageFlippingTransformer; // inherited from NSObject

	static new(): SDImageFlippingTransformer; // inherited from NSObject

	static transformerWithHorizontalVertical(horizontal: boolean, vertical: boolean): SDImageFlippingTransformer;

	readonly horizontal: boolean;

	readonly vertical: boolean;
}

declare const enum SDImageForceDecodePolicy {

	Automatic = 0,

	Never = 1,

	Always = 2
}

declare var SDImageFormatBMP: number;

declare var SDImageFormatGIF: number;

declare var SDImageFormatHEIC: number;

declare var SDImageFormatHEIF: number;

declare var SDImageFormatJPEG: number;

declare var SDImageFormatPDF: number;

declare var SDImageFormatPNG: number;

declare var SDImageFormatRAW: number;

declare var SDImageFormatSVG: number;

declare var SDImageFormatTIFF: number;

declare var SDImageFormatUndefined: number;

declare var SDImageFormatWebP: number;

declare class SDImageFrame extends NSObject {

	static alloc(): SDImageFrame; // inherited from NSObject

	static frameWithImageDuration(image: UIImage, duration: number): SDImageFrame;

	static new(): SDImageFrame; // inherited from NSObject

	readonly duration: number;

	readonly image: UIImage;

	constructor(o: { image: UIImage; duration: number; });

	initWithImageDuration(image: UIImage, duration: number): this;
}

declare class SDImageGIFCoder extends SDImageIOAnimatedCoder implements SDAnimatedImageCoder, SDProgressiveImageCoder {

	static alloc(): SDImageGIFCoder; // inherited from NSObject

	static new(): SDImageGIFCoder; // inherited from NSObject

	static readonly sharedCoder: SDImageGIFCoder;

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	constructor(o: { animatedImageData: NSData | null; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageCoder

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	initWithAnimatedImageDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

declare const enum SDImageHDRType {

	SDR = 0,

	ISOHDR = 1,

	ISOGainMap = 2
}

/**
 * @since 13.0
 */
declare class SDImageHEICCoder extends SDImageIOAnimatedCoder implements SDAnimatedImageCoder, SDProgressiveImageCoder {

	static alloc(): SDImageHEICCoder; // inherited from NSObject

	static new(): SDImageHEICCoder; // inherited from NSObject

	static readonly sharedCoder: SDImageHEICCoder;

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	constructor(o: { animatedImageData: NSData | null; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageCoder

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	initWithAnimatedImageDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

declare class SDImageIOAnimatedCoder extends NSObject implements SDAnimatedImageCoder, SDProgressiveImageCoder {

	static alloc(): SDImageIOAnimatedCoder; // inherited from NSObject

	static new(): SDImageIOAnimatedCoder; // inherited from NSObject

	static readonly animatedImageUTType: string;

	static readonly defaultLoopCount: number;

	static readonly delayTimeProperty: string;

	static readonly dictionaryProperty: string;

	static readonly imageFormat: number;

	static readonly imageUTType: string;

	static readonly loopCountProperty: string;

	static readonly unclampedDelayTimeProperty: string;

	readonly animatedImageData: NSData | null; // inherited from SDAnimatedImageProvider

	readonly animatedImageFrameCount: number; // inherited from SDAnimatedImageProvider

	readonly animatedImageLoopCount: number; // inherited from SDAnimatedImageProvider

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	constructor(o: { animatedImageData: NSData | null; options: NSDictionary<string, any> | null; }); // inherited from SDAnimatedImageCoder

	animatedImageDurationAtIndex(index: number): number;

	animatedImageFrameAtIndex(index: number): UIImage | null;

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	initWithAnimatedImageDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

declare class SDImageIOCoder extends NSObject implements SDProgressiveImageCoder {

	static alloc(): SDImageIOCoder; // inherited from NSObject

	static new(): SDImageIOCoder; // inherited from NSObject

	static readonly sharedCoder: SDImageIOCoder;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { incrementalWithOptions: NSDictionary<string, any> | null; }); // inherited from SDProgressiveImageCoder

	canDecodeFromData(data: NSData | null): boolean;

	canEncodeToFormat(format: number): boolean;

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decodedImageWithDataOptions(data: NSData | null, options: NSDictionary<string, any> | null): UIImage | null;

	encodedDataWithFramesLoopCountFormatOptions(frames: NSArray<SDImageFrame> | SDImageFrame[], loopCount: number, format: number, options: NSDictionary<string, any> | null): NSData | null;

	encodedDataWithImageFormatOptions(image: UIImage | null, format: number, options: NSDictionary<string, any> | null): NSData | null;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions(options: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}

interface SDImageLoader extends NSObjectProtocol {

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	canRequestImageForURL(url: NSURL | null): boolean;

	canRequestImageForURLOptionsContext?(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;

	requestImageWithURLOptionsContextProgressCompleted(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageOperation | null;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	shouldBlockFailedURLWithURLError(url: NSURL, error: NSError): boolean;

	shouldBlockFailedURLWithURLErrorOptionsContext?(url: NSURL, error: NSError, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;
}
declare var SDImageLoader: {

	prototype: SDImageLoader;
};

declare function SDImageLoaderDecodeImageData(imageData: NSData, imageURL: NSURL, options: SDWebImageOptions, context: NSDictionary<string, any> | null): UIImage | null;

declare function SDImageLoaderDecodeProgressiveImageData(imageData: NSData, imageURL: NSURL, finished: boolean, operation: SDWebImageOperation, options: SDWebImageOptions, context: NSDictionary<string, any> | null): UIImage | null;

declare function SDImageLoaderGetProgressiveCoder(operation: SDWebImageOperation): SDProgressiveImageCoder | null;

declare function SDImageLoaderSetProgressiveCoder(operation: SDWebImageOperation, progressiveCoder: SDProgressiveImageCoder | null): void;

declare class SDImageLoadersManager extends NSObject implements SDImageLoader {

	static alloc(): SDImageLoadersManager; // inherited from NSObject

	static new(): SDImageLoadersManager; // inherited from NSObject

	loaders: NSArray<SDImageLoader> | null;

	static readonly sharedManager: SDImageLoadersManager;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	addLoader(loader: SDImageLoader): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	canRequestImageForURL(url: NSURL | null): boolean;

	canRequestImageForURLOptionsContext(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	removeLoader(loader: SDImageLoader): void;

	requestImageWithURLOptionsContextProgressCompleted(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageOperation | null;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	shouldBlockFailedURLWithURLError(url: NSURL, error: NSError): boolean;

	shouldBlockFailedURLWithURLErrorOptionsContext(url: NSURL, error: NSError, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;
}

declare class SDImagePipelineTransformer extends NSObject implements SDImageTransformer {

	static alloc(): SDImagePipelineTransformer; // inherited from NSObject

	static new(): SDImagePipelineTransformer; // inherited from NSObject

	static transformerWithTransformers(transformers: NSArray<SDImageTransformer> | SDImageTransformer[]): SDImagePipelineTransformer;

	readonly transformers: NSArray<SDImageTransformer>;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly preserveImageMetadata: boolean; // inherited from SDImageTransformer

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly transformerKey: string; // inherited from SDImageTransformer

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	transformedImageWithImageForKey(image: UIImage, key: string): UIImage | null;
}

interface SDImagePixelFormat {
	bitmapInfo: CGBitmapInfo;
	alignment: number;
}
declare var SDImagePixelFormat: interop.StructType<SDImagePixelFormat>;

declare class SDImageResizingTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageResizingTransformer; // inherited from NSObject

	static new(): SDImageResizingTransformer; // inherited from NSObject

	static transformerWithSizeScaleMode(size: CGSize, scaleMode: SDImageScaleMode): SDImageResizingTransformer;

	readonly scaleMode: SDImageScaleMode;

	readonly size: CGSize;
}

declare class SDImageRotationTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageRotationTransformer; // inherited from NSObject

	static new(): SDImageRotationTransformer; // inherited from NSObject

	static transformerWithAngleFitSize(angle: number, fitSize: boolean): SDImageRotationTransformer;

	readonly angle: number;

	readonly fitSize: boolean;
}

declare class SDImageRoundCornerTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageRoundCornerTransformer; // inherited from NSObject

	static new(): SDImageRoundCornerTransformer; // inherited from NSObject

	static transformerWithRadiusCornersBorderWidthBorderColor(cornerRadius: number, corners: UIRectCorner, borderWidth: number, borderColor: UIColor | null): SDImageRoundCornerTransformer;

	readonly borderColor: UIColor | null;

	readonly borderWidth: number;

	readonly cornerRadius: number;

	readonly corners: UIRectCorner;
}

declare function SDImageScaleFactorForKey(key: string | null): number;

declare const enum SDImageScaleMode {

	Fill = 0,

	AspectFit = 1,

	AspectFill = 2
}

declare class SDImageTintTransformer extends SDImageBaseTransformer {

	static alloc(): SDImageTintTransformer; // inherited from NSObject

	static new(): SDImageTintTransformer; // inherited from NSObject

	static transformerWithColor(tintColor: UIColor): SDImageTintTransformer;

	static transformerWithColorBlendMode(tintColor: UIColor, blendMode: CGBlendMode): SDImageTintTransformer;

	readonly blendMode: CGBlendMode;

	readonly tintColor: UIColor;
}

interface SDImageTransformer extends NSObjectProtocol {

	preserveImageMetadata?: boolean;

	transformerKey: string;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	transformedImageWithImageForKey(image: UIImage, key: string): UIImage | null;
}
declare var SDImageTransformer: {

	prototype: SDImageTransformer;
};

declare class SDMemoryCache<KeyType, ObjectType> extends NSCache<any, any> implements SDMemoryCacheProtocol {

	static alloc<KeyType, ObjectType>(): SDMemoryCache<KeyType, ObjectType>; // inherited from NSObject

	static new<KeyType, ObjectType>(): SDMemoryCache<KeyType, ObjectType>; // inherited from NSObject

	readonly config: SDImageCacheConfig;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { config: SDImageCacheConfig; }); // inherited from SDMemoryCacheProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithConfig(config: SDImageCacheConfig): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	objectForKey(key: any): any | null;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	removeAllObjects(): void;

	removeObjectForKey(key: any): void;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	setObjectForKey(object: any | null, key: any): void;

	setObjectForKeyCost(object: any | null, key: any, cost: number): void;
}

interface SDMemoryCacheProtocol extends NSObjectProtocol {

	initWithConfig?(config: SDImageCacheConfig): SDMemoryCacheProtocol;

	objectForKey(key: any): any | null;

	removeAllObjects(): void;

	removeObjectForKey(key: any): void;

	setObjectForKey(object: any | null, key: any): void;

	setObjectForKeyCost(object: any | null, key: any, cost: number): void;
}
declare var SDMemoryCacheProtocol: {

	prototype: SDMemoryCacheProtocol;
};

interface SDProgressiveImageCoder extends SDImageCoder {

	canIncrementalDecodeFromData(data: NSData | null): boolean;

	incrementalDecodedImageWithOptions(options: NSDictionary<string, any> | null): UIImage | null;

	initIncrementalWithOptions?(options: NSDictionary<string, any> | null): SDProgressiveImageCoder;

	updateIncrementalDataFinished(data: NSData | null, finished: boolean): void;
}
declare var SDProgressiveImageCoder: {

	prototype: SDProgressiveImageCoder;
};

declare function SDScaledImageForKey(key: string | null, image: UIImage | null): UIImage | null;

declare function SDScaledImageForScaleFactor(scale: number, image: UIImage | null): UIImage | null;

declare function SDSetDecodeOptionsToContext(mutableContext: NSMutableDictionary<string, any>, mutableOptions: interop.Pointer | interop.Reference<SDWebImageOptions> | ArrayBufferLike | ArrayBufferView, decodeOptions: NSDictionary<string, any>): void;

declare function SDThumbnailedKeyForKey(key: string | null, thumbnailPixelSize: CGSize, preserveAspectRatio: boolean): string | null;

declare function SDTransformedKeyForKey(key: string | null, transformerKey: string): string | null;

declare class SDWebImageActivityIndicator extends NSObject implements SDWebImageIndicator {

	static alloc(): SDWebImageActivityIndicator; // inherited from NSObject

	static new(): SDWebImageActivityIndicator; // inherited from NSObject

	readonly indicatorView: UIActivityIndicatorView;

	static readonly grayIndicator: SDWebImageActivityIndicator;

	static readonly grayLargeIndicator: SDWebImageActivityIndicator;

	static readonly largeIndicator: SDWebImageActivityIndicator;

	static readonly mediumIndicator: SDWebImageActivityIndicator;

	static readonly whiteIndicator: SDWebImageActivityIndicator;

	static readonly whiteLargeIndicator: SDWebImageActivityIndicator;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	startAnimatingIndicator(): void;

	stopAnimatingIndicator(): void;

	updateIndicatorProgress(progress: number): void;
}

declare class SDWebImageCacheKeyFilter extends NSObject implements SDWebImageCacheKeyFilterProtocol {

	static alloc(): SDWebImageCacheKeyFilter; // inherited from NSObject

	static cacheKeyFilterWithBlock(block: (p1: NSURL) => string | null): SDWebImageCacheKeyFilter;

	static new(): SDWebImageCacheKeyFilter; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: NSURL) => string | null; });

	cacheKeyForURL(url: NSURL): string | null;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithBlock(block: (p1: NSURL) => string | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageCacheKeyFilterProtocol extends NSObjectProtocol {

	cacheKeyForURL(url: NSURL): string | null;
}
declare var SDWebImageCacheKeyFilterProtocol: {

	prototype: SDWebImageCacheKeyFilterProtocol;
};

declare class SDWebImageCacheSerializer extends NSObject implements SDWebImageCacheSerializerProtocol {

	static alloc(): SDWebImageCacheSerializer; // inherited from NSObject

	static cacheSerializerWithBlock(block: (p1: UIImage, p2: NSData | null, p3: NSURL | null) => NSData | null): SDWebImageCacheSerializer;

	static new(): SDWebImageCacheSerializer; // inherited from NSObject

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: UIImage, p2: NSData | null, p3: NSURL | null) => NSData | null; });

	cacheDataWithImageOriginalDataImageURL(image: UIImage, data: NSData | null, imageURL: NSURL | null): NSData | null;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithBlock(block: (p1: UIImage, p2: NSData | null, p3: NSURL | null) => NSData | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageCacheSerializerProtocol extends NSObjectProtocol {

	cacheDataWithImageOriginalDataImageURL(image: UIImage, data: NSData | null, imageURL: NSURL | null): NSData | null;
}
declare var SDWebImageCacheSerializerProtocol: {

	prototype: SDWebImageCacheSerializerProtocol;
};

declare class SDWebImageCombinedOperation extends NSObject implements SDWebImageOperation {

	static alloc(): SDWebImageCombinedOperation; // inherited from NSObject

	static new(): SDWebImageCombinedOperation; // inherited from NSObject

	readonly cacheOperation: SDWebImageOperation | null;

	readonly loaderOperation: SDWebImageOperation | null;

	readonly cancelled: boolean; // inherited from SDWebImageOperation

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	cancel(): void;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare var SDWebImageContextAnimatedImageClass: string;

declare var SDWebImageContextCacheKeyFilter: string;

declare var SDWebImageContextCacheSerializer: string;

declare var SDWebImageContextCallbackQueue: string;

/**
 * @since 8.0
 * @deprecated 100000
 */
declare var SDWebImageContextCustomManager: string;

declare var SDWebImageContextDownloadDecryptor: string;

declare var SDWebImageContextDownloadRequestModifier: string;

declare var SDWebImageContextDownloadResponseModifier: string;

declare var SDWebImageContextImageCache: string;

declare var SDWebImageContextImageCoder: string;

declare var SDWebImageContextImageDecodeOptions: string;

declare var SDWebImageContextImageDecodeToHDR: string;

declare var SDWebImageContextImageEncodeOptions: string;

declare var SDWebImageContextImageForceDecodePolicy: string;

declare var SDWebImageContextImageLoader: string;

declare var SDWebImageContextImagePreserveAspectRatio: string;

declare var SDWebImageContextImageScaleDownLimitBytes: string;

declare var SDWebImageContextImageScaleFactor: string;

declare var SDWebImageContextImageThumbnailPixelSize: string;

declare var SDWebImageContextImageTransformer: string;

declare var SDWebImageContextImageTypeIdentifierHint: string;

declare var SDWebImageContextLoaderCachedImage: string;

declare var SDWebImageContextOriginalImageCache: string;

declare var SDWebImageContextOriginalQueryCacheType: string;

declare var SDWebImageContextOriginalStoreCacheType: string;

declare var SDWebImageContextQueryCacheType: string;

declare var SDWebImageContextSetImageOperationKey: string;

declare var SDWebImageContextStoreCacheType: string;

declare var SDWebImageDownloadFinishNotification: string;

declare var SDWebImageDownloadReceiveResponseNotification: string;

declare var SDWebImageDownloadStartNotification: string;

declare var SDWebImageDownloadStopNotification: string;

declare class SDWebImageDownloadToken extends NSObject implements SDWebImageOperation {

	static alloc(): SDWebImageDownloadToken; // inherited from NSObject

	static new(): SDWebImageDownloadToken; // inherited from NSObject

	/**
	 * @since 10.0
	 */
	readonly metrics: NSURLSessionTaskMetrics | null;

	readonly request: NSURLRequest | null;

	readonly response: NSURLResponse | null;

	readonly url: NSURL | null;

	readonly cancelled: boolean; // inherited from SDWebImageOperation

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	cancel(): void;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare class SDWebImageDownloader extends NSObject implements SDImageLoader {

	static alloc(): SDWebImageDownloader; // inherited from NSObject

	static new(): SDWebImageDownloader; // inherited from NSObject

	readonly config: SDWebImageDownloaderConfig;

	readonly currentDownloadCount: number;

	decryptor: SDWebImageDownloaderDecryptorProtocol | null;

	requestModifier: SDWebImageDownloaderRequestModifierProtocol | null;

	responseModifier: SDWebImageDownloaderResponseModifierProtocol | null;

	readonly sessionConfiguration: NSURLSessionConfiguration;

	suspended: boolean;

	static readonly sharedDownloader: SDWebImageDownloader;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { config: SDWebImageDownloaderConfig | null; });

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	canRequestImageForURL(url: NSURL | null): boolean;

	canRequestImageForURLOptionsContext(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;

	cancelAllDownloads(): void;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	downloadImageWithURLCompleted(url: NSURL | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageDownloadToken | null;

	downloadImageWithURLOptionsContextProgressCompleted(url: NSURL | null, options: SDWebImageDownloaderOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageDownloadToken | null;

	downloadImageWithURLOptionsProgressCompleted(url: NSURL | null, options: SDWebImageDownloaderOptions, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageDownloadToken | null;

	initWithConfig(config: SDWebImageDownloaderConfig | null): this;

	invalidateSessionAndCancel(cancelPendingOperations: boolean): void;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	requestImageWithURLOptionsContextProgressCompleted(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): SDWebImageOperation | null;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	setValueForHTTPHeaderField(value: string | null, field: string | null): void;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	shouldBlockFailedURLWithURLError(url: NSURL, error: NSError): boolean;

	shouldBlockFailedURLWithURLErrorOptionsContext(url: NSURL, error: NSError, options: SDWebImageOptions, context: NSDictionary<string, any> | null): boolean;

	valueForHTTPHeaderField(field: string | null): string | null;
}

declare class SDWebImageDownloaderConfig extends NSObject implements NSCopying {

	static alloc(): SDWebImageDownloaderConfig; // inherited from NSObject

	static new(): SDWebImageDownloaderConfig; // inherited from NSObject

	acceptableContentTypes: NSSet<string> | null;

	acceptableStatusCodes: NSIndexSet | null;

	downloadTimeout: number;

	executionOrder: SDWebImageDownloaderExecutionOrder;

	maxConcurrentDownloads: number;

	minimumProgressInterval: number;

	operationClass: typeof NSObject | null;

	password: string | null;

	sessionConfiguration: NSURLSessionConfiguration | null;

	urlCredential: NSURLCredential | null;

	username: string | null;

	static readonly defaultDownloaderConfig: SDWebImageDownloaderConfig;

	copyWithZone(zone: interop.Pointer | interop.Reference<any> | ArrayBufferLike | ArrayBufferView | null): any;
}

declare class SDWebImageDownloaderDecryptor extends NSObject implements SDWebImageDownloaderDecryptorProtocol {

	static alloc(): SDWebImageDownloaderDecryptor; // inherited from NSObject

	static decryptorWithBlock(block: (p1: NSData, p2: NSURLResponse | null) => NSData | null): SDWebImageDownloaderDecryptor;

	static new(): SDWebImageDownloaderDecryptor; // inherited from NSObject

	static readonly base64Decryptor: SDWebImageDownloaderDecryptor;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: NSData, p2: NSURLResponse | null) => NSData | null; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	decryptedDataWithDataResponse(data: NSData, response: NSURLResponse | null): NSData | null;

	initWithBlock(block: (p1: NSData, p2: NSURLResponse | null) => NSData | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageDownloaderDecryptorProtocol extends NSObjectProtocol {

	decryptedDataWithDataResponse(data: NSData, response: NSURLResponse | null): NSData | null;
}
declare var SDWebImageDownloaderDecryptorProtocol: {

	prototype: SDWebImageDownloaderDecryptorProtocol;
};

declare const enum SDWebImageDownloaderExecutionOrder {

	FIFOExecutionOrder = 0,

	LIFOExecutionOrder = 1
}

declare class SDWebImageDownloaderOperation extends NSOperation implements SDWebImageDownloaderOperationProtocol {

	static alloc(): SDWebImageDownloaderOperation; // inherited from NSObject

	static new(): SDWebImageDownloaderOperation; // inherited from NSObject

	readonly context: NSDictionary<string, any> | null;

	readonly options: SDWebImageDownloaderOptions;

	acceptableContentTypes: NSSet<string> | null; // inherited from SDWebImageDownloaderOperationProtocol

	acceptableStatusCodes: NSIndexSet | null; // inherited from SDWebImageDownloaderOperationProtocol

	credential: NSURLCredential | null; // inherited from SDWebImageDownloaderOperationProtocol

	readonly dataTask: NSURLSessionTask | null; // inherited from SDWebImageDownloaderOperationProtocol

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	/**
	 * @since 10.0
	 */
	readonly metrics: NSURLSessionTaskMetrics | null; // inherited from SDWebImageDownloaderOperationProtocol

	minimumProgressInterval: number; // inherited from SDWebImageDownloaderOperationProtocol

	readonly request: NSURLRequest | null; // inherited from SDWebImageDownloaderOperationProtocol

	readonly response: NSURLResponse | null; // inherited from SDWebImageDownloaderOperationProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { request: NSURLRequest | null; inSession: NSURLSession | null; options: SDWebImageDownloaderOptions; }); // inherited from SDWebImageDownloaderOperationProtocol

	constructor(o: { request: NSURLRequest | null; inSession: NSURLSession | null; options: SDWebImageDownloaderOptions; context: NSDictionary<string, any> | null; }); // inherited from SDWebImageDownloaderOperationProtocol

	URLSessionDataTaskDidBecomeDownloadTask(session: NSURLSession, dataTask: NSURLSessionDataTask, downloadTask: NSURLSessionDownloadTask): void;

	/**
	 * @since 9.0
	 */
	URLSessionDataTaskDidBecomeStreamTask(session: NSURLSession, dataTask: NSURLSessionDataTask, streamTask: NSURLSessionStreamTask): void;

	URLSessionDataTaskDidReceiveData(session: NSURLSession, dataTask: NSURLSessionDataTask, data: NSData): void;

	URLSessionDataTaskDidReceiveResponseCompletionHandler(session: NSURLSession, dataTask: NSURLSessionDataTask, response: NSURLResponse, completionHandler: (p1: NSURLSessionResponseDisposition) => void): void;

	URLSessionDataTaskWillCacheResponseCompletionHandler(session: NSURLSession, dataTask: NSURLSessionDataTask, proposedResponse: NSCachedURLResponse, completionHandler: (p1: NSCachedURLResponse | null) => void): void;

	URLSessionDidBecomeInvalidWithError(session: NSURLSession, error: NSError | null): void;

	/**
	 * @since 16.0
	 */
	URLSessionDidCreateTask(session: NSURLSession, task: NSURLSessionTask): void;

	/**
	 * @since 7.0
	 */
	URLSessionDidFinishEventsForBackgroundURLSession(session: NSURLSession): void;

	URLSessionDidReceiveChallengeCompletionHandler(session: NSURLSession, challenge: NSURLAuthenticationChallenge, completionHandler: (p1: NSURLSessionAuthChallengeDisposition, p2: NSURLCredential | null) => void): void;

	URLSessionTaskDidCompleteWithError(session: NSURLSession, task: NSURLSessionTask, error: NSError | null): void;

	/**
	 * @since 10.0
	 */
	URLSessionTaskDidFinishCollectingMetrics(session: NSURLSession, task: NSURLSessionTask, metrics: NSURLSessionTaskMetrics): void;

	URLSessionTaskDidReceiveChallengeCompletionHandler(session: NSURLSession, task: NSURLSessionTask, challenge: NSURLAuthenticationChallenge, completionHandler: (p1: NSURLSessionAuthChallengeDisposition, p2: NSURLCredential | null) => void): void;

	/**
	 * @since 17.0
	 */
	URLSessionTaskDidReceiveInformationalResponse(session: NSURLSession, task: NSURLSessionTask, response: NSHTTPURLResponse): void;

	URLSessionTaskDidSendBodyDataTotalBytesSentTotalBytesExpectedToSend(session: NSURLSession, task: NSURLSessionTask, bytesSent: number, totalBytesSent: number, totalBytesExpectedToSend: number): void;

	/**
	 * @since 11.0
	 */
	URLSessionTaskIsWaitingForConnectivity(session: NSURLSession, task: NSURLSessionTask): void;

	URLSessionTaskNeedNewBodyStream(session: NSURLSession, task: NSURLSessionTask, completionHandler: (p1: NSInputStream | null) => void): void;

	/**
	 * @since 17.0
	 */
	URLSessionTaskNeedNewBodyStreamFromOffsetCompletionHandler(session: NSURLSession, task: NSURLSessionTask, offset: number, completionHandler: (p1: NSInputStream | null) => void): void;

	/**
	 * @since 11.0
	 */
	URLSessionTaskWillBeginDelayedRequestCompletionHandler(session: NSURLSession, task: NSURLSessionTask, request: NSURLRequest, completionHandler: (p1: NSURLSessionDelayedRequestDisposition, p2: NSURLRequest | null) => void): void;

	URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler(session: NSURLSession, task: NSURLSessionTask, response: NSHTTPURLResponse, request: NSURLRequest, completionHandler: (p1: NSURLRequest | null) => void): void;

	addHandlersForProgressCompleted(progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): any | null;

	addHandlersForProgressCompletedDecodeOptions(progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null, decodeOptions: NSDictionary<string, any> | null): any | null;

	cancel(token: any | null): boolean;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithRequestInSessionOptions(request: NSURLRequest | null, session: NSURLSession | null, options: SDWebImageDownloaderOptions): this;

	initWithRequestInSessionOptionsContext(request: NSURLRequest | null, session: NSURLSession | null, options: SDWebImageDownloaderOptions, context: NSDictionary<string, any> | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageDownloaderOperationProtocol extends NSURLSessionDataDelegate, NSURLSessionTaskDelegate {

	acceptableContentTypes?: NSSet<string> | null;

	acceptableStatusCodes?: NSIndexSet | null;

	credential?: NSURLCredential | null;

	dataTask?: NSURLSessionTask | null;

	/**
	 * @since 10.0
	 */
	metrics?: NSURLSessionTaskMetrics | null;

	minimumProgressInterval?: number;

	request: NSURLRequest | null;

	response: NSURLResponse | null;

	addHandlersForProgressCompleted(progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null): any | null;

	addHandlersForProgressCompletedDecodeOptions(progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: boolean) => void | null, decodeOptions: NSDictionary<string, any> | null): any | null;

	cancel(token: any | null): boolean;

	initWithRequestInSessionOptions?(request: NSURLRequest | null, session: NSURLSession | null, options: SDWebImageDownloaderOptions): SDWebImageDownloaderOperationProtocol;

	initWithRequestInSessionOptionsContext?(request: NSURLRequest | null, session: NSURLSession | null, options: SDWebImageDownloaderOptions, context: NSDictionary<string, any> | null): SDWebImageDownloaderOperationProtocol;
}
declare var SDWebImageDownloaderOperationProtocol: {

	prototype: SDWebImageDownloaderOperationProtocol;
};

declare const enum SDWebImageDownloaderOptions {

	LowPriority = 1,

	ProgressiveLoad = 2,

	UseNSURLCache = 4,

	IgnoreCachedResponse = 8,

	ContinueInBackground = 16,

	HandleCookies = 32,

	AllowInvalidSSLCertificates = 64,

	HighPriority = 128,

	ScaleDownLargeImages = 256,

	AvoidDecodeImage = 512,

	DecodeFirstFrameOnly = 1024,

	PreloadAllFrames = 2048,

	MatchAnimatedImageClass = 4096
}

declare class SDWebImageDownloaderRequestModifier extends NSObject implements SDWebImageDownloaderRequestModifierProtocol {

	static alloc(): SDWebImageDownloaderRequestModifier; // inherited from NSObject

	static new(): SDWebImageDownloaderRequestModifier; // inherited from NSObject

	static requestModifierWithBlock(block: (p1: NSURLRequest) => NSURLRequest | null): SDWebImageDownloaderRequestModifier;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: NSURLRequest) => NSURLRequest | null; });

	constructor(o: { body: NSData | null; });

	constructor(o: { headers: NSDictionary<string, string> | null; });

	constructor(o: { method: string | null; });

	constructor(o: { method: string | null; headers: NSDictionary<string, string> | null; body: NSData | null; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithBlock(block: (p1: NSURLRequest) => NSURLRequest | null): this;

	initWithBody(body: NSData | null): this;

	initWithHeaders(headers: NSDictionary<string, string> | null): this;

	initWithMethod(method: string | null): this;

	initWithMethodHeadersBody(method: string | null, headers: NSDictionary<string, string> | null, body: NSData | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	modifiedRequestWithRequest(request: NSURLRequest): NSURLRequest | null;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageDownloaderRequestModifierProtocol extends NSObjectProtocol {

	modifiedRequestWithRequest(request: NSURLRequest): NSURLRequest | null;
}
declare var SDWebImageDownloaderRequestModifierProtocol: {

	prototype: SDWebImageDownloaderRequestModifierProtocol;
};

declare class SDWebImageDownloaderResponseModifier extends NSObject implements SDWebImageDownloaderResponseModifierProtocol {

	static alloc(): SDWebImageDownloaderResponseModifier; // inherited from NSObject

	static new(): SDWebImageDownloaderResponseModifier; // inherited from NSObject

	static responseModifierWithBlock(block: (p1: NSURLResponse) => NSURLResponse | null): SDWebImageDownloaderResponseModifier;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: NSURLResponse) => NSURLResponse | null; });

	constructor(o: { headers: NSDictionary<string, string> | null; });

	constructor(o: { statusCode: number; });

	constructor(o: { statusCode: number; version: string | null; headers: NSDictionary<string, string> | null; });

	constructor(o: { version: string | null; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithBlock(block: (p1: NSURLResponse) => NSURLResponse | null): this;

	initWithHeaders(headers: NSDictionary<string, string> | null): this;

	initWithStatusCode(statusCode: number): this;

	initWithStatusCodeVersionHeaders(statusCode: number, version: string | null, headers: NSDictionary<string, string> | null): this;

	initWithVersion(version: string | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	modifiedResponseWithResponse(response: NSURLResponse): NSURLResponse | null;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageDownloaderResponseModifierProtocol extends NSObjectProtocol {

	modifiedResponseWithResponse(response: NSURLResponse): NSURLResponse | null;
}
declare var SDWebImageDownloaderResponseModifierProtocol: {

	prototype: SDWebImageDownloaderResponseModifierProtocol;
};

declare const enum SDWebImageError {

	InvalidURL = 1000,

	BadImageData = 1001,

	CacheNotModified = 1002,

	BlackListed = 1003,

	InvalidDownloadOperation = 2000,

	InvalidDownloadStatusCode = 2001,

	Cancelled = 2002,

	InvalidDownloadResponse = 2003,

	InvalidDownloadContentType = 2004
}

declare var SDWebImageErrorDomain: string;

declare var SDWebImageErrorDownloadContentTypeKey: string;

declare var SDWebImageErrorDownloadResponseKey: string;

declare var SDWebImageErrorDownloadStatusCodeKey: string;

interface SDWebImageIndicator extends NSObjectProtocol {

	indicatorView: UIView;

	startAnimatingIndicator(): void;

	stopAnimatingIndicator(): void;

	updateIndicatorProgress?(progress: number): void;
}
declare var SDWebImageIndicator: {

	prototype: SDWebImageIndicator;
};

declare class SDWebImageLoadState extends NSObject {

	static alloc(): SDWebImageLoadState; // inherited from NSObject

	static new(): SDWebImageLoadState; // inherited from NSObject

	progress: NSProgress | null;

	url: NSURL | null;
}

declare class SDWebImageManager extends NSObject {

	static alloc(): SDWebImageManager; // inherited from NSObject

	static new(): SDWebImageManager; // inherited from NSObject

	cacheKeyFilter: SDWebImageCacheKeyFilterProtocol | null;

	cacheSerializer: SDWebImageCacheSerializerProtocol | null;

	delegate: SDWebImageManagerDelegate | null;

	readonly imageCache: SDImageCacheProtocol;

	readonly imageLoader: SDImageLoader;

	optionsProcessor: SDWebImageOptionsProcessorProtocol | null;

	readonly running: boolean;

	transformer: SDImageTransformer | null;

	static defaultImageCache: SDImageCacheProtocol | null;

	static defaultImageLoader: SDImageLoader | null;

	static readonly sharedManager: SDWebImageManager;

	constructor(o: { cache: SDImageCacheProtocol; loader: SDImageLoader; });

	cacheKeyForURL(url: NSURL | null): string | null;

	cacheKeyForURLContext(url: NSURL | null, context: NSDictionary<string, any> | null): string | null;

	cancelAll(): void;

	initWithCacheLoader(cache: SDImageCacheProtocol, loader: SDImageLoader): this;

	loadImageWithURLOptionsContextProgressCompleted(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: SDImageCacheType, p5: boolean, p6: NSURL | null) => void): SDWebImageCombinedOperation | null;

	loadImageWithURLOptionsProgressCompleted(url: NSURL | null, options: SDWebImageOptions, progressBlock: (p1: number, p2: number, p3: NSURL | null) => void | null, completedBlock: (p1: UIImage | null, p2: NSData | null, p3: NSError | null, p4: SDImageCacheType, p5: boolean, p6: NSURL | null) => void): SDWebImageCombinedOperation | null;

	removeAllFailedURLs(): void;

	removeFailedURL(url: NSURL): void;
}

interface SDWebImageManagerDelegate extends NSObjectProtocol {

	imageManagerShouldBlockFailedURLWithError?(imageManager: SDWebImageManager, imageURL: NSURL, error: NSError): boolean;

	imageManagerShouldDownloadImageForURL?(imageManager: SDWebImageManager, imageURL: NSURL): boolean;
}
declare var SDWebImageManagerDelegate: {

	prototype: SDWebImageManagerDelegate;
};

interface SDWebImageOperation extends NSObjectProtocol {

	cancelled?: boolean;

	cancel(): void;
}
declare var SDWebImageOperation: {

	prototype: SDWebImageOperation;
};

declare const enum SDWebImageOptions {

	RetryFailed = 1,

	LowPriority = 2,

	ProgressiveLoad = 4,

	RefreshCached = 8,

	ContinueInBackground = 16,

	HandleCookies = 32,

	AllowInvalidSSLCertificates = 64,

	HighPriority = 128,

	DelayPlaceholder = 256,

	TransformAnimatedImage = 512,

	AvoidAutoSetImage = 1024,

	ScaleDownLargeImages = 2048,

	QueryMemoryData = 4096,

	QueryMemoryDataSync = 8192,

	QueryDiskDataSync = 16384,

	FromCacheOnly = 32768,

	FromLoaderOnly = 65536,

	ForceTransition = 131072,

	AvoidDecodeImage = 262144,

	DecodeFirstFrameOnly = 524288,

	PreloadAllFrames = 1048576,

	MatchAnimatedImageClass = 2097152,

	WaitStoreCache = 4194304,

	TransformVectorImage = 8388608,

	AvoidAutoCancelImage = 16777216,

	WaitTransition = 33554432
}

declare class SDWebImageOptionsProcessor extends NSObject implements SDWebImageOptionsProcessorProtocol {

	static alloc(): SDWebImageOptionsProcessor; // inherited from NSObject

	static new(): SDWebImageOptionsProcessor; // inherited from NSObject

	static optionsProcessorWithBlock(block: (p1: NSURL | null, p2: SDWebImageOptions, p3: NSDictionary<string, any> | null) => SDWebImageOptionsResult | null): SDWebImageOptionsProcessor;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	constructor(o: { block: (p1: NSURL | null, p2: SDWebImageOptions, p3: NSDictionary<string, any> | null) => SDWebImageOptionsResult | null; });

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	initWithBlock(block: (p1: NSURL | null, p2: SDWebImageOptions, p3: NSDictionary<string, any> | null) => SDWebImageOptionsResult | null): this;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	processedResultForURLOptionsContext(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null): SDWebImageOptionsResult | null;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

interface SDWebImageOptionsProcessorProtocol extends NSObjectProtocol {

	processedResultForURLOptionsContext(url: NSURL | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null): SDWebImageOptionsResult | null;
}
declare var SDWebImageOptionsProcessorProtocol: {

	prototype: SDWebImageOptionsProcessorProtocol;
};

declare class SDWebImageOptionsResult extends NSObject {

	static alloc(): SDWebImageOptionsResult; // inherited from NSObject

	static new(): SDWebImageOptionsResult; // inherited from NSObject

	readonly context: NSDictionary<string, any> | null;

	readonly options: SDWebImageOptions;

	constructor(o: { options: SDWebImageOptions; context: NSDictionary<string, any> | null; });

	initWithOptionsContext(options: SDWebImageOptions, context: NSDictionary<string, any> | null): this;
}

declare class SDWebImagePrefetchToken extends NSObject implements SDWebImageOperation {

	static alloc(): SDWebImagePrefetchToken; // inherited from NSObject

	static new(): SDWebImagePrefetchToken; // inherited from NSObject

	readonly urls: NSArray<NSURL> | null;

	readonly cancelled: boolean; // inherited from SDWebImageOperation

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	cancel(): void;

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;
}

declare class SDWebImagePrefetcher extends NSObject {

	static alloc(): SDWebImagePrefetcher; // inherited from NSObject

	static new(): SDWebImagePrefetcher; // inherited from NSObject

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	context: NSDictionary<string, any> | null;

	delegate: SDWebImagePrefetcherDelegate | null;

	/**
	 * @since 8.0
	 * @deprecated 8.0
	 */
	delegateQueue: NSObject & OS_dispatch_queue;

	readonly manager: SDWebImageManager;

	maxConcurrentPrefetchCount: number;

	/**
	 * @since 8.0
	 * @deprecated 100000
	 */
	options: SDWebImageOptions;

	static readonly sharedImagePrefetcher: SDWebImagePrefetcher;

	constructor(o: { imageManager: SDWebImageManager; });

	cancelPrefetching(): void;

	initWithImageManager(manager: SDWebImageManager): this;

	prefetchURLs(urls: NSArray<NSURL> | NSURL[] | null): SDWebImagePrefetchToken | null;

	prefetchURLsOptionsContextProgressCompleted(urls: NSArray<NSURL> | NSURL[] | null, options: SDWebImageOptions, context: NSDictionary<string, any> | null, progressBlock: (p1: number, p2: number) => void | null, completionBlock: (p1: number, p2: number) => void | null): SDWebImagePrefetchToken | null;

	prefetchURLsProgressCompleted(urls: NSArray<NSURL> | NSURL[] | null, progressBlock: (p1: number, p2: number) => void | null, completionBlock: (p1: number, p2: number) => void | null): SDWebImagePrefetchToken | null;
}

interface SDWebImagePrefetcherDelegate extends NSObjectProtocol {

	imagePrefetcherDidFinishWithTotalCountSkippedCount?(imagePrefetcher: SDWebImagePrefetcher, totalCount: number, skippedCount: number): void;

	imagePrefetcherDidPrefetchURLFinishedCountTotalCount?(imagePrefetcher: SDWebImagePrefetcher, imageURL: NSURL | null, finishedCount: number, totalCount: number): void;
}
declare var SDWebImagePrefetcherDelegate: {

	prototype: SDWebImagePrefetcherDelegate;
};

declare class SDWebImageProgressIndicator extends NSObject implements SDWebImageIndicator {

	static alloc(): SDWebImageProgressIndicator; // inherited from NSObject

	static new(): SDWebImageProgressIndicator; // inherited from NSObject

	readonly indicatorView: UIProgressView;

	static readonly barIndicator: SDWebImageProgressIndicator;

	static readonly defaultIndicator: SDWebImageProgressIndicator;

	readonly debugDescription: string; // inherited from NSObjectProtocol

	readonly description: string; // inherited from NSObjectProtocol

	readonly hash: number; // inherited from NSObjectProtocol

	readonly isProxy: boolean; // inherited from NSObjectProtocol

	readonly superclass: typeof NSObject; // inherited from NSObjectProtocol

	readonly  // inherited from NSObjectProtocol

	class(): typeof NSObject;

	conformsToProtocol(aProtocol: any /* Protocol */): boolean;

	isEqual(object: any): boolean;

	isKindOfClass(aClass: typeof NSObject): boolean;

	isMemberOfClass(aClass: typeof NSObject): boolean;

	performSelector(aSelector: string): any;

	performSelectorWithObject(aSelector: string, object: any): any;

	performSelectorWithObjectWithObject(aSelector: string, object1: any, object2: any): any;

	respondsToSelector(aSelector: string): boolean;

	retainCount(): number;

	self(): this;

	startAnimatingIndicator(): void;

	stopAnimatingIndicator(): void;

	updateIndicatorProgress(progress: number): void;
}

declare var SDWebImageProgressUnitCountUnknown: number;

declare class SDWebImageTransition extends NSObject {

	static alloc(): SDWebImageTransition; // inherited from NSObject

	static curlDownTransitionWithDuration(duration: number): SDWebImageTransition;

	static curlUpTransitionWithDuration(duration: number): SDWebImageTransition;

	static fadeTransitionWithDuration(duration: number): SDWebImageTransition;

	static flipFromBottomTransitionWithDuration(duration: number): SDWebImageTransition;

	static flipFromLeftTransitionWithDuration(duration: number): SDWebImageTransition;

	static flipFromRightTransitionWithDuration(duration: number): SDWebImageTransition;

	static flipFromTopTransitionWithDuration(duration: number): SDWebImageTransition;

	static new(): SDWebImageTransition; // inherited from NSObject

	animationOptions: UIViewAnimationOptions;

	animations: (p1: UIView, p2: UIImage | null) => void | null;

	avoidAutoSetImage: boolean;

	completion: (p1: boolean) => void | null;

	duration: number;

	prepares: (p1: UIView, p2: UIImage | null, p3: NSData | null, p4: SDImageCacheType, p5: NSURL | null) => void | null;

	static readonly curlDownTransition: SDWebImageTransition;

	static readonly curlUpTransition: SDWebImageTransition;

	static readonly fadeTransition: SDWebImageTransition;

	static readonly flipFromBottomTransition: SDWebImageTransition;

	static readonly flipFromLeftTransition: SDWebImageTransition;

	static readonly flipFromRightTransition: SDWebImageTransition;

	static readonly flipFromTopTransition: SDWebImageTransition;
}

declare var SDWebImageVersionNumber: number;

declare var SDWebImageVersionString: interop.Reference<number>;
