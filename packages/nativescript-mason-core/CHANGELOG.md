# Changelog

## 1.0.0-beta.13 — 2026-11-22

- Sync the shared layout engine and native hosts through upstream commit `331b587b`.
- Add pointer-event dispatch and pointer capture to the independent iOS and Android hosts.
- Refresh both mobile native artifacts and their generated bridge declarations.

## 1.0.0-beta.12 — 2026-11-17

- Fix `setSmoothCorners` on Android when NativeScript exposes the native style through `getStyle()`.

## 1.0.0-beta.11 — 2026-11-17

- Add built-in smooth-corner geometry and native iOS/Android surface integration. See [SMOOTH_CORNERS.md](./SMOOTH_CORNERS.md) for configuration and qualification boundaries.
- Refresh the iOS and Android native binaries and generated bridge declarations.

## 1.0.0-beta.10 — 2026-11-13

- Add the iOS-only `View.materialViewClass` factory for Mason roots backed by `UIVisualEffectView`.
- Include `MasonMaterialUIView` in the generated native declarations and iOS framework artifacts. Its children live in the effect's `contentView`, while callers own the effect.
