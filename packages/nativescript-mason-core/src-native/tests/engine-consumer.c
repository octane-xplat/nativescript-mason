#include "mason_native.h"
#include "style-offsets.h"
#include <assert.h>
#include <math.h>
#include <stdio.h>
#include <string.h>

// Exercises the shipped C ABI, not Rust internals or the full platform hosts.
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

static void byte_style(CMason *engine, CMasonNode *node, unsigned offset, uint8_t value) {
  mason_style_prepare_style_for_mut(engine, node);
  CMasonBuffer *buffer = mason_style_get_style_buffer(engine, node);
  assert(buffer != NULL && offset < buffer->size);
  buffer->data[offset] = value;
  mason_style_release_style_buffer(buffer);
  mason_node_mark_dirty(engine, node);
}

static void box_size(CMason *engine, CMasonNode *node, float width, float height) {
  mason_style_set_box_size(engine, node, width < 0 ? 0 : 1, width,
    height < 0 ? 0 : 1, height, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
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
  byte_style(engine, root, CORE_DISPLAY, 1); // Existing wire enum: flex.
  byte_style(engine, root, CORE_FLEX_DIRECTION, 0); // row
  byte_style(engine, root, CORE_ALIGN_ITEMS, 0); // start
  box_size(engine, root, 200, 100);
  box_size(engine, fixed, 40, 30);
  mason_node_add_child(engine, root, fixed);
  mason_node_add_child(engine, root, leaf);
  mason_node_compute_wh_and_layout(engine, root, 200, 100, capture);
  assert(layout_count == 3 && measure_calls > 0);
  close_to(layout[RECORD_FLOATS + 3], 40);
  close_to(layout[RECORD_FLOATS * 2 + 1], 40);
  close_to(layout[RECORD_FLOATS * 2 + 3], 80);
  close_to(layout[RECORD_FLOATS * 2 + 4], 25);
  puts("PASS: flex placement and callback-measured foreign leaf");

  const unsigned previous_calls = measure_calls;
  intrinsic.width = 110;
  intrinsic.height = 35;
  mason_node_mark_dirty(engine, leaf);
  mason_node_compute_wh_and_layout(engine, root, 200, 100, capture);
  assert(measure_calls > previous_calls);
  close_to(layout[RECORD_FLOATS * 2 + 3], 110);
  close_to(layout[RECORD_FLOATS * 2 + 4], 35);
  puts("PASS: intrinsic measurement invalidation");

  CMasonNode *removed = mason_node_remove_child(engine, root, leaf);
  assert(removed != NULL);
  mason_node_destroy(removed); // Removal returns another C wrapper, not ownership of leaf.
  CMasonNode *destination = mason_node_new_node(engine, false);
  mason_node_add_child(engine, destination, leaf);
  mason_node_compute_max_content_and_layout(engine, destination, capture);
  assert(layout_count == 2);
  close_to(layout[RECORD_FLOATS + 3], 110);
  close_to(layout[RECORD_FLOATS + 4], 35);
  mason_node_compute_wh_and_layout(engine, root, 200, 100, capture);
  assert(layout_count == 2);
  puts("PASS: removal and reparenting preserve the measured leaf");

  CMasonNode *grid = mason_node_new_node(engine, false);
  CMasonNode *left = mason_node_new_node(engine, false);
  CMasonNode *right = mason_node_new_node(engine, false);
  byte_style(engine, grid, CORE_DISPLAY, 2); // grid
  box_size(engine, grid, 200, 100);
  box_size(engine, left, 40, 20);
  box_size(engine, right, 60, 30);
  mason_style_update_non_buffer_data(engine, grid, NULL, NULL, NULL, NULL, NULL,
    NULL, NULL, NULL, "100px", "100px 100px", NULL, NULL);
  mason_node_add_child(engine, grid, left);
  mason_node_add_child(engine, grid, right);
  mason_node_compute_wh_and_layout(engine, grid, 200, 100, capture);
  assert(layout_count == 3);
  close_to(layout[RECORD_FLOATS + 1], 0);
  close_to(layout[RECORD_FLOATS * 2 + 1], 100);
  close_to(layout[RECORD_FLOATS * 2 + 3], 60);
  puts("PASS: grid parsing and placement through the public C ABI");

  CMasonNode *nodes[] = {root, fixed, leaf, destination, grid, left, right};
  for (unsigned i = 0; i < sizeof(nodes) / sizeof(nodes[0]); i++) mason_node_destroy(nodes[i]);
  mason_clear(engine);
  int64_t stats[7] = {0};
  mason_debug_stats(engine, stats, 7);
  assert(stats[0] == 0 && stats[6] == 0);
  mason_release(engine);
  puts("PASS: node wrappers and engine storage released");
  return 0;
}
