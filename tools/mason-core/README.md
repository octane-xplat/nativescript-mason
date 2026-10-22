# Mason core extraction tooling

The prototype preserves MasonKit's published imports while relocating reusable
source into `packages/nativescript-mason-core`. It does not make the full package
depend on the core package at runtime. The separate
[runtime prototype](runtime-README.md) tests a container-only TypeScript API;
native view/scroll hosts have not been extracted yet. Separate native targets
package the existing shared Rust C interface as independent engine archives; see the
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
without changing those originals. The ordinary core build still emits only
portable helpers. No behavioral divergence is introduced by the moves.

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
