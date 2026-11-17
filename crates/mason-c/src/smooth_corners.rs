use mason_core::smooth_corners::{decode, generate};

/// Four corners in TL, TR, BR, BL order, five doubles each:
/// radius, curve (continuous=0,squircle=1,superellipse=2,clothoid=3,arc=4),
/// smoothing, exponent, preserveSmoothing (0/1). All units are caller-defined.
/// Returns required output doubles, or 0 for invalid input. A null/short output
/// is a sizing query and is never partially written. Each command occupies eight
/// doubles: M=0,x,y; L=1,x,y; C=2,x1,y1,x2,y2,x,y; A=3,cx,cy,r,start,sweep,x,y;
/// Z=4. Unused slots are zero. Angles are clockwise degrees in y-down coordinates.
/// Input and writable output must be valid nonoverlapping memory for their lengths.
#[no_mangle]
pub unsafe extern "C" fn mason_smooth_corners_path(
    width: f64,
    height: f64,
    corners: *const f64,
    corners_len: usize,
    output: *mut f64,
    output_len: usize,
) -> usize {
    if corners.is_null() || corners_len != 20 {
        return 0;
    }
    let Ok(corners) = decode(std::slice::from_raw_parts(corners, corners_len)) else {
        return 0;
    };
    let Ok(commands) = generate(width, height, corners) else {
        return 0;
    };
    let required = commands.len() * 8;
    if !output.is_null() && output_len >= required {
        for (i, command) in commands.into_iter().enumerate() {
            std::ptr::copy_nonoverlapping(command.packed().as_ptr(), output.add(i * 8), 8);
        }
    }
    required
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn sizing_validation_and_atomic_write() {
        let mut config = [0.; 20];
        for i in 0..4 {
            config[i * 5] = 24.;
            config[i * 5 + 2] = 0.65;
            config[i * 5 + 3] = 4.;
            config[i * 5 + 4] = 1.;
        }
        unsafe {
            let size =
                mason_smooth_corners_path(100., 60., config.as_ptr(), 20, std::ptr::null_mut(), 0);
            assert!(size > 0);
            let mut output = vec![99.; size];
            assert_eq!(
                mason_smooth_corners_path(
                    100.,
                    60.,
                    config.as_ptr(),
                    20,
                    output.as_mut_ptr(),
                    size - 1
                ),
                size
            );
            assert!(output.iter().all(|x| *x == 99.));
            assert_eq!(
                mason_smooth_corners_path(
                    100.,
                    60.,
                    config.as_ptr(),
                    20,
                    output.as_mut_ptr(),
                    size
                ),
                size
            );
            assert_eq!(output[0], 0.);
            config[1] = 5.;
            let previous = output.clone();
            assert_eq!(
                mason_smooth_corners_path(
                    100.,
                    60.,
                    config.as_ptr(),
                    20,
                    output.as_mut_ptr(),
                    size
                ),
                0
            );
            assert_eq!(previous, output);
            assert_eq!(
                mason_smooth_corners_path(100., 60., std::ptr::null(), 20, std::ptr::null_mut(), 0),
                0
            );
        }
    }
}
