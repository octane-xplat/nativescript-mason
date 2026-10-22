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
