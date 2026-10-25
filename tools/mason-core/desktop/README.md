# Desktop engine qualification fixture

`engine-consumer.c` is the downstream qualification consumer for the desktop
engine contract. `verify.native.desktop` compiles it against the per-target
generated `mason_native.h` shipped under `dist/native/mason-core/desktop/`,
links the matching pinned `mason-c` archive, and runs it on the target that
matches the build host.

The fixture deliberately uses only the surface desktop host adapters call:
`mason_init`/`mason_release`, `mason_set_device_scale`,
`mason_node_new_node`/`mason_node_new_node_with_context` (callback-measured
leaf), `mason_node_set_children`, `mason_node_mark_dirty`,
`mason_style_set_with_values`, `mason_node_compute_wh` + `mason_node_layout`,
`mason_node_compute_max_content_and_layout`, and teardown through
`mason_node_destroy`/`mason_clear`/`mason_debug_stats`. No hand-declared
externs: if a declared function were missing from the generated header the
compile would fail, and `verify.native.desktop` separately checks every
declared `mason_*` name against the archive's exported symbols per target —
Apple-only functions must be declared and exported on `aarch64-apple-darwin`
and absent on the Linux and Windows targets.

Assertions cover flex placement with measured foreign leaves, measurement
invalidation on dirty, reparenting through wholesale child replacement,
natural-size queries, grid template placement, and storage release.
