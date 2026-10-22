# NativeScript Mason core

Mason core provides native layout containers, scrolling, styles and hosting for
ordinary NativeScript controls. It excludes MasonKit's HTML elements, parser,
rich-text renderer and optional widgets. The existing full MasonKit package
remains independent.

This is a private, unpublished package. Build and pack the output below; the raw
source directory is not an installable plugin. Do not install core and full
MasonKit in the same app: their native class and library names overlap.

## Build and install

After preparing the native artifacts described below, run from the repository
root:

```sh
pnpm exec nx run nativescript-mason-core:verify
cd dist/packages/nativescript-mason-core
pnpm pack --pack-destination /path/to/local-artifacts
```

Install the resulting tarball in a NativeScript application:

```sh
pnpm add /path/to/local-artifacts/octane-xplat-nativescript-mason-core-0.0.0.tgz
```

Use NativeScript controls inside a Mason container:

```ts
import { Application, Label } from '@nativescript/core';
import { View } from '@octane-xplat/nativescript-mason-core';

Application.addCss(`
  .core-demo { display: flex; flex-direction: column; }
  .core-label { height: 40; }
`);
Application.run({
  create() {
    const root = new View();
    root.className = 'core-demo';
    const label = new Label();
    label.text = 'A native control in Mason core';
    label.className = 'core-label';
    root.addChild(label);
    return root;
  },
});
```

Portable helpers remain directly accessible through their file subpaths:

```ts
import { evaluateCssMath } from '@octane-xplat/nativescript-mason-core/css-math';
const result = evaluateCssMath('calc(2px + 3px)', (value, unit) =>
  unit === 'px' ? value : undefined);
// result: { kind: 'length', px: 5 }
```

## Prepare native artifacts from a fresh checkout

Use macOS with Xcode, the Android SDK/NDK, JDK 21 and the repository's Rust
prerequisites. Native builds and device runs require the development host's
resource reservations. Run native hosts sequentially:

```sh
pnpm exec nx run-many --projects=nativescript-mason-core \
  --targets=build.host.ios,build.host.ios.device,build.host.android --parallel=1
pnpm exec nx run nativescript-mason-core:prepare.native.sdk
pnpm exec nx run nativescript-mason-core:generate.native.types
pnpm exec nx run nativescript-mason-core:build.host.ios.xcframework
pnpm exec nx run nativescript-mason-core:verify
```

SDK setup is independent of any consumer or plugin build. Bridge declarations
are generated from the exported native artifacts; assembly verifies their
hashes. Regenerate after a native rebuild. The normal `build` assembles these
artifacts without silently starting native compilation. The private package is
excluded from the full repository's `build:all` release workflow until its
publishing and upstream boundaries are agreed.

## Qualification and limits

| Target | Evidence |
| --- | --- |
| iOS arm64 Simulator | Native regressions, compiled TSRX/hooks/styles, actual HID taps/swipes and cleanup pass |
| iOS arm64 device | Framework clients link; unsigned NativeScript app builds with device metadata/resources; physical runtime unverified |
| Android arm64-v8a | Native regressions and plain consumer pass on API 36 phone; compiled renderer and OS input pass on API 35 emulator |
| Windows / web | Not provided by this package |

NativeScript core 9.1.3 with Xplat's canonical patches is qualified through the
isolated renderer fixture; ordinary apps also pass separately. The Xplat renderer
needs its two Mason imports retargeted to core. See `plugin-README.md` for
reproduction and `native-types-README.md` for ambient SDK type requirements.
No production Xplat dependency has been switched.

Core retains FontManager, SDWebImage, Glide, Gson, AndroidX and shared Rust
inline-layout code used by the preserved engine/painting boundary. Artifact
reductions do not establish release APK/IPA or startup savings; matched release
app measurements remain separate. The full-package iOS baseline also has one
pre-existing text-node test failure, recorded in the extraction design; core's
own native suites pass.

Source provenance and the byte-preserving module map live in
`tools/mason-core/README.md` in the source checkout. The agreed design is
`.agents/design/mason-core-extraction.md` in Octane Xplat. Upstream discussion:
https://github.com/triniwiz/nativescript-mason/issues/160.
