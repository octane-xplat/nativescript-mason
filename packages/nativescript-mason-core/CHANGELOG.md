# Changelog

## 1.0.0-beta.10 — 2026-11-13

- Add the iOS-only `View.materialViewClass` factory for Mason roots backed by `UIVisualEffectView`.
- Include `MasonMaterialUIView` in the generated native declarations and iOS framework artifacts. Its children live in the effect's `contentView`, while callers own the effect.
