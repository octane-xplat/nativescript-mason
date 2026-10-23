# NativeScript Mason core

Mason core provides native layout containers, scrolling, styles and hosting for
ordinary NativeScript controls. It excludes MasonKit's HTML elements, parser,
rich-text renderer and optional widgets. The existing full MasonKit package
remains independent.

Install the experimental beta in a NativeScript app:

```sh
pnpm add @octane-xplat/nativescript-mason-core@next
```

The beta ships arm64 iOS device/Simulator and Android arm64-v8a artifacts.
The raw source directory is not an installable plugin. Do not install core and full
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
pnpm add /path/to/local-artifacts/octane-xplat-nativescript-mason-core-1.0.0-beta.0.tgz
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
artifacts without silently starting native compilation. Core uses its own release track and remains excluded from the full
repository's `build:all` release workflow. See `RELEASING.md` in the source
checkout for publishing.

## Qualification and limits

| Target | Evidence |
| --- | --- |
| iOS arm64 Simulator | Native regressions, compiled TSRX/hooks/styles, actual HID taps/swipes and cleanup pass |
| iOS arm64 device | Framework clients link; signed development app and native UI-test runner build; physical runtime unqualified |
| Android arm64-v8a | Native regressions, plain consumer, compiled TSRX/hooks/styles and real tap/swipe input pass on API 36 phone; API 35 emulator also passes |
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

## Safe-area CSS environment values (unreleased)

The source runtime supports `env(safe-area-inset-top/right/bottom/left)` when
its host supplies the current window's insets. This API is not in published
`1.0.0-beta.0`. Bind one source per window or presentation root; the host reads
logical pixels from that root's native window and notifies on inset changes.
Call the returned function when the host is disposed.

```ts
import {
  View, bindCssEnvironment,
  type CssEnvironmentSource,
} from '@octane-xplat/nativescript-mason-core';

export function connectWindow(root: View, source: CssEnvironmentSource) {
  root.className = 'safe-area-content';
  return bindCssEnvironment(root, source);
}
```

`source.read()` returns `{ top, right, bottom, left }` in device-independent
pixels, or `null` while unavailable. `source.subscribe(changed)` returns an
unsubscribe function. Environment values are scoped to that root's descendants;
a nested boundary may represent another window. Core owns substitution and
style re-evaluation; the host owns native observation, correct window selection
and disposal. It does not read a process-global screen or add a platform plugin.

```ts
import { setCssEnvironment, type View, type CssSafeAreaInsets } from '@octane-xplat/nativescript-mason-core';

export function publishWindowInsets(root: View, insets: CssSafeAreaInsets | null) {
  setCssEnvironment(root, insets);
}
```

A fallback applies when the requested value is unavailable. A real zero remains
zero. Nested math, box shorthands (`padding`, `margin`, `border-width`) and
NativeScript-expanded CSS variables retain their authored expressions when
insets change. Local overrides and removed declarations stop the replaced
expression from being replayed.

```css
.safe-area-content {
  --content-top: env(safe-area-inset-top, 0px);
  padding: calc(var(--content-top) + 8px) env(safe-area-inset-right, 0px)
    env(safe-area-inset-bottom, 0px) env(safe-area-inset-left, 0px);
}
```

Unknown names can use fallbacks; unsupported or unavailable values without a
fallback go through the existing invalid-length/diagnostic path. This is not
a general CSS invalid-at-computed-value or inheritance implementation. Loaded
views re-evaluate after reparenting; hosts that replace native views without a
load transition must explicitly refresh their subtree.

```ts
import { refreshCssEnvironment, type View } from '@octane-xplat/nativescript-mason-core';

export function nativeViewRecreated(root: View) {
  refreshCssEnvironment(root);
}
```

Verification is headless: parser, style-buffer transport, actual NativeScript
cascade and host lifecycle tests. No iOS/Android layout run qualifies this
resolver yet. Xplat must keep its native `env()` warning until a release with
this resolver is installed **and** its window host binds the inset source.
