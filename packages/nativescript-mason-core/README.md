# Mason core extraction prototype

This private, unpublished package is the first extraction step toward an
independent Mason layout/scroll substrate. It currently contains five portable
style helpers moved unchanged from MasonKit. It has no runtime dependencies.
It does not yet provide layout hosts or scrolling and is not a replacement for
MasonKit in an application. Separate native engine build targets are described
in [the native proof](src-native/README.md); those artifacts are not part of
this helper tarball.

Build the prototype and check its packed artifact from the repository root:

```sh
pnpm exec nx run nativescript-mason-core:verify
```

The verification packs the built output and exercises it outside the workspace,
without NativeScript or MasonKit installed. Existing helper tests also run in
`pnpm test`. The prototype emits CommonJS so its artifact can execute directly
in this isolated Node consumer without rewriting the moved source's imports;
the eventual native package format remains open.

For example, an isolated consumer can evaluate a supported math expression
using its own unit resolver:

```js
const { evaluateCssMath } = require('@octane-xplat/nativescript-mason-core');
const result = evaluateCssMath('calc(1rem + 2px)', (value, unit) => {
  if (unit === 'px') return value;
  if (unit === 'rem') return value * 16;
  return undefined;
});
// result: { kind: 'length', px: 18 }
```

See `tools/mason-core/README.md` in the source checkout for source provenance
and the full-package overlay. The separate runtime, iOS host, and Android AAR
prototypes build; they are not integrated into this helper tarball. NativeScript
plugin packaging remains. See `tools/mason-core/android-host-README.md` for the
Android qualification boundary. No application-size savings are claimed.
