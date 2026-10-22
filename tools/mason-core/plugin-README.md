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
The iOS build also requests native declaration generation into the consumer's
`typings/ios` directory. Those generated declarations still need qualification
before replacing the full-source build-only typings.

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
native declarations, OS input and release-size savings remain unqualified.
The isolated apps pass bridge, native geometry and ownership assertions on an
arm64 iOS simulator and an API 36 Android phone. They install only core and
NativeScript core as runtime dependencies. The iOS app declares the scene
lifecycle required by the current SDK; NativeScript provides its default scene
delegate. These checks do not qualify the Xplat renderer or touch input. Do not
switch production consumers or publish this artifact.

iOS retains embedded FontManager and SDWebImage code, dependency module headers,
licenses and the SDWebImage resource/privacy bundle. Android declares the same
direct Maven dependencies as the native host build; their transitive AndroidX
cost remains. No app-size savings have been measured.

Use core and full MasonKit in separate apps. Native Objective-C/JNI class names
are deliberately preserved, so coinstallation is unsupported. The package's
`artifact-inventory.json` records every shipped file's SHA-256 hash. Platform
manifests preserve native build provenance.
