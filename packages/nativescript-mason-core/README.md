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

## Shared iOS font support

Core's iOS framework is static and uses the native FontManager library supplied
by `@nativescript/font-manager@1.0.20`. The app links that library once. Core's
npm dependency installs the plugin automatically; existing apps that also
declare the plugin must align their direct pin:

```sh
pnpm add @nativescript/font-manager@1.0.20
```

Rebuild the native application after upgrading. No plugin exclusion or manual
framework linking is needed in a normal NativeScript app. The native SDK build
and its separate Swift/Objective-C link checks are documented below.

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
pnpm add /path/to/local-artifacts/octane-xplat-nativescript-mason-core-1.0.0-beta.4.tgz
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

The `1.0.0-beta.2` native artifacts correct percentage-sized bitmap images
inflating nested grid minima on iOS/Android, and an iOS layout loop when a
custom-measured foreign host returns zero. Explicit image minimum sizes remain
effective. The Android foreign flex/stretch height correction remains covered
by native resize and intrinsic-content regression tests. Android container
roots also recompute stale descendant layouts for the final frame assigned
by a foreign parent, rather than retaining a preceding intrinsic measurement.
On iOS, completed host measurements cancel older queued provisional computes
that could otherwise overwrite the final layout with zero dimensions. Reusing
a settled root measurement also restores its matching layout if another
intrinsic query has since changed the tree.

For these corrections, native layout suites pass on iOS Simulator (19 tests)
and the Android emulator (20 tests). Packed NativeScript image probes pass on
both; the iOS collapsed-screen heartbeat checks also pass. The broader coverage
below describes earlier extraction qualification, not new physical-device or
OS-input verification of beta.2.

| Target | Evidence |
| --- | --- |
| iOS arm64 Simulator | Native regressions, compiled TSRX/hooks/styles, actual HID taps/swipes and cleanup pass |
| iOS arm64 device | Framework clients link; signed development app and native UI-test runner build; physical runtime unqualified |
| Android arm64-v8a | Native regressions, plain consumer, compiled TSRX/hooks/styles and real tap/swipe input pass on API 36 phone; API 35 emulator also passes |
| Windows / web | Not provided by this package |

NativeScript core 9.1.3 with Xplat's canonical patches is qualified through the
isolated renderer fixture; ordinary apps also pass separately. The Xplat native
preset retargets the renderer's Mason imports to core. See `plugin-README.md` for
reproduction and `native-types-README.md` for ambient SDK type requirements.

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

## Safe-area CSS environment values

Starting in `1.0.0-beta.1`, loaded Mason container roots automatically supply
`env(safe-area-inset-top/right/bottom/left)` from their owning native window.
Observation starts only when a subtree uses `env()`, is shared within each
window, and ends when the root unloads. The styles below need no app binding.

```css
.safe-area-content {
  padding-top: env(safe-area-inset-top, 0px);
}
```

For a custom presentation viewport, install an explicit source before the root
loads. It takes precedence over automatic observation. Call the returned
function when that host is disposed.

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

The automatic iOS source observes the owning `UIWindow` through a transparent,
non-interactive view. Android observes its native root before drawing, reads
system-bar/cutout insets through the existing AndroidX dependency, and converts
using that root's density. It excludes keyboard/IME insets and preserves other
inset listeners. No process-global active window or activity selects values.

Verification remains headless: parser, style-buffer transport, actual
NativeScript cascade, platform-adapter substitutes and host lifecycle tests.
Actual iOS/Android inset dispatch and layout remain unqualified. This resolver
covers Mason style buffers; it does not add `env()` support to ordinary
NativeScript controls or media queries. Xplat's qualification warning remains
until native layout is verified.
