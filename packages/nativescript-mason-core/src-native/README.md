# Native core sources and independent engine proof

This directory also owns 25 unchanged Swift modules under `ios/` and 86
Kotlin/Java modules under `android/java/`, moved with `git mv`. Their original
paths and baseline hashes live in `tools/mason-core/native-relocations.json`.
Core and full builds compile one tracked source copy with separate native
artifacts; full MasonKit gains no runtime package dependency.

The engine build targets package the existing `mason-c` crate as a static archive.
They reuse `mason-core` and the current Rust layout implementation unchanged;
they do not build MasonKit's Swift/Kotlin hosts, widgets, HTML parser, image
loader, or font manager. No new Rust crate or duplicate engine implementation
is needed for this step.

This is an engine foundation, not a NativeScript plugin. These archives do not
include layout hosts, scrolling, painting, or bridge metadata. The separate
iOS host prototype now builds and runs; its scope and commands live in
`tools/mason-core/ios-host-README.md` in the source checkout. The independent
Android JNI/AAR proof is documented in `tools/mason-core/android-host-README.md`.
The separate plugin proof is documented in `tools/mason-core/plugin-README.md`.
These archives retain Rust's existing inline-layout
and UA-default helpers; this proof does not remove all text-related engine code.

## Build and verify

Run on macOS with Xcode, Rustup's stable toolchain, and the corresponding Rust
targets already installed. Android inspection also needs an NDK; set
`ANDROID_NDK_HOME`, or use the newest installed NDK under `ANDROID_HOME` /
`ANDROID_SDK_ROOT` (default: `~/Library/Android/sdk`).

Resolve a workspace lockfile once if needed, then run the isolated host consumer:

```sh
rustup run stable cargo generate-lockfile
pnpm exec nx run nativescript-mason-core:verify.native
```

The native build uses Rustup explicitly, avoiding a different `cargo`/`rustc`
installation on PATH that lacks the installed cross-compilation targets.
`MASON_RUST_TOOLCHAIN` selects another installed Rustup toolchain. Builds use
`--locked`; manifests record the compiler, lockfile hash, source revision,
header hashes, and archive hashes; each artifact directory also retains the
resolved lockfile and per-target dependency tree. Reserve native build capacity with the host's
resource broker when available before running native commands.

The C consumer links and runs in a temporary directory using only the archive,
header, generated style offsets, and system libraries. It checks flex placement
with callback measurement, intrinsic-size invalidation, removal/reparenting,
grid placement, and cleanup. Its style offsets come from the existing schema.
This is native engine execution on the build host; it does not exercise UIKit,
Android views, touch input, or NativeScript lifecycle.

Build the mobile artifacts separately:

```sh
pnpm exec nx run nativescript-mason-core:verify.native.ios
pnpm exec nx run nativescript-mason-core:build.native.android
```

| Target | Artifact under `dist/native/mason-core/` | Qualification boundary |
| --- | --- | --- |
| macOS host | `host/<host-triple>/libMasonCore.a` | C consumer executes layout and measurement |
| iOS arm64 device + arm64 simulator | `ios/MasonCore.xcframework` | Engine compilation and packaging; isolated Swift simulator consumer link; no app runtime |
| Android arm64 | `android/aarch64-linux-android/libMasonCore.a` | Engine compilation; no JNI host or runtime |
| Windows and other architectures | No new artifact | Unqualified by this prototype |

`verify.native.ios` builds the XCFramework, then imports its C module and links
a Swift simulator executable outside the workspace. It does not launch that
executable or a simulator. Use `build.native.ios` when only the artifact is
needed.

Every target preprocesses the staged header using its actual C toolchain and
checks that all declared Mason functions exist in its archive. This catches
platform declarations that do not match the compiled Rust surface. It does not
replace runtime ABI or lifecycle tests.

Raw engine archives stay outside the portable helper proof. The normal core
`build` packages the independent native host artifacts; this private package
has no `build.all` release target. Do not add them to an app as a replacement for
MasonKit yet, or combine the two engines in one process. Output paths and
artifact names are prototype details, not a published contract.

## Header ownership

The build reads MasonKit's checked-in generated C header as shared source input
and stages a copy in the native artifact. The full package's header is unchanged.
There is no runtime dependency on MasonKit. Once the source boundary is ready,
header generation should belong beside the shared C interface.

The existing generated header does not guard declarations corresponding to
Rust's `cfg(target_vendor = "apple")`. Staging adds those guards and derives
`TARGET_OS_ANDROID` from the compiler's `__ANDROID__` macro so it cannot advertise
Apple-only functions or foreign-measure callbacks on Android. These adaptations
live in the build tool, not in a hand-edited copy of the upstream module.

## Boundaries still to extract

The Apple native layer currently couples core hosting to full functionality:

| Source under `packages/nativescript-masonkit/` | Coupling |
| --- | --- |
| `src-native/mason-ios/Mason/Mason/NSCMason.swift` | Widget factories, HTML parser, font manager, and event dispatch |
| `src-native/mason-ios/Mason/Mason/MasonNode.swift` | Rich-text attributes, anonymous text containers, inline-run normalization, HTML state |
| `src-native/mason-ios/Mason/Mason/MasonElement.swift` | Layout protocol also requires markup and text operations |
| `common.ts` | Foreign-view hosting shares a base class with text runs and HTML behavior |

Moving these classes now would pull in the full layer or require broad edits.
Prefer extracting unchanged layout data/decoding modules and narrow host
participation boundaries before moving coupled host classes. Keep such source
moves separate from behavior changes, using `git mv` and minimal build wiring.

Android also requires its own measurement boundary: `mason-c/src/node.rs`
excludes foreign-measure callback constructors and setters on Android, while
the current Android binding uses JNI. The successful host callback test does
not establish Android support for that interface. Preserve that distinction
when choosing the core Android bridge rather than treating the C ABI as an
already portable replacement.
