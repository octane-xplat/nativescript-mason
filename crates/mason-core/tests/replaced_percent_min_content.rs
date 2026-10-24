// A percentage-sized replaced leaf (an image) must not inflate a `1fr`
// track's minimum: CSS resolves the cyclic percentage against zero for its
// min-content contribution (css-sizing-3 §5.2.2). Chromium lays these tiles
// out at 201 + 201 in a 402-wide grid.
use mason_core::{Id, Mason, MeasureOutput};
use std::ffi::{c_float, c_longlong, c_void};
use taffy::prelude::*;
use taffy::style::{Dimension, Display};

// A 360×640 bitmap: one known axis derives the other through its aspect.
extern "C" fn image(
    _: *const c_void,
    kw: c_float,
    kh: c_float,
    _aw: c_float,
    _ah: c_float,
) -> c_longlong {
    let (w, h) = match (kw.is_nan(), kh.is_nan()) {
        (false, false) => (kw, kh),
        (false, true) => (kw, kw * 640.0 / 360.0),
        (true, false) => (kh * 360.0 / 640.0, kh),
        (true, true) => (360.0, 640.0),
    };
    MeasureOutput::make(w, h)
}

fn column(
    mason: &mut Mason,
    keep: &mut Vec<mason_core::NodeRef>,
    f: impl FnOnce(&mut mason_core::style::Style),
) -> Id {
    let node = mason.create_node();
    let id = node.id();
    keep.push(node);
    mason.with_style_mut(id, |s| {
        s.set_display(Display::Flex);
        s.set_flex_direction(FlexDirection::Column);
        f(s);
    });
    id
}

fn leaf(
    mason: &mut Mason,
    keep: &mut Vec<mason_core::NodeRef>,
    replaced: bool,
    min_width: f32,
) -> Id {
    let node = mason.create_node();
    let id = node.id();
    keep.push(node);
    mason.with_style_mut(id, |s| {
        s.set_item_is_replaced(replaced);
        if min_width > 0.0 {
            s.set_min_size(Size {
                width: Dimension::length(min_width),
                height: Dimension::auto(),
            });
        }
        s.set_size(Size {
            width: Dimension::percent(1.0),
            height: Dimension::percent(1.0),
        });
    });
    mason.set_measure(id, Some(image), std::ptr::null_mut());
    id
}

fn tiles(nested: bool, replaced: bool, min_width: f32) -> Vec<(f32, f32)> {
    let mut mason = Mason::new();
    let mut keep = vec![];
    let grid_node = mason.create_node();
    let grid = grid_node.id();
    mason.with_style_mut(grid, |s| {
        s.set_display(Display::Grid);
        s.set_grid_template_columns_css("1fr 1fr");
        s.set_size(Size {
            width: Dimension::length(402.0),
            height: Dimension::auto(),
        });
    });
    let mut ids = vec![];
    for _ in 0..2 {
        let tile = column(&mut mason, &mut keep, |s| {
            s.set_size(Size {
                width: Dimension::auto(),
                height: Dimension::length(402.0),
            })
        });
        let image = leaf(&mut mason, &mut keep, replaced, min_width);
        if nested {
            let grow = column(&mut mason, &mut keep, |s| s.set_flex_grow(1.0));
            mason.append_node(grow, &[image]);
            mason.append_node(tile, &[grow]);
        } else {
            mason.append_node(tile, &[image]);
        }
        ids.push(tile);
    }
    mason.append_node(grid, &ids);
    mason.compute_wh(grid, 402.0, f32::NAN);
    ids.iter()
        .map(|&id| {
            let l = mason.layout_raw(id);
            (l.location.x, l.size.width)
        })
        .collect()
}

#[test]
fn percentage_replaced_leaves_do_not_inflate_nested_grid_tracks() {
    for nested in [true, false] {
        let tiles = tiles(nested, true, 0.0);
        for (index, (x, width)) in tiles.iter().enumerate() {
            assert!((width - 201.0).abs() < 0.01, "nested={nested}: {tiles:?}");
            assert!((x - index as f32 * 201.0).abs() < 0.01);
        }
    }
}

#[test]
fn ordinary_measured_content_keeps_its_intrinsic_minimum() {
    assert_eq!(tiles(true, false, 0.0), vec![(0.0, 360.0), (360.0, 360.0)]);
    assert_eq!(
        tiles(false, false, 0.0),
        vec![(0.0, 226.125), (226.125, 226.125)]
    );
}

#[test]
fn authored_minimum_still_wins_over_the_cyclic_percentage() {
    for nested in [true, false] {
        assert_eq!(
            tiles(nested, true, 250.0),
            vec![(0.0, 250.0), (250.0, 250.0)]
        );
    }
}
