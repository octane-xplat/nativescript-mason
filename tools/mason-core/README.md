# Mason core extraction tooling

The prototype preserves MasonKit's published imports while relocating reusable
source into `packages/nativescript-mason-core`. It does not make the full package
depend on the core package at runtime. The separate
[runtime prototype](runtime-README.md) tests a container-only TypeScript API;
the [iOS host prototype](ios-host-README.md) now builds and runs independently
on iOS Simulator. The [Android host prototype](android-host-README.md) builds a
separate AAR and verifies an isolated Java client. The
[plugin proof](plugin-README.md) packages both native hosts and independently
qualifies compiled NativeScript consumers.
Separate native targets package the existing shared Rust C interface as
independent engine archives; see the
[native proof](../../packages/nativescript-mason-core/src-native/README.md).

The design is tracked in the Octane Xplat repository at
`.agents/design/mason-core-extraction.md`; upstream discussion is
https://github.com/triniwiz/nativescript-mason/issues/160.

## Source baseline and moves

Fork baseline: `623114b070896a21315fcff9a3a6349bdd091cc4` (beta.126).
Upstream merge base and latest merged upstream revision:
`2324b8ee52a1f22cf18dc684aa053e92b64a6451`.

All paths below are relative to `packages/`. The initial moves preserve source
and test contents byte for byte, including their existing licensing headers.
The repository's root LICENSE continues to apply.

| Original under `nativescript-masonkit/` | Destination under `nativescript-mason-core/` | Consumers |
| --- | --- | --- |
| `box-shadow.ts` | `box-shadow.ts` | Both package builds |
| `css-colors.ts` | `css-colors.ts` | Both package builds |
| `css-filter.ts` | `css-filter.ts` | Both package builds |
| `css-math.ts` | `css-math.ts` | Both package builds |
| `css-transform.ts` | `css-transform.ts` | Both package builds |
| `box-shadow.spec.ts` | `box-shadow.spec.ts` | Existing host test suite |
| `css-filter.spec.ts` | `css-filter.spec.ts` | Existing host test suite |
| `css-transform.spec.ts` | `css-transform.spec.ts` | Existing host test suite |
| `style.ts`, `properties.ts`, `symbols.ts`, `units.ts`, `display-density.ts` | Same relative paths | Full build; core runtime preparation |
| `css-keyframes.ts`, `css-shorthands.ts`, `diagnostics.ts`, `fonts.ts`, `foreign-layout.ts`, `gradient-stops.ts`, `pseudo.ts` | Same relative paths | Full build; core runtime preparation |
| `mask.ts`, `mask.windows.ts`, `panel-helpers.ts`, `panel-helpers.windows.ts`, `svg-path.d.ts`, `svg-path.windows.ts` | Same relative paths | Full build; retained styling dependencies |
| `utils/index.{android,ios}.ts`, `utils/index.d.ts` | Same relative paths | Full build; native layout/style bridge |
| `view/index.{android,ios}.ts`, `view/index.d.ts` | Same relative paths | Full build; native view wrapper |
| `scroll/index.{android,ios}.ts`, `scroll/index.d.ts` | Same relative paths | Full build; native scroll wrapper |

The math, color, and host integration tests remain in the full package. The
second move preserves 27 additional source files unchanged, preparing the
layout/style/view/scroll dependency closure. `common.ts` and `tree/` still belong
to the full package. The core runtime build generates its own narrowed versions
without changing those originals. The helper proof remains a separate target;
the normal core build now packages the native hosts. No behavioral divergence is introduced by the moves.

## Build and test wiring

Run the existing full build as before:

```sh
pnpm exec nx run nativescript-masonkit:build.all
```

Its `prepare.sources` prerequisite assembles the TypeScript source tree in
`tmp/nativescript-masonkit`, adding the relocated modules at their original
relative paths. The full build compiles that overlay and retains its existing
assets and output layout. Preparation is uncached so deleting `tmp/` cannot
leave a stale source tree. Full build targets hash the relocated source and
extraction tooling to avoid stale cached output.

The generated overlay deliberately stays two directories below the repository
root, matching the original package's reference and tsconfig paths. It excludes
native projects, platform binaries, and framework adapters; those keep their
existing build and asset paths. Source maps refer to the generated overlay,
which must remain available when debugging its build.

Run the existing host tests as before:

```sh
pnpm test
```

Their source resolver reads the same relocation manifest as the build overlay.
It loads moved files at their original logical filenames so relative imports
and the existing platform resolver keep their original meaning. Tests and
generators which read source directly use the physical relocation mapping.
Tests of the full style layer therefore exercise the relocated implementation,
without creating forwarding modules or generating files into tracked source.

## Continuing the extraction

Keep move/build-wiring commits separate from behavioral changes. Add a module
to `sources.mjs` only after checking its complete dependency path. Preserve
unchanged modules and keep adapters separate. Never edit generated overlay
files: changes there are discarded by the next preparation.

Before expanding into native hosts, prove the rich-text/layout boundary and
independent native compilation. Core and full MasonKit remain separate-host
choices until native symbol and class ownership is qualified. Passing host
unit tests does not prove native layout, input, or application-size savings.

See the [full native baseline](full-baseline-README.md) before moving unchanged
native modules; core-only passing tests do not establish full-package behavior.

## Native source moves

Twenty-five Swift files and 86 Kotlin/Java files moved with `git mv`, retaining
all source bytes. `native-relocations.json` records each filename, original and
destination roots, and its baseline SHA-256. Those hashes record move provenance;
they do not pin future source contents or prevent upstream fixes. The full iOS project uses source
references into `src-native/ios`; the full Android project adds the shared
`src-native/android/java` source set. Neither depends on the core package or its
compiled artifacts. Source package names, native class names and filenames stay
unchanged.

`native-sources.mjs` resolves one tracked copy for both builds. Generated
projects reconstruct their logical source trees without editing those modules.
Fourteen adapted Swift files and nine adapted Kotlin/Java files stay in the
full tree; core-only transformations remain in the projection tools. Full
text/widget implementation is preserved. The entire core/full native source
inventories match the saved pre-move controls.

The original full Gradle source references can be checked directly, excluding
the separately qualified Rust build:

```sh
pnpm exec nx run nativescript-mason-core:verify.references.android.full
```

## Normal core package output

`nativescript-mason-core:build` now assembles the native plugin at
`dist/packages/nativescript-mason-core`; `verify` checks that packed artifact.
The helper-only proof is `build.helpers` / `verify.helpers` under
`dist/prototypes/nativescript-mason-core-helpers`. The runtime-only intermediate
stays under `dist/prototypes/nativescript-mason-core`. No compatibility aliases
for the old plugin prototype targets remain.

Native artifacts must be prepared explicitly. `prepare.native.sdk` installs
pinned generators independently of consumers, avoiding a bootstrap dependency
on an already assembled plugin. See the core package README for the complete
sequence. The private core project has no `build.all` target, so the full
repository's release-oriented `build:all` remains independent of this native
setup and publishing remains opt-in.

## Actual Xplat Vite consumer

This scenario uses the canonical Xplat renderer patch, with engine selection
owned by Xplat's native preset. It compiles the authored TSRX component through
Vite rather than the standalone compiler step. Prepare the native artifacts
first, and point the environment variable at the Xplat checkout to qualify:

```sh
export MASON_CORE_XPLAT_REPOSITORY=/path/to/octane-xplat
pnpm exec nx run nativescript-mason-core:prepare.consumer.vite
pnpm --dir tmp/mason-core-nativescript-consumer install --force
pnpm exec nx run nativescript-mason-core:build.consumer.ios
pnpm exec nx run nativescript-mason-core:test.consumer.ios.input
```

Native builds and input runs require the matching host resource reservations.
The normal compiled/Webpack scenarios remain available; preparing one restores
its configuration. The runner checks the reported bundler as well as the
scenario, so an older installed app cannot qualify the Vite path.

The actual Vite scenario passes OS taps, hook/text/geometry updates, touch
scrolling and cleanup on arm64 iOS 27 Simulator. Android's Vite bundle and debug
APK build. Its initial startup failure came from this fixture's missing
`INTERNET` permission: the inspector server threw socket `EPERM`, so native
initialization never installed `__registerDomainDispatcher`. The ordinary
permission restores the canonical Vite startup and real Runtime/DOM inspector
responses. No separate inspector-entry workaround is required.

Android input diagnostics also caught coordinates published before window
insets finished applying. The fixture now waits for native window readiness
and stable geometry, and the combined inspector/OS-input run passes on the
API 35 emulator with real Runtime/DOM inspector responses. Cold-boot runs
remain intermittent: one rerun timed out when the injected tap never reached
the application despite correct coordinates and verified window focus, and
another timed out while waiting for the window-readiness gate. Failure
diagnostics now record the last readiness gate and the touch actions the
native button observed. Keep one real OS action per phase and the existing
assertions.

```sh
pnpm exec nx run nativescript-mason-core:build.consumer.android
pnpm exec nx run nativescript-mason-core:test.consumer.android.input.emulator
pnpm exec nx run nativescript-mason-core:test.consumer.android.inspector.emulator
```

Source references: NativeScript Vite `helpers/main-entry.ts`, NativeScript
Android `JsV8InspectorClient.cpp::registerModules`, and NativeScript Webpack
`configuration/base.ts`. This startup finding is separate from the passing
core Webpack consumer and from native-host regression qualification.
