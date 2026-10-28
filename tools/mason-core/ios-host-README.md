# Core iOS host prototype

The core-only simulator framework builds and runs without MasonKit's HTML
parser, rich-text renderer, or widget classes. It is a native boundary proof;
NativeScript metadata and npm plugin packaging are separate proofs; see
`tools/mason-core/plugin-README.md` in the source checkout.

## Build and inspect the artifact

On macOS with Xcode and the repository's Rust iOS prerequisites installed:

```sh
pnpm exec nx run nativescript-mason-core:verify.host.ios.artifact
```

The target builds the independent Rust engine, generates the core Swift project
under `tmp/mason-core-ios-host`, and exports
`dist/native/mason-core/ios-host/release`. Verification copies the artifact to an
isolated temporary directory, links Swift and Objective-C consumers, verifies
all 103 declared C functions are exported, and checks native symbols and headers
for excluded classes.

Build and verify the unsigned arm64 device framework separately:

```sh
pnpm exec nx run nativescript-mason-core:verify.host.ios.device.artifact
```

This uses `iphoneos`, the device engine archive and separate staging/derived
folders, exporting `dist/native/mason-core/ios-host/device/release`. The device
framework and isolated Swift/Objective-C clients compile and link; its Mach-O
platform and all 103 C exports are verified. This is build evidence only. It does
not qualify device runtime behavior.
Both builds require a native-build resource reservation. Assemble the verified
slices after both builds:

```sh
pnpm exec nx run nativescript-mason-core:build.host.ios.xcframework
```

Assembly requires matching source hashes, dependency locks and public headers.
It exports `dist/native/mason-core/ios-host/universal`, embedding each platform's
SDWebImage privacy bundle in its own framework slice. The plugin packages this
XCFramework; resource paths no longer depend on a simulator-only global bundle.

The exported framework is static. FontManager is linked once by the consuming
app; core does not define its Objective-C classes. The npm plugin depends on
`@nativescript/font-manager@1.0.20`, which supplies the shared library and module.
The native SDK export includes its pinned headers and library for the isolated
Swift/Objective-C link checks. Objective-C-only hosts also need the toolchain's
Swift compatibility library search path; ordinary NativeScript apps already
compile Swift sources and receive that path from Xcode.

SDWebImage remains embedded for container backgrounds and nine-slice images.
Its dependency headers and licenses accompany core. The npm plugin installs
the SDWebImage privacy bundle separately through `platforms/ios/Resources`,
because the static framework is not embedded in the application at runtime.
The separate isolated NativeScript app verifies resource discovery, core class
metadata, layout and ownership on an arm64 simulator. Independent public native
declarations are generated independently; device app coverage remains a gate.

## Run native layout tests

Build the test bundle first:

```sh
pnpm exec nx run nativescript-mason-core:build.tests.ios
```

Prepare a dedicated simulator and record its identifier. This example uses the
iOS 27 runtime and iPhone 17 Pro device type used for the current proof; inspect
`xcrun simctl list` for identifiers installed on another machine.

```sh
test -f tmp/mason-core-ios-test-device.txt || \
  xcrun simctl create 'Mason core extraction' \
    com.apple.CoreSimulator.SimDeviceType.iPhone-17-Pro \
    com.apple.CoreSimulator.SimRuntime.iOS-27-0 > tmp/mason-core-ios-test-device.txt
pnpm exec nx run nativescript-mason-core:test.host.ios
```

The runner boots only that dedicated device and shuts it down afterward. It
runs the 11 existing `CoreLayoutInteropTests` unchanged apart from their module
import, plus nine core regressions. It checks the result bundle contains all
20 passing tests, with no skips. Results stay under `tmp/mason-core-ios-tests`.
The tests exercise UIKit directly; they do not capture screenshots.

Covered behavior: grid placement, foreign label intrinsic-size invalidation,
percentage sizing and reset, programmatic scroll clamping, nested roots during
an outer compute, bounded root measurement, deferred intrinsic queries during
host resize, and view/node/listener release. Intrinsic queries retain their
measured results while restoring the bounds assigned by the host, including
when a new host size arrives before queued measurements settle.
Host-driven fixtures give roots explicit bounds and mark their applied compute
before programmatic seeking, matching the host lifecycle.

## Preserve source and the full package

The generated project compiles 39 existing Swift files. Of these, 25 retain
identical source bytes; 14 have explicit core-only adaptations. The manifest
records each original and projected hash. The 25 unchanged files now live in
core after byte-preserving `git mv` moves. The full Xcode project changes only
those source references; its implementation and remaining files retain their
bytes. No full-to-core runtime dependency is added.

`ios-sources.mjs` uses compiler-derived declaration spans from `swift-source.mjs`
to remove optional factories, HTML conveniences, text-run reconciliation, and
widget-specific branches. `ios-node-children.swift` supplies the foreign-view
and container child operations. Shared measurement methods remain unchanged.
This projection is temporary prototype wiring, not the final upstream seam.
The native path mapping and baseline hashes live in `native-relocations.json`.
Generated projects reconstruct the original source layout; both builds resolve
one tracked copy through `native-sources.mjs`. Keep future fixes separate from
source moves and avoid parallel edited copies.

Container painting and scrolling remain in core. Background text clipping has
a small native glyph-provider protocol, allowing a renderer to supply outlines
without embedding MasonKit's text renderer. Ordinary UIKit/NativeScript labels
do not acquire glyph-provider support from this extraction. The shared Rust
engine and C interface still contain inline-layout code and convenience node
constructors; this proof does not claim those costs have been removed.

## Remaining qualification

The native host exports separate arm64 simulator and device frameworks.
The plugin packages both slices. Its compiled simulator app qualifies bridge
metadata, framework-local resources and OS input; the unsigned device app build
checks device metadata and resource selection separately. Physical iOS device
execution remains unqualified. Simulator bridge types,
plugin discovery, compiled components and OS input pass separately; see the
[plugin proof](plugin-README.md). Matching release app size measurements remain. Core and full MasonKit are separate-host choices;
coinstallation and native ABI compatibility are not qualified. Windows is not
qualified by this prototype.
