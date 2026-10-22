# Core iOS host prototype

The core-only simulator framework builds and runs without MasonKit's HTML
parser, rich-text renderer, or widget classes. It is a native boundary proof;
NativeScript metadata and npm plugin packaging are not included yet.

## Build and inspect the artifact

On macOS with Xcode and the repository's Rust iOS prerequisites installed:

```sh
pnpm exec nx run nativescript-mason-core:verify.host.ios.artifact
```

The target builds the independent Rust engine, generates the core Swift project
under `tmp/mason-core-ios-host`, and exports
`dist/native/mason-core/ios-host/release`. Verification copies the artifact to an
isolated temporary directory, links Swift and Objective-C consumers, verifies
all 99 declared C functions are exported, and checks native symbols and headers
for excluded classes.

The exported framework retains FontManager for styling/font metrics and
SDWebImage for container backgrounds and nine-slice images. Their code is
linked into the framework. Their dependency headers and licenses accompany it;
FontManager's Clang module is required even for a Swift client that imports
only `MasonCore`. Removing image/text widgets does not remove these remaining
callers. NativeScript resource/metadata packaging remains a separate gate.

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
import, plus four core regressions. It checks the result bundle contains all
15 passing tests, with no skips. Results stay under `tmp/mason-core-ios-tests`.
The tests exercise UIKit directly; they do not capture screenshots.

Covered behavior: grid placement, foreign label intrinsic-size invalidation,
percentage sizing and reset, programmatic scroll clamping, nested roots during
an outer compute, bounded root measurement, and view/node/listener release.
Host-driven fixtures give roots explicit bounds and mark their applied compute
before programmatic seeking, matching the host lifecycle.

## Preserve source and the full package

The generated project compiles 39 existing Swift files. Of these, 25 retain
identical source bytes; 14 have explicit core-only adaptations. The manifest
records each original and projected hash. The tracked full native sources and
Xcode project remain unchanged. No full-to-core runtime dependency is added.

`ios-sources.mjs` uses compiler-derived declaration spans from `swift-source.mjs`
to remove optional factories, HTML conveniences, text-run reconciliation, and
widget-specific branches. `ios-node-children.swift` supplies the foreign-view
and container child operations. Shared measurement methods remain unchanged.
This projection is temporary prototype wiring, not the final upstream seam.
Move native modules with `git mv` once their full-build references and native
regressions are qualified; do not create parallel edited source copies.

Container painting and scrolling remain in core. Background text clipping has
a small native glyph-provider protocol, allowing a renderer to supply outlines
without embedding MasonKit's text renderer. Ordinary UIKit/NativeScript labels
do not acquire glyph-provider support from this extraction. The shared Rust
engine and C interface still contain inline-layout code and convenience node
constructors; this proof does not claim those costs have been removed.

## Remaining qualification

The current host artifact is arm64 iOS Simulator only. Device slices,
NativeScript bridge metadata and types, plugin/resource packaging, Android's
JNI/view hosts, actual touch scrolling/hit-testing, and matching release app
size measurements remain. Core and full MasonKit are separate-host choices;
coinstallation and native ABI compatibility are not qualified. Windows is not
qualified by this prototype.
