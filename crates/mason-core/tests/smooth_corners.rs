use mason_core::smooth_corners::{decode, generate, Corner};
#[test]
fn javascript_reference() {
    let mut input = None;
    let mut expected = Vec::new();
    let mut index = 0;
    let check = |input: Option<Vec<f64>>, expected: &Vec<[f64; 8]>, index: usize| {
        if let Some(v) = input {
            let actual = generate(v[0], v[1], decode(&v[2..]).unwrap()).unwrap();
            assert_eq!(actual.len(), expected.len(), "case {index}: {v:?}");
            for (i, (a, b)) in actual.iter().zip(expected).enumerate() {
                for (j, (x, y)) in a.packed().into_iter().zip(b).enumerate() {
                    assert!(
                        (x - y).abs() < 1e-6,
                        "case {index} command {i} slot {j}: {x} != {y}; input {v:?}"
                    );
                }
            }
        }
    };
    for line in include_str!("fixtures/smooth-corners.txt")
        .lines()
        .filter(|s| !s.starts_with('#'))
    {
        if let Some(v) = line.strip_prefix("case ") {
            check(input.take(), &expected, index);
            expected.clear();
            index += 1;
            input = Some(v.split_whitespace().map(|s| s.parse().unwrap()).collect());
        } else {
            expected.push(
                line.split_whitespace()
                    .map(|s| s.parse().unwrap())
                    .collect::<Vec<_>>()
                    .try_into()
                    .unwrap(),
            );
        }
    }
    check(input, &expected, index);
}
#[test]
fn rejects_invalid_values() {
    for value in [f64::NAN, f64::INFINITY, f64::NEG_INFINITY, -1.] {
        assert!(generate(value, 40., [Corner::default(); 4]).is_err());
        let mut corners = [Corner::default(); 4];
        corners[2].radius = value;
        assert!(generate(40., 40., corners).is_err());
    }
    assert!(decode(&[0.; 19]).is_err());
    for (slot, value) in [
        (1, 5.),
        (1, f64::NAN),
        (2, -0.1),
        (2, 1.1),
        (3, 1.9),
        (4, 2.),
    ] {
        let mut values = [0.; 20];
        for i in 0..4 {
            values[i * 5 + 2] = 0.65;
            values[i * 5 + 3] = 4.;
            values[i * 5 + 4] = 1.;
        }
        values[slot] = value;
        assert!(decode(&values).is_err());
    }
}

#[test]
fn extreme_inputs_never_emit_nonfinite_commands() {
    use mason_core::smooth_corners::Curve;
    for curve in [
        Curve::Continuous,
        Curve::Squircle,
        Curve::Superellipse,
        Curve::Clothoid,
        Curve::Arc,
    ] {
        for radius in [0., f64::MIN_POSITIVE, 1e-200, 1e200, f64::MAX] {
            let c = Corner {
                radius,
                curve,
                exponent: f64::MAX,
                ..Corner::default()
            };
            if let Ok(path) = generate(100., 60., [c; 4]) {
                assert!(path
                    .iter()
                    .all(|c| c.packed().iter().all(|v| v.is_finite())));
            }
        }
    }
}
