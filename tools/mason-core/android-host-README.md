# Core Android host prototype

The core-only AAR and an isolated Java client compile without MasonKit's HTML
parser, rich-text renderer, or widget classes. This is a native boundary proof;
NativeScript plugin packaging and bridge types remain separate work.

## Build and inspect the AAR

On macOS, install JDK 21, Android SDK 36, an NDK, and Rustup's
`aarch64-linux-android` target. The source parser uses Kotlin 1.9.20, matching
the full Android build. It resolves missing compiler jars as build tooling
without building the full package. `MASON_CORE_JAVA_HOME` can select the JDK
explicitly.

```sh
pnpm exec nx run nativescript-mason-core:verify.host.android.artifact
```

The target builds the unchanged `mason-android` JNI crate, stages a core-only
Gradle project under `tmp/mason-core-android-host`, and exports
`dist/native/mason-core/android-host/MasonCore.aar`. Native library load segments
are aligned for 16 KB pages. Verification checks the AAR's class graph, JNI
provenance after AGP's normal symbol stripping, and an isolated Java consumer
compiled against the AAR, Android SDK, and its exact resolved dependencies.

The AAR needs external Maven dependencies. The manifest records the resolved
runtime graph; the direct dependencies are AndroidX Core, Gson, Glide, and
FontManager. Glide still serves backgrounds/nine-slice painting, and
FontManager still serves styles/font metrics. The transitive graph includes
AppCompat and Fragment; excluding Mason widgets does not establish that these
costs disappear from an app. Plugin packaging must declare the dependencies
the AAR actually needs.

## Run native tests

Install the Android 35 Google APIs arm64 system image, then build the test APK:

```sh
pnpm exec nx run nativescript-mason-core:build.tests.android
pnpm exec nx run nativescript-mason-core:test.host.android
```

The runner creates and owns the `mason-core-extraction` AVD. It refuses an
existing AVD with that name unless the checkout has its ownership record. It
boots that emulator without a window, installs only its test APK, runs the
tests, and stops its emulator afterward. Reserve resident-device capacity
through the host's resource broker before running it on a shared machine.

The suite contains 12 unchanged foreign-view tests and five core tests. The
runner requires all 17 to pass without skips. It covers intrinsic content and
width changes, style-buffer invalidation, flex-assigned frames, grid placement,
percentage reset, child order/reparenting, cycle rejection, nested roots, and
programmatic scroll bounds. Logs and a passing summary stay under
`tmp/mason-core-android-tests`. The tests do not capture screenshots or prove
NativeScript lifecycle or OS input.

## Preserve source and the full package

The host compiles 96 source files: 86 remain byte-identical, nine have explicit
core adaptations, and one contains the unchanged `ThemelessContext` declaration
extracted from the text widget's source file. The source manifest records each
original path and both hashes. The tracked full Kotlin sources, Gradle project,
Rust engine, and JNI binding remain unchanged.

`android-sources.mjs` uses Kotlin compiler-derived spans to remove optional
factories, HTML/text overloads, inline-run normalization, and widget branches.
`android-node-children.kt` supplies container-only child operations. A glyph-mask
provider preserves the painter's boundary without embedding a text renderer;
ordinary foreign labels do not automatically implement it. Style attribute
data and font-resolution batching remain, including `TextDefaultAttributes`.

The unchanged JNI loader eagerly registers `InlineSegment` and its nested data
classes, so those remain with its convenience native constructors. The shared
Rust engine still contains inline-layout code and UA defaults. This proof
removes the optional native hosts, not every text-related datum or function.

The source projection is temporary proof tooling, not the final upstream seam.
Move unchanged native modules with `git mv` after qualifying their full-build
references and native regressions. Keep core and full MasonKit in separate
hosts; their Java class names and native library names still collide.

## Remaining qualification

The AAR contains arm64-v8a only, with API 21 as its minimum native target.
Android execution, other ABIs, NativeScript metadata/types and plugin discovery,
actual touch scrolling/hit-testing, and matched release application sizes are
not established by the build and Java-client proof. Windows is unqualified.
