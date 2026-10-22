# Portable Mason helper proof

This private fixture verifies that five unchanged styling helpers execute and
provide declarations without NativeScript, MasonKit or DOM globals. It is
separate from the native core package.

```sh
pnpm exec nx run nativescript-mason-core:verify.helpers
```

Output lives in `dist/prototypes/nativescript-mason-core-helpers`. The real
native package is built by `nativescript-mason-core:build` into
`dist/packages/nativescript-mason-core`.
