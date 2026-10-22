import MasonCore

// Link-only iOS proof: consume the XCFramework C module without importing MasonKit.
// Host execution is covered separately by engine-consumer.c.
let engine = mason_init()
precondition(engine != nil)
let node = mason_node_new_node(engine, false)
precondition(node != nil)
mason_style_set_box_size(engine, node, 1, 120, 1, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
mason_node_compute_wh(engine, node, 120, 80)
var width: Float = 0
var height: Float = 0
mason_node_get_unrounded_size(engine, node, &width, &height)
precondition(width == 120 && height == 80)
mason_node_destroy(node)
mason_clear(engine)
mason_release(engine)
