# Mason core NativeScript plugin proof

This private artifact combines the container-only JavaScript runtime with the
independently built native hosts. It excludes MasonKit's HTML parser, rich-text
renderer and optional widgets. The ordinary core helper build and the existing
full MasonKit package remain separate.

Build the hosts, then assemble the plugin:

```sh
pnpm exec nx run nativescript-mason-core:build.host.ios
pnpm exec nx run nativescript-mason-core:build.host.android
pnpm exec nx run nativescript-mason-core:build.plugin.prototype
```

Native builds require the development environment's native-build resource
reservation. Assembly reads the exported artifacts and verifies their hashes;
it does not rebuild them. The result is
`dist/prototypes/nativescript-mason-core-plugin`.

Verify its packed files and prepare the isolated NativeScript app:

```sh
pnpm exec nx run nativescript-mason-core:prepare.consumer
cd tmp/mason-core-nativescript-consumer
pnpm install
```

The fixture has its own pnpm workspace and explicit build-script allowlist.
Do not pass `--ignore-workspace`: that also ignores this fixture's dependency
policy. After regenerating the tarball, use `pnpm install --force` to refresh
the installed file dependency. Run the native build targets from the repository
root under a native-build reservation:

```sh
pnpm exec nx run nativescript-mason-core:build.consumer.ios
pnpm exec nx run nativescript-mason-core:build.consumer.android
```

The app creates Mason containers hosting ordinary NativeScript labels and
writes geometry/ownership assertions to its documents folder as
`mason-core-result.json`. Build success alone does not establish that they pass.
The package includes independent native bridge declarations, generated from
the core artifacts. Assembly rejects types whose recorded native hashes differ
from the hosts being packaged. See [native type generation](native-types-README.md).

Run the application assertions from the repository root:

```sh
pnpm exec nx run nativescript-mason-core:test.consumer.ios
pnpm exec nx run nativescript-mason-core:test.consumer.android.device
```

The iOS runner uses the dedicated simulator recorded by the native host test
setup. The Android runner uses the sole authorized arm64 phone, or
`MASON_CORE_ANDROID_SERIAL` when several are connected. Reserve the corresponding
device before running. Each runner stops its own probe afterward; the Android
runner verifies ownership before replacing an installed app.

The prototype currently includes only an arm64 iOS **simulator** framework and
an Android arm64-v8a AAR. It cannot build an iOS device application. Independent
OS input and release-size savings remain unqualified.
The isolated apps pass bridge, native geometry and ownership assertions on an
arm64 iOS simulator and an API 36 Android phone. They install only core and
NativeScript core as runtime dependencies. The iOS app declares the scene
lifecycle required by the current SDK; NativeScript provides its default scene
delegate. Plain-app assertions and renderer assertions are qualified separately;
touch input remains unverified. Do not switch production consumers or publish
this artifact.

iOS retains embedded FontManager and SDWebImage code, dependency module headers,
licenses and the SDWebImage resource/privacy bundle. Android declares the same
direct Maven dependencies as the native host build; their transitive AndroidX
cost remains. No app-size savings have been measured.

Use core and full MasonKit in separate apps. Native Objective-C/JNI class names
are deliberately preserved, so coinstallation is unsupported. The package's
`artifact-inventory.json` records every shipped file's SHA-256 hash. Platform
manifests preserve native build provenance.

## Qualify the Xplat renderer separately

The renderer scenario reads the selected Xplat checkout's catalog pins and
canonical Octane, NativeScript core and renderer patches. It changes only the
renderer patch's two Mason package imports to point at core. It records patch
hashes and the Xplat commit, verifies shared runtime resolution, and rejects
full MasonKit anywhere in the installed production graph.

```sh
MASON_CORE_XPLAT_REPOSITORY=/path/to/octane-xplat \
  pnpm exec nx run nativescript-mason-core:prepare.consumer.renderer
cd tmp/mason-core-nativescript-consumer
pnpm install --force
```

Return to the repository root and use the same build and consumer test targets
shown above. The scenario checks driver geometry updates, reparenting and
disposal, followed by a real Octane component mount/update/unmount. Its checks
are a separate qualification from the plain application's bridge assertions;
a successful build does not establish a renderer runtime pass.

The renderer scenario passes on an arm64 iOS 27 simulator and API 35 arm64
Android emulator with Octane 0.14.0, renderer 0.2.5 and NativeScript core 9.1.3.
It includes native geometry after prop updates, reparenting/disposal and an
Octane component mount/update/unmount without recreating its foreign label.
The same-dependency plain controls pass on both targets. These results do not
qualify compiled TSRX components, hook subscriptions, OS input or a physical
Android renderer run. The earlier plain-app phone result remains separate.

The `prepare.consumer.renderer.control` target uses the same dependency pins
and patches with the plain NativeScript entry instead. It isolates SDK changes
from renderer operations. Reinstall and rebuild after changing scenarios. The
builder regenerates only its owned platform directory when native dependency
inputs change, avoiding stale Xcode references to previous pnpm peer paths.

When no phone is connected, reserve the dedicated `android:mason-core-extraction`
AVD and one resident-device slot, then run:

```sh
pnpm exec nx run nativescript-mason-core:test.consumer.android.emulator
```

The emulator runner boots and shuts down only that owned AVD. Emulator results
remain distinct from physical-device results. These checks do not exercise OS
touch input or establish release-size savings.

## Compile TSRX and verify hooks

The compiled scenario uses the same renderer dependency boundary, with an
authored component under `src/*.tsrx`. Prepare it with the selected Xplat
checkout, then install, build and run using the commands above:

```sh
MASON_CORE_XPLAT_REPOSITORY=/path/to/octane-xplat \
  pnpm exec nx run nativescript-mason-core:prepare.consumer.compiled
```

The native build invokes the pinned Octane 0.14.0 compiler before webpack.
Its optional `@tsrx/oxc` 0.20.0 parser belongs to this fixture's development
dependencies; core gains no dependency. The emitted hooks import the native
renderer runtime, and `compiled-component-manifest.json` records source and
emission hashes. The component runs in the same Page/Frame hosting pattern
as Xplat's mobile application.

This scenario passes on arm64 iOS 27 Simulator and the API 35 Android emulator.
It checks class-authored geometry, a synthesized NativeScript button handler,
hook-driven text/size updates without replacing the label, scroll content and
programmatic seek, effect cleanup, ref clearing and host release. The button
notification is explicitly synthetic; these results do not establish OS touch
input or physical-device renderer qualification.
