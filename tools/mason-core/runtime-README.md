# Mason core runtime prototype

This private build tests the layout-container API without MasonKit's HTML,
rich-text, or widget JavaScript modules. The separate
[iOS host prototype](ios-host-README.md) now builds and runs, but its artifacts
are not integrated into this package yet. This is not an installable
replacement for MasonKit yet.

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
adaptation. Its emitted JavaScript must match the full package.

The adaptation rules in `tools/mason-core/runtime-sources.mjs` reject unexpected
source structure so upstream changes require review. The new child-ownership
methods live in `tools/mason-core/container-members.mjs`. This projection is a
temporary way to test the boundary while keeping the full package untouched;
it is not the proposed final upstream module structure.

Native bridge declarations from the full source remain a build-only input.
They are not copied into this package, and `skipLibCheck` is used by the isolated
consumer just as in the existing NativeScript package build. This does not
qualify independent bridge metadata or native ABI compatibility.

Still required before Xplat adoption: independent iOS and Android view/scroll
hosts and plugin packaging, native foreign-control measurement/invalidation,
real scrolling and hit-testing, style/lifecycle regressions, and matching
release-build size measurements. Windows is not qualified by this prototype.
