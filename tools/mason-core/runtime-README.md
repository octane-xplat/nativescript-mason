# Mason core runtime prototype

This private build tests the layout-container API without MasonKit's HTML,
rich-text, or widget JavaScript modules. The separate
[iOS host prototype](ios-host-README.md) and Android host build independently.
The [plugin proof](plugin-README.md) assembles those artifacts with this runtime
for isolated NativeScript applications. This runtime-only artifact still needs
native hosts and is not a production replacement for MasonKit.

The intended API accepts ordinary NativeScript controls as children:

```ts
import { Label } from '@nativescript/core';
import { View, Scroll } from '@octane-xplat/nativescript-mason-core';

const content = new View();
content.style.display = 'grid';
content.style.gridTemplateColumns = '1fr 1fr';
content.addChild(new Label());

const viewport = new Scroll();
viewport.addChild(content);
viewport.scrollTo({ top: 100, behavior: 'smooth' });
```

Core has no `innerHTML`, HTML intrinsic exports, or raw text-node children. Use a
NativeScript `Label` for text. Remove a child from its old parent before adding
it to another container. Child indices must be integers from zero through the
current child count; replacement requires an existing index.

## Build and verify

Run these commands from the Mason repository root:

```sh
pnpm exec nx run nativescript-mason-core:build.runtime
pnpm exec nx run nativescript-mason-core:verify.runtime
```

The build writes `dist/prototypes/nativescript-mason-core`. It leaves the
portable helper package at `dist/packages/nativescript-mason-core` separate.
Verification packs the runtime, follows both platform import graphs, checks an
isolated TypeScript consumer with NativeScript's bundler resolution, and tests
child ownership using NativeScript's real JavaScript view classes.

## Source ownership and qualification

The unchanged sources live under `packages/nativescript-mason-core`. The
prototype generates core-specific `common.ts`, `tree/`, and root types from the
full source in `tmp/nativescript-mason-core`; it does not change the full
package's text/HTML implementation. `properties.ts` has a generated type-only
adaptation. Its emitted JavaScript must match the full package under the same
iOS/Android platform constant: this prototype resolves `__WINDOWS__` to `false`
at build time because no Windows wrapper is shipped. Standard NativeScript
webpack does not define that flag. The verifier applies the same constant to
the full emission before comparison. The generated `style.ts` also omits
`copyTextStyleTo`, which only copies Windows rich-text runs. Its Windows-only
guard must retain the expected structure; every other shared implementation
difference still fails comparison. The tracked style source remains unchanged.

The generated foreign-view helper also cancels queued style writes on release.
Without that cancellation, removing and destroying a label in the same turn as
adoption leaves a queued native sync targeting its cleared native view. The
regression exercises the real style queue and confirms that a replacement
native view still receives its writes. This adaptation stays in the core
projection; the moved `foreign-layout.ts` source and full package are unchanged.

The adaptation rules in `tools/mason-core/runtime-sources.mjs` reject unexpected
source structure so upstream changes require review. The new child-ownership
methods live in `tools/mason-core/container-members.mjs`. This projection is a
temporary way to test the boundary while keeping the full package untouched;
it is not the proposed final upstream module structure.

The package supplies its own generated Android/iOS bridge declarations under
`typings/`, with native artifact and tool hashes in `typings/manifest.json`.
The compiler records its actual input files and rejects full MasonKit types.
Consumers still need the standard NativeScript SDK ambient declarations and
`skipLibCheck`, as in the existing NativeScript build. A build-only Windows
facade types preserved inactive branches; it is not shipped and does not
establish Windows support. See [native type generation](native-types-README.md).

The isolated NativeScript apps pass bridge, geometry and ownership checks on
iOS Simulator and Android. Still required before Xplat adoption: the actual
Xplat renderer, real scrolling and hit-testing, iOS device packaging,
representative full-package native regressions and matching release-build size
measurements. Windows is not qualified by this prototype.
