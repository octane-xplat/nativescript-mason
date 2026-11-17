# Changelog

## 1.0.0-beta.11 — 2026-11-17

- Add built-in smooth-corner geometry and native iOS/Android surface integration. See [SMOOTH_CORNERS.md](./SMOOTH_CORNERS.md) for configuration and qualification boundaries.
- Refresh the iOS and Android native binaries and generated bridge declarations.

## 1.0.0-beta.10 — 2026-11-13

- Add the iOS-only `View.materialViewClass` factory for Mason roots backed by `UIVisualEffectView`.
- Include `MasonMaterialUIView` in the generated native declarations and iOS framework artifacts. Its children live in the effect's `contentView`, while callers own the effect.
