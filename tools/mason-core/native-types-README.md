# Independent Mason core bridge types

The runtime and plugin prototypes ship their own Android/iOS bridge declarations.
Their compiler inputs contain the standard NativeScript SDK types and core's
generated declarations, without full MasonKit native types. This is type/build
evidence; native ABI compatibility and application behavior have separate checks.

## Regenerate after changing a native host

Keep the generated `packages/nativescript-mason-core/typings/` files in Git so
ordinary JavaScript builds do not require native build tools. To update them,
first export both core native hosts and install the isolated consumer's pinned
SDK dependencies. An existing consumer app build is not required. Run this
target from the repository root under a native-build resource reservation:

```sh
pnpm exec nx run nativescript-mason-core:generate.native.types
pnpm exec nx run nativescript-mason-core:verify.runtime
pnpm exec nx run nativescript-mason-core:verify.plugin.prototype
```

Generation reads `MasonCore.aar` and the exported iOS Simulator framework directly.
It preserves SDK header discovery so inherited UIKit members are included, then
copies only MasonCore and its retained FontManager/SDWebImage declarations.
The manifest records native artifact hashes, generator provenance and every
declaration hash. Assembly rejects declarations for different native artifacts.
Consumers still supply NativeScript's platform ambient types and `skipLibCheck`.

## Android generator adaptation

NativeScript Android 9.1.1's declaration generator produces invalid TypeScript
for this core AAR: Kotlin parameter names can be invalid identifiers, ignored
generic types can leave unmatched brackets, and nested class namespaces can
have unmatched braces. Adding dependency JARs does not correct these syntax
errors. These are declaration-generation findings, not Android runtime failures.

The code-generation-only patch at
`tools/mason-core/patches/android-dts-generator.patch` applies to
[NativeScript/android-dts-generator at 5fcf6113](https://github.com/NativeScript/android-dts-generator/blob/5fcf611330bd9eb60d9bb45d5b37251980b127ab/dts-generator/src/main/java/com/telerik/dts/DtsApi.java).
It makes invalid parameter names positional, balances ignored generic types,
and emits complete nested namespace blocks. Generation verifies both the SDK
JAR and original source hashes, compiles the adapted class in an ignored staging
directory, and puts it before the unchanged SDK JAR on the generator classpath.
It does not modify the installed SDK or ship generator code in the plugin.
Review or remove this adaptation when adopting an upstream generator correction.

Generated files are parsed before use. The packed consumer checks native host
factories and rejects optional HTML APIs. Runtime compilation records its actual
input files and rejects full MasonKit declarations. The build-only Windows facade
is excluded from the archive; no Windows native host is qualified.
