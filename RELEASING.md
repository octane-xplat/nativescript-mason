# Release MasonKit

The [Release workflow](.github/workflows/release.yml) publishes
`@octane-xplat/nativescript-masonkit` through npm trusted publishing. It uses
the native binaries checked into `platforms/`; it does not rebuild Rust,
Swift, Kotlin, or C++. Refresh those artifacts first when their sources change.

## Validate a release

Run a build without publishing:

```sh
gh workflow run release.yml --repo octane-xplat/nativescript-mason
```

The workflow checks types, tests, generated files, and the built tarball. Its
`npm-package` artifact contains the package that passed those checks.

## Publish

Commit the intended version in `packages/nativescript-masonkit/package.json`,
then publish a GitHub release with the matching `v<version>` tag. For example,
the current prerelease can be published with:

```sh
gh release create v1.0.0-beta.126 --repo octane-xplat/nativescript-mason \
  --target main --prerelease --generate-notes
```

Prereleases publish under npm's `next` tag; stable releases use `latest`.
The GitHub prerelease flag must agree with the package version. Alternatively,
publish the manifest version directly through a manual run:

```sh
gh workflow run release.yml --repo octane-xplat/nativescript-mason \
  -f publish=true -f tag=next
```

Each version can be published only once. A manual validation run is the default;
publishing requires either a GitHub release or the explicit `publish=true` input.

## Bootstrap npm trust once

The package must exist on npm before its publisher can be configured. Publish
a minimal `0.0.1` stub under the `bootstrap` tag, clearly stating that it has no
supported API. Then bind this repository and workflow:

```sh
npm trust github @octane-xplat/nativescript-masonkit \
  --repository octane-xplat/nativescript-mason --file release.yml --allow-publish
npm trust list @octane-xplat/nativescript-masonkit
```

The trust entry must name `octane-xplat/nativescript-mason` and `release.yml`.
GitHub Actions obtains a short-lived OIDC credential; no npm token secret is
needed. The bootstrap stub does not provide MasonKit functionality.

## Release Mason core independently

Core uses `core-v<version>` GitHub tags and its own manifest version. It does
not change or publish full MasonKit. The first beta is `1.0.0-beta.0`, under
npm's `next` tag. The `0.0.1` bootstrap stub uses `bootstrap` and has no API.

Core's workflow compiles the runtime from the tagged source and verifies the
packed plugin's file hashes, native resources, dependency boundary and version.
Native binaries are prepared on macOS, not rebuilt in the publishing job.
`tools/mason-core/release-native.json` pins the native input asset's SHA-256
and records the source commit used for those builds. The existing bridge
manifests also bind declarations to the native binary hashes. npm provenance
identifies the assembling/publishing workflow; it does not establish a
reproducible native build or additional device qualification.

After building and qualifying native artifacts using the core README:

1. Set the core manifest version and create the native input archive:

   ```sh
   mkdir -p tmp/core-release
   COPYFILE_DISABLE=1 tar -czf tmp/core-release/core-native-inputs.tgz \
     -C dist/native/mason-core ios-host/universal \
     android-host/MasonCore.aar android-host/manifest.json
   shasum -a 256 tmp/core-release/core-native-inputs.tgz
   ```

2. Update `tools/mason-core/release-native.json` with the matching release tag,
   archive checksum and native source commit. Commit the metadata and intended
   source, then push that commit to `main`.
3. Create a draft GitHub prerelease at that commit and upload the archive.
   For the first beta:

   ```sh
   gh release create core-v1.0.0-beta.0 --repo octane-xplat/nativescript-mason \
     --target main --draft --prerelease --title 'Mason core 1.0.0-beta.0' \
     --notes-file /path/to/release-notes.md
   gh release upload core-v1.0.0-beta.0 tmp/core-release/core-native-inputs.tgz \
     --repo octane-xplat/nativescript-mason
   ```

4. Validate the draft's inputs without publishing:

   ```sh
   gh workflow run release.yml --repo octane-xplat/nativescript-mason \
     -f package=core
   ```

5. After validation succeeds, publish the draft to trigger the npm release:

   ```sh
   gh release edit core-v1.0.0-beta.0 --draft=false \
     --repo octane-xplat/nativescript-mason
   ```

Bootstrap npm trust for `@octane-xplat/nativescript-mason-core` once, using the
same repository and `release.yml` binding shown above. Native inputs must be
uploaded before publishing the draft. Preserve released assets; replace them
only through a new version and checksum. The portable helper and runtime
intermediates remain private; only the assembled plugin is publishable.
