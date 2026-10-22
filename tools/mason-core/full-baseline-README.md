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

## Remaining coverage

The selected Android baseline does not qualify all full-package native tests,
OS input for full widgets, full iOS native behavior, or release application
size/startup/layout costs. Keep those gates explicit in the extraction design.
