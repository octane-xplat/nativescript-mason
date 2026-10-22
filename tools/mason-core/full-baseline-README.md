# Full Mason native regression baseline

Qualify the full package before relocating unchanged native sources. These
fixtures compile the full implementation separately from core; they add no
full-to-core runtime dependency and do not change tracked native sources.

## Android

Run the build under a native-build reservation, then the tests under the owned
`android:mason-core-extraction` reservation with one resident-device slot:

```sh
pnpm exec nx run nativescript-mason-core:build.baseline.android.full
pnpm exec nx run nativescript-mason-core:test.baseline.android.full
```

The builder copies the entire full Android main source/resource tree without
source edits. Its isolated Gradle wiring replaces the Rust plugin with the same
prebuilt unchanged JNI binary used by core and pins FontManager to the same
1.0.20 version. It preserves the full library's other settings and dependencies.
This tests native source behavior, not every detail of the original Gradle
Rust-plugin integration.

Seven unchanged instrumentation classes cover HTML input parsing, input
state/geometry, list construction/measurement, rich-text line-height and inline
layout/defaults, and viewport-unit parsing. All 72 tests pass with no skips on
the API 35 arm64 emulator. No screenshot or image-analysis assertions are run.
The runner verifies the built test APK hash, uses only the owned AVD and shuts
it down afterward. Source/test hashes and expected test count are exported to
`dist/native/mason-core/full-android-baseline/manifest.json`; execution logs stay
under `tmp/mason-full-android-tests`.

A separate artifact comparison with this baseline gives core/full AAR archive
sizes of 1,780,097 / 2,332,626 bytes and classes.jar sizes of 1,321,673 /
1,886,358 bytes (600 / 758 class files). Their arm64 JNI entries are identical
and each is 1,146,832 bytes. These are library artifact measurements with one
ABI, not download sizes for transitive dependencies or release APK savings.
Application shrinking, compression and dependencies can change the result.

## iOS

Build under a native-build reservation, then run under the owned iOS simulator
reservation with one resident-device slot:

```sh
pnpm exec nx run nativescript-mason-core:build.baseline.ios.full
pnpm exec nx run nativescript-mason-core:test.baseline.ios.full
```

The builder copies full Swift sources and selected test files byte-identically.
Its temporary Xcode wiring uses the same qualified unchanged C engine archive,
preserves the package lock, and stages existing headers at the project's include
path. It selects 28 tests across HTML parsing, text-node mutation, input state,
child ownership and foreign-layout classes. No image-rendering tests are selected.

The original Xcode target omits `MasonTextNodeTests.swift` and
`AnonymousContainerRemovalTests.swift`, despite their presence in source. The
first baseline ran 25 passing tests and correctly failed its expected-count
check. The builder explicitly registers those two unchanged files in its
**temporary** target and retains the expected 28. The tracked upstream project
stays unchanged. This staging adaptation must not be mistaken for original
upstream test discovery.

With both files registered, all 28 execute: 27 pass and
`MasonTextNodeTests.test_text_node_processing_uppercase_and_whitespace` fails
its `HELLO WORLD` substring assertion. This failure exists in the unchanged full
source baseline before native relocation. The command remains nonzero; no test
is skipped or changed to turn it green. The failure repeats with verbose diagnostics disabled; core separately passes
all 15 native interop tests through the same runner. The failing full text
renderer is excluded from core. HTML parsing, input appearance, child ownership and all 11
foreign-layout tests pass.

Source/test hashes and expected counts live in
`tmp/mason-full-ios-baseline/manifest.json`; result bundles and parsed summaries
stay under `tmp/mason-full-ios-tests`. The runner preserves the summary before
asserting success, so missing or failing tests remain reviewable.

## Remaining coverage

The selected Android baseline does not qualify all full-package native tests,
OS input for full widgets, physical iOS device behavior, or release application
size/startup/layout costs. Keep those gates explicit in the extraction design.
