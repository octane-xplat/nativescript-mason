# Mason core extraction tooling

The prototype preserves MasonKit's published imports while relocating reusable
source into `packages/nativescript-mason-core`. It does not make the full package
depend on the core package at runtime. Native hosts have not been extracted yet. Separate native targets package the
existing shared Rust C interface as independent engine archives; see the
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

The math and color integration tests remain in the full package because they
also exercise its style layer. Helpers depending on NativeScript's style
sentinels, the text engine, or platform hosts remain with MasonKit until their
boundary is proved. No behavioral divergence is introduced by these moves.

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
