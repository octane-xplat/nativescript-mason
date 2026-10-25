// Qualification consumer for the desktop engine contract: it compiles against
// only the per-target generated mason_native.h and links the pinned archive,
// exercising the same mason_* surface desktop host adapters call — engine
// lifecycle, container and callback-measured leaf nodes, wholesale child
// replacement, mason_style_set_with_values, compute + layout records,
// natural-size queries, and teardown. Hand-declared externs are intentionally
// absent: the generated header is the contract.
#include "mason_native.h"
#include <assert.h>
#include <math.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>

// Layout records are the existing engine wire format consumed by MasonLayout.
#define RECORD_FLOATS 22
static float layout[RECORD_FLOATS * 8];
static uintptr_t layout_count;
static unsigned measure_calls;

typedef struct { float width, height; } IntrinsicSize;

static void close_to(float actual, float expected) {
  if (fabsf(actual - expected) > 0.01f) {
    fprintf(stderr, "Expected %.2f, got %.2f\n", expected, actual);
    assert(0);
  }
}

static long long measure(const void *context, float known_width, float known_height,
                         float available_width, float available_height) {
  (void) available_width;
  (void) available_height;
  const IntrinsicSize *size = context;
  const float width = isfinite(known_width) && known_width >= 0 ? known_width : size->width;
  const float height = isfinite(known_height) && known_height >= 0 ? known_height : size->height;
  uint32_t width_bits, height_bits;
  memcpy(&width_bits, &width, sizeof(width_bits));
  memcpy(&height_bits, &height, sizeof(height_bits));
  measure_calls++;
  return (long long)(((uint64_t)width_bits << 32) | height_bits);
}

static void *capture(const float *values, uintptr_t count) {
  assert(values != NULL);
  assert(count <= sizeof(layout) / sizeof(layout[0]));
  assert(count % RECORD_FLOATS == 0);
  memcpy(layout, values, count * sizeof(float));
  layout_count = count / RECORD_FLOATS;
  return NULL;
}

// Record indices in the 22-float wire format.
#define REC_ORDER 0
#define REC_X 1
#define REC_Y 2
#define REC_W 3
#define REC_H 4

// The facade entry point: enum code -1 leaves a field untouched; sizes are
// type/value pairs (0 auto, 1 length, 2 percent) for the auto-capable
// inset/margin/size fields and (0 length, 1 percent) for padding/border/gap.
static void set_style(CMason *engine, CMasonNode *node, int8_t display,
                      int8_t flex_direction, int8_t width_type, float width,
                      int8_t height_type, float height,
                      const char *grid_template_columns) {
  mason_style_set_with_values(engine, node, display, -1, -1, flex_direction, -1,
    -1, -1, -1, -1, -1, -1, -1,
    0, 0, 0, 0, 0, 0, 0, 0, // inset: auto
    1, 0, 1, 0, 1, 0, 1, 0, // margin: 0 length (auto margins absorb free space)
    0, 0, 0, 0, 0, 0, 0, 0, // padding: 0 length
    0, 0, 0, 0, 0, 0, 0, 0, // border: 0 length
    0, 1, 0, 0,             // flex grow/shrink, basis auto
    width_type, width, height_type, height,
    0, 0, 0, 0, 0, 0, 0, 0, // min/max size: auto
    0, 0, 0, 0,             // row/column gap: 0 length
    NAN,                    // aspect ratio: unset
    NULL, NULL, -1,         // grid auto rows/columns, auto-flow untouched
    NULL, NULL, NULL, NULL, NULL, NULL, // grid column/row placement
    NULL, grid_template_columns,        // grid template rows, columns
    -1, -1, 0, -1, -1,      // overflow x/y, scrollbar width, text align, box sizing
    NULL, NULL);            // grid area/areas
  mason_node_mark_dirty(engine, node);
}

int main(void) {
  CMason *engine = mason_init();
  assert(engine != NULL);
  mason_set_device_scale(engine, 1);

  CMasonNode *root = mason_node_new_node(engine, false);
  CMasonNode *fixed = mason_node_new_node(engine, false);
  IntrinsicSize intrinsic = { 80, 25 };
  CMasonNode *leaf = mason_node_new_node_with_context(engine, &intrinsic, measure);
  assert(root && fixed && leaf);
  set_style(engine, root, 1, 0, 1, 200, 1, 100, NULL); // flex, row, 200x100
  set_style(engine, fixed, -1, -1, 1, 40, 1, 30, NULL); // 40x30
  CMasonNode *children[] = { fixed, leaf };
  mason_node_set_children(engine, root, children, 2);
  mason_node_compute_wh(engine, root, 200, 100);
  mason_node_layout(engine, root, capture);
  assert(layout_count == 3 && measure_calls > 0);
  close_to(layout[RECORD_FLOATS + REC_W], 40);
  close_to(layout[RECORD_FLOATS * 2 + REC_X], 40);
  close_to(layout[RECORD_FLOATS * 2 + REC_W], 80);
  // Default align-items stretches the leaf's cross size to the 100px row.
  close_to(layout[RECORD_FLOATS * 2 + REC_H], 100);
  puts("PASS: flex placement and callback-measured foreign leaf");

  const unsigned previous_calls = measure_calls;
  intrinsic.width = 110;
  intrinsic.height = 35;
  mason_node_mark_dirty(engine, leaf);
  mason_node_compute_wh(engine, root, 200, 100);
  mason_node_layout(engine, root, capture);
  assert(measure_calls > previous_calls);
  close_to(layout[RECORD_FLOATS * 2 + REC_W], 110);
  puts("PASS: intrinsic measurement invalidation");

  // Reparent through wholesale child replacement, the facade pattern.
  CMasonNode *destination = mason_node_new_node(engine, false);
  assert(destination != NULL);
  CMasonNode *root_children[] = { fixed, destination };
  mason_node_set_children(engine, root, root_children, 2);
  mason_node_set_children(engine, destination, &leaf, 1);
  mason_node_compute_max_content_and_layout(engine, destination, capture);
  assert(layout_count == 2);
  close_to(layout[RECORD_FLOATS + REC_W], 110);
  close_to(layout[RECORD_FLOATS + REC_H], 35);
  puts("PASS: reparenting and natural-size query");

  // Grid through the same style entry point.
  CMasonNode *grid = mason_node_new_node(engine, false);
  CMasonNode *left = mason_node_new_node(engine, false);
  CMasonNode *right = mason_node_new_node(engine, false);
  set_style(engine, grid, 2, -1, 1, 200, 1, 100, "100px 100px");
  set_style(engine, left, -1, -1, 1, 40, 1, 20, NULL);
  set_style(engine, right, -1, -1, 1, 60, 1, 30, NULL);
  CMasonNode *grid_children[] = { left, right };
  mason_node_set_children(engine, grid, grid_children, 2);
  mason_node_compute_wh(engine, grid, 200, 100);
  mason_node_layout(engine, grid, capture);
  assert(layout_count == 3);
  close_to(layout[RECORD_FLOATS + REC_X], 0);
  close_to(layout[RECORD_FLOATS * 2 + REC_X], 100);
  close_to(layout[RECORD_FLOATS * 2 + REC_W], 60);
  puts("PASS: grid template parsing and placement");

  CMasonNode *nodes[] = { root, fixed, leaf, destination, grid, left, right };
  for (unsigned i = 0; i < sizeof(nodes) / sizeof(nodes[0]); i++) mason_node_destroy(nodes[i]);
  mason_clear(engine);
  int64_t stats[7] = { 0 };
  mason_debug_stats(engine, stats, 7);
  assert(stats[0] == 0 && stats[6] == 0);
  mason_release(engine);
  puts("PASS: node wrappers and engine storage released");
  return 0;
}
