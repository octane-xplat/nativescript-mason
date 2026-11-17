//! Framework-neutral smooth rectangle geometry, in the caller's coordinate units.
//! Adapted from @lisse/core 0.7.3 (MIT, Jace Attard); see LICENSE-LISSE.
//! Continuous coefficients follow Octane's Rosenfeld/Apple reference at 862b67ba.
use std::f64::consts::{FRAC_PI_2, FRAC_PI_4, PI};

#[derive(Clone, Copy, Debug, PartialEq)]
#[repr(u8)]
pub enum Curve {
    Continuous,
    Squircle,
    Superellipse,
    Clothoid,
    Arc,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Corner {
    pub radius: f64,
    pub curve: Curve,
    pub smoothing: f64,
    pub exponent: f64,
    pub preserve_smoothing: bool,
}
impl Default for Corner {
    fn default() -> Self {
        Self {
            radius: 0.,
            curve: Curve::Continuous,
            smoothing: 0.65,
            exponent: 4.,
            preserve_smoothing: true,
        }
    }
}
impl Corner {
    pub fn validate(self) -> Result<(), &'static str> {
        if !self.radius.is_finite() || self.radius < 0. {
            return Err("radius must be finite and nonnegative");
        }
        if !self.smoothing.is_finite() || !(0. ..=1.).contains(&self.smoothing) {
            return Err("smoothing must be in [0,1]");
        }
        if !self.exponent.is_finite() || self.exponent < 2. {
            return Err("exponent must be finite and >= 2");
        }
        Ok(())
    }
}

/// Clockwise order: top-left, top-right, bottom-right, bottom-left.
pub type Corners = [Corner; 4];

/// Absolute y-down commands. Arc angles are degrees, positive clockwise.
#[derive(Clone, Copy, Debug, PartialEq)]
pub enum Command {
    Move(f64, f64),
    Line(f64, f64),
    Cubic([f64; 6]),
    Arc {
        cx: f64,
        cy: f64,
        radius: f64,
        start: f64,
        sweep: f64,
        x: f64,
        y: f64,
    },
    Close,
}
impl Command {
    /// Stable transport: eight doubles per command; opcodes M=0,L=1,C=2,A=3,Z=4.
    pub fn packed(self) -> [f64; 8] {
        match self {
            Self::Move(x, y) => [0., x, y, 0., 0., 0., 0., 0.],
            Self::Line(x, y) => [1., x, y, 0., 0., 0., 0., 0.],
            Self::Cubic(v) => [2., v[0], v[1], v[2], v[3], v[4], v[5], 0.],
            Self::Arc {
                cx,
                cy,
                radius,
                start,
                sweep,
                x,
                y,
            } => [3., cx, cy, radius, start, sweep, x, y],
            Self::Close => [4., 0., 0., 0., 0., 0., 0., 0.],
        }
    }
}

/// Decode the same 20-double configuration on C and JNI boundaries. No enum or
/// boolean is read from untrusted memory before validation.
pub fn decode(values: &[f64]) -> Result<Corners, &'static str> {
    if values.len() != 20 {
        return Err("expected four five-double corners");
    }
    let mut out = [Corner::default(); 4];
    for (c, v) in out.iter_mut().zip(values.chunks_exact(5)) {
        let curve = match v[1] {
            0. => Curve::Continuous,
            1. => Curve::Squircle,
            2. => Curve::Superellipse,
            3. => Curve::Clothoid,
            4. => Curve::Arc,
            _ => return Err("unknown curve"),
        };
        if v[4] != 0. && v[4] != 1. {
            return Err("preserveSmoothing must be 0 or 1");
        }
        *c = Corner {
            radius: v[0],
            curve,
            smoothing: v[2],
            exponent: v[3],
            preserve_smoothing: v[4] == 1.,
        };
        c.validate()?;
    }
    Ok(out)
}

#[derive(Clone, Copy, Default)]
struct Normalized {
    radius: f64,
    budget: f64,
}
fn normalize(w: f64, h: f64, corners: Corners) -> [Normalized; 4] {
    let mut radii = corners.map(|c| c.radius);
    let original = radii;
    let mut budgets = [-1.; 4];
    // Lisse's stable tie order is TL, TR, BL, BR.
    let mut order = [0, 1, 3, 2];
    order.sort_by(|&a, &b| original[b].partial_cmp(&original[a]).unwrap());
    for i in order {
        let (a, b) = match i {
            0 => (1, 3),
            1 => (0, 2),
            2 => (3, 1),
            _ => (2, 0),
        };
        let term = |j: usize, side: f64| {
            if original[i] == 0. && radii[j] == 0. {
                0.
            } else if budgets[j] >= 0. {
                side - budgets[j]
            } else {
                // Avoid overflow of two otherwise valid finite radii.
                let scale = original[i].max(radii[j]);
                (original[i] / scale) / (original[i] / scale + radii[j] / scale) * side
            }
        };
        budgets[i] = term(a, w).min(term(b, h)).max(0.);
        radii[i] = original[i].min(budgets[i]);
    }
    std::array::from_fn(|i| Normalized {
        radius: radii[i],
        budget: budgets[i],
    })
}

#[derive(Clone, Copy)]
enum Segment {
    Cubic([f64; 6]),
    Arc(f64, f64, f64),
}
#[derive(Default)]
struct Built {
    p: f64,
    segments: Vec<Segment>,
}
fn q(v: f64) -> f64 {
    if v.abs() > f64::MAX / 1e4 {
        v
    } else {
        (v * 1e4).round() / 1e4
    }
}
fn cubic(v: [f64; 6]) -> Segment {
    Segment::Cubic(v.map(q))
}
fn arc(r: f64, x: f64, y: f64) -> Segment {
    Segment::Arc(q(r), q(x), q(y))
}

struct Params {
    a: f64,
    b: f64,
    c: f64,
    d: f64,
    p: f64,
    chord: f64,
    r: f64,
}
fn params(r: f64, mut s: f64, preserve: bool, budget: f64) -> Params {
    if r <= 0. {
        return Params {
            a: 0.,
            b: 0.,
            c: 0.,
            d: 0.,
            p: 0.,
            chord: 0.,
            r: 0.,
        };
    }
    let mut p = (1. + s) * r;
    if !preserve {
        s = s.min(budget / r - 1.);
        p = p.min(budget);
    }
    let measure = 90. * (1. - s);
    let chord = (measure / 2.).to_radians().sin() * r * 2_f64.sqrt();
    let distance = r * ((90. - measure) / 4.).to_radians().tan();
    let beta = (45. * s).to_radians();
    let c = distance * beta.cos();
    let d = c * beta.tan();
    let mut b = (p - chord - c - d) / 3.;
    let mut a = 2. * b;
    if preserve && p > budget {
        let max = budget - d - chord - c;
        b = b.min(max - max / 6.);
        a = max - b;
        p = p.min(budget);
    }
    Params {
        a,
        b,
        c,
        d,
        p,
        chord,
        r,
    }
}
fn build(c: Corner, n: Normalized) -> Built {
    let r = n.radius;
    let budget = n.budget;
    if r <= 0. {
        return Built::default();
    }
    match c.curve {
        Curve::Continuous => {
            let r = r.min(budget / 1.528665);
            let points = [
                [1.08849296, 0.],
                [0.86840694, 0.],
                [0.63149379, 0.07491139],
                [0.37282383, 0.16905956],
                [0.16905956, 0.37282383],
                [0.07491139, 0.63149379],
                [0., 0.86840694],
                [0., 1.08849296],
                [0., 1.52866498],
            ];
            // Canonical TR segment starts at (vertexX-p,0).
            let p = 1.528665 * r;
            Built {
                p,
                segments: points
                    .chunks_exact(3)
                    .map(|v| {
                        Segment::Cubic([
                            p - v[0][0] * r,
                            v[0][1] * r,
                            p - v[1][0] * r,
                            v[1][1] * r,
                            p - v[2][0] * r,
                            v[2][1] * r,
                        ])
                    })
                    .collect(),
            }
        }
        Curve::Arc => {
            let p = r.min(budget);
            Built {
                p,
                segments: vec![arc(p, p, p)],
            }
        }
        Curve::Squircle => {
            let t = params(r, c.smoothing, c.preserve_smoothing, budget);
            Built {
                p: t.p,
                segments: vec![
                    cubic([t.a, 0., t.a + t.b, 0., t.a + t.b + t.c, t.d]),
                    arc(t.r, t.chord, t.chord),
                    cubic([t.d, t.c, t.d, t.b + t.c, t.d, t.a + t.b + t.c]),
                ],
            }
        }
        Curve::Superellipse => superellipse(r.min(budget), c.exponent),
        Curve::Clothoid => clothoid(r, c.smoothing, budget),
    }
}
fn superellipse(p: f64, n: f64) -> Built {
    let e = 2. / n;
    let power = |x: f64| {
        if n == 2. {
            x
        } else if n == 4. {
            x.sqrt()
        } else if n == 8. {
            x.sqrt().sqrt()
        } else {
            x.powf(e)
        }
    };
    let derivative = |x: f64| {
        if n == 2. {
            1.
        } else if n == 4. {
            1. / x.sqrt()
        } else {
            x.powf(e - 1.)
        }
    };
    let angles = [0., PI / 6., PI / 3., FRAC_PI_2];
    let points: [(f64, f64); 4] = std::array::from_fn(|i| {
        if i == 0 {
            (0., 0.)
        } else if i == 3 {
            (p, p)
        } else {
            (
                p * power(angles[i].sin()),
                p * (1. - power(angles[i].cos())),
            )
        }
    });
    let tangents: [(f64, f64); 4] = std::array::from_fn(|i| {
        if i == 0 {
            (1., 0.)
        } else if i == 3 {
            (0., 1.)
        } else {
            let dx = e * derivative(angles[i].sin()) * angles[i].cos() * p;
            let dy = e * derivative(angles[i].cos()) * angles[i].sin() * p;
            let m = (dx * dx + dy * dy).sqrt();
            let m = if m == 0. { 1. } else { m };
            (dx / m, dy / m)
        }
    });
    let mut segments = Vec::new();
    for i in 0..3 {
        let (x0, y0) = points[i];
        let (x1, y1) = points[i + 1];
        let (t0x, t0y) = tangents[i];
        let (t1x, t1y) = tangents[i + 1];
        let mid = (angles[i] + angles[i + 1]) / 2.;
        let rhsx = (8. / 3.) * (p * power(mid.sin()) - (x0 + x1) / 2.);
        let rhsy = (8. / 3.) * (p * (1. - power(mid.cos())) - (y0 + y1) / 2.);
        let det = t1x * t0y - t1y * t0x;
        let h0 = if det != 0. {
            (-t1y * rhsx + t1x * rhsy) / det
        } else {
            0.
        };
        let h1 = if det != 0. {
            (t0x * rhsy - t0y * rhsx) / det
        } else {
            0.
        };
        segments.push(cubic([
            h0 * t0x,
            h0 * t0y,
            x1 - h1 * t1x - x0,
            y1 - h1 * t1y - y0,
            x1 - x0,
            y1 - y0,
        ]));
    }
    Built { p, segments }
}
fn integrate(a: f64, l: f64) -> (f64, f64) {
    let step = l / 32.;
    let mut x = 0.;
    let mut y = 0.;
    for i in 1..=32 {
        let sa = (i - 1) as f64 * step;
        let sb = sa + step;
        let sm = (sa + sb) / 2.;
        let ta = (a / 2.) * sa * sa;
        let tb = (a / 2.) * sb * sb;
        let tm = (a / 2.) * sm * sm;
        x += (step / 6.) * (ta.cos() + 4. * tm.cos() + tb.cos());
        y += (step / 6.) * (ta.sin() + 4. * tm.sin() + tb.sin());
    }
    (x, y)
}
fn clothoid(r: f64, s: f64, budget: f64) -> Built {
    let theta = FRAC_PI_4 * s;
    let l = FRAC_PI_2 * r * s;
    let a = if l > 0. { 1. / (r * l) } else { 0. };
    let (mut x, mut y) = integrate(a, l);
    let (mut mx, mut my) = integrate(a, l / 2.);
    let mut p = x - r * theta.sin() + y + r * theta.cos();
    let mut er = r;
    if p > budget && p > 0. {
        let scale = budget / p;
        p = budget;
        er *= scale;
        x *= scale;
        y *= scale;
        mx *= scale;
        my *= scale;
    }
    let mut h0 = 0.;
    let mut h1 = 0.;
    if l > 0. {
        if theta.sin() > 1e-12 {
            h1 = ((8. / 3.) * (y / 2. - my)) / theta.sin();
        }
        h0 = (8. / 3.) * (mx - x / 2.) + h1 * theta.cos();
    }
    let mut segments = Vec::new();
    if l > 0. {
        segments.push(cubic([
            h0,
            0.,
            x - h1 * theta.cos(),
            y - h1 * theta.sin(),
            x,
            y,
        ]));
    }
    if (FRAC_PI_2 - 2. * theta).abs() > 1e-6 {
        segments.push(arc(er, p - x - y, p - x - y));
    }
    if l > 0. {
        segments.push(cubic([h1 * theta.sin(), h1 * theta.cos(), y, x - h0, y, x]));
    }
    Built { p, segments }
}

struct Pen {
    x: f64,
    y: f64,
    out: Vec<Command>,
}
impl Pen {
    fn new(x: f64, y: f64) -> Self {
        Self {
            x,
            y,
            out: vec![Command::Move(x, y)],
        }
    }
    fn line(&mut self, x: f64, y: f64) {
        self.out.push(Command::Line(x, y));
        self.x = x;
        self.y = y;
    }
    fn segment(&mut self, s: Segment, orient: usize) {
        let rotate = |x: f64, y: f64| match orient {
            1 => (x, y),
            2 => (-y, x),
            3 => (-x, -y),
            _ => (y, -x),
        };
        match s {
            Segment::Cubic(v) => {
                let (x1, y1) = rotate(v[0], v[1]);
                let (x2, y2) = rotate(v[2], v[3]);
                let (x, y) = rotate(v[4], v[5]);
                self.out.push(Command::Cubic([
                    self.x + x1,
                    self.y + y1,
                    self.x + x2,
                    self.y + y2,
                    self.x + x,
                    self.y + y,
                ]));
                self.x += x;
                self.y += y;
            }
            Segment::Arc(mut r, dx, dy) => {
                let (dx, dy) = rotate(dx, dy);
                let (x, y) = (self.x + dx, self.y + dy);
                if r <= 0. || (dx == 0. && dy == 0.) {
                    self.line(x, y);
                    return;
                }
                let (hx, hy) = (-dx / 2., -dy / 2.);
                let d2 = hx * hx + hy * hy;
                if d2 > r * r {
                    r *= (d2 / (r * r)).sqrt();
                }
                let factor = ((r * r - d2) / d2).max(0.).sqrt();
                let cx = (self.x + x) / 2. + factor * hy;
                let cy = (self.y + y) / 2. - factor * hx;
                let start = (self.y - cy).atan2(self.x - cx).to_degrees();
                let end = (y - cy).atan2(x - cx).to_degrees();
                let mut sweep = end - start;
                if sweep <= 0. {
                    sweep += 360.;
                }
                self.out.push(Command::Arc {
                    cx,
                    cy,
                    radius: r,
                    start,
                    sweep,
                    x,
                    y,
                });
                self.x = x;
                self.y = y;
            }
        }
    }
    fn corner(&mut self, b: &Built, o: usize) {
        if b.segments.is_empty() {
            return;
        }
        // Continuous is represented relative to the entry; later cubics are
        // relative to their own start, rather than the corner entry.
        for &s in &b.segments {
            self.segment(s, o);
        }
    }
    fn finish(mut self) -> Vec<Command> {
        self.out.push(Command::Close);
        self.out
    }
}

/// Generate a closed outline. Invalid values fail before a native path is touched.
pub fn generate(width: f64, height: f64, corners: Corners) -> Result<Vec<Command>, &'static str> {
    let commands = generate_inner(width, height, corners)?;
    if commands
        .iter()
        .any(|c| c.packed().iter().any(|v| !v.is_finite()))
    {
        return Err("geometry exceeds finite numeric range");
    }
    Ok(commands)
}

fn generate_inner(width: f64, height: f64, corners: Corners) -> Result<Vec<Command>, &'static str> {
    if !width.is_finite() || !height.is_finite() || width < 0. || height < 0. {
        return Err("dimensions must be finite and nonnegative");
    }
    for c in corners {
        c.validate()?;
    }
    if width == 0. || height == 0. {
        let mut p = Pen::new(0., 0.);
        for _ in 0..3 {
            p.line(0., 0.);
        }
        return Ok(p.finish());
    }
    let n = normalize(width, height, corners);
    let continuous = corners.iter().any(|c| c.curve == Curve::Continuous);
    if !continuous {
        if corners.iter().all(|c| c.radius == 0.) {
            let mut p = Pen::new(0., 0.);
            p.line(width, 0.);
            p.line(width, height);
            p.line(0., height);
            return Ok(p.finish());
        }
        if let Some(path) = blend(width, height, corners) {
            return Ok(path);
        }
        if let Some(path) = capsule(width, height, corners, n) {
            return Ok(path);
        }
    }
    let mut built: [Built; 4] = std::array::from_fn(|i| build(corners[i], n[i]));
    // Continuous table coordinates are relative to the corner's entry.
    for (i, b) in built.iter_mut().enumerate() {
        if corners[i].curve == Curve::Continuous {
            let mut x = 0.;
            let mut y = 0.;
            for s in &mut b.segments {
                if let Segment::Cubic(v) = s {
                    let nx = v[4];
                    let ny = v[5];
                    for j in (0..6).step_by(2) {
                        v[j] -= x;
                        v[j + 1] -= y;
                    }
                    x = nx;
                    y = ny;
                }
            }
        }
    }
    let round = |v: f64| if continuous { v } else { q(v) };
    let mut p = Pen::new(round(built[0].p), 0.);
    p.line(round(width - built[1].p), 0.);
    p.corner(&built[1], 1);
    if !continuous {
        p.line(round(width), round(built[2].p));
    }
    p.line(round(width), round(height - built[2].p));
    p.corner(&built[2], 2);
    if !continuous {
        p.line(round(width - built[3].p), round(height));
    }
    p.line(round(built[3].p), round(height));
    p.corner(&built[3], 3);
    if !continuous {
        p.line(0., round(height - built[0].p));
    }
    p.line(0., round(built[0].p));
    p.corner(&built[0], 0);
    Ok(p.finish())
}

fn cap(r: f64, c: Corner, long_half: f64) -> Built {
    let t = params(
        r,
        c.smoothing.min(long_half / r - 1.),
        c.preserve_smoothing,
        long_half,
    );
    let e = t.a + t.b + t.c;
    Built {
        p: t.p,
        segments: vec![
            cubic([t.a, 0., t.a + t.b, 0., e, t.d]),
            arc(r, t.p - e, r - t.d),
            arc(r, -(t.p - e), r - t.d),
            cubic([-t.c, t.d, -(t.b + t.c), t.d, -e, t.d]),
        ],
    }
}
fn capsule(w: f64, h: f64, c: Corners, n: [Normalized; 4]) -> Option<Vec<Command>> {
    let horizontal = w >= h;
    let r = w.min(h) / 2.;
    let is_cap = |a: usize, b: usize| {
        c[a].curve == Curve::Squircle
            && c[b].curve == Curve::Squircle
            && (n[a].radius - r).abs() < 1e-9
            && (n[b].radius - r).abs() < 1e-9
            && c[a].smoothing == c[b].smoothing
            && c[a].preserve_smoothing == c[b].preserve_smoothing
    };
    let (first, second) = if horizontal {
        (is_cap(0, 3), is_cap(1, 2))
    } else {
        (is_cap(0, 1), is_cap(3, 2))
    };
    if !first && !second {
        return None;
    }
    let b: [Built; 4] = std::array::from_fn(|i| build(c[i], n[i]));
    if horizontal {
        let left = cap(r, c[0], w / 2.);
        let right = cap(r, c[1], w / 2.);
        let mut p = Pen::new(q(if first { left.p } else { b[0].p }), 0.);
        p.line(q(w - if second { right.p } else { b[1].p }), 0.);
        if second {
            p.corner(&right, 1);
        } else {
            p.corner(&b[1], 1);
            p.line(q(w), q(b[2].p));
            p.line(q(w), q(h - b[2].p));
            p.corner(&b[2], 2);
        }
        if first {
            p.line(q(left.p), q(h));
            p.corner(&left, 3);
        } else {
            p.line(q(w - b[3].p), q(h));
            p.line(q(b[3].p), q(h));
            p.corner(&b[3], 3);
            p.line(0., q(h - b[0].p));
            p.line(0., q(b[0].p));
            p.corner(&b[0], 0);
        }
        Some(p.finish())
    } else {
        let top = cap(r, c[0], h / 2.);
        let bottom = cap(r, c[3], h / 2.);
        let mut p = if first {
            Pen::new(0., q(top.p))
        } else {
            Pen::new(q(b[0].p), 0.)
        };
        if first {
            p.corner(&top, 0);
        } else {
            p.line(q(w - b[1].p), 0.);
            p.corner(&b[1], 1);
        }
        p.line(q(w), q(h - if second { bottom.p } else { b[2].p }));
        if second {
            p.corner(&bottom, 2);
        } else {
            p.corner(&b[2], 2);
            p.line(q(b[3].p), q(h));
            p.corner(&b[3], 3);
        }
        if first {
            p.line(0., q(top.p));
        } else {
            p.line(0., q(h - b[0].p));
            p.line(0., q(b[0].p));
            p.corner(&b[0], 0);
        }
        Some(p.finish())
    }
}
fn blend(w: f64, h: f64, c: Corners) -> Option<Vec<Command>> {
    let u = c[0];
    if u.curve != Curve::Squircle
        || !c.iter().all(|v| {
            v.curve == u.curve
                && v.radius == u.radius
                && v.smoothing == u.smoothing
                && v.preserve_smoothing == u.preserve_smoothing
        })
    {
        return None;
    }
    let r = u.radius.min(w / 2.).min(h / 2.);
    let short = w.min(h) / 2.;
    if r <= 0. || short <= r + 1e-9 || short >= (1. + u.smoothing) * r - 1e-9 {
        return None;
    }
    let shoulder = |room: f64| {
        let s = (room / r - 1.).min(u.smoothing).max(0.);
        (
            params(r, s, u.preserve_smoothing, room),
            (45. * s).to_radians(),
        )
    };
    let (hs, ha) = shoulder(w / 2.);
    let (vs, va) = shoulder(h / 2.);
    let mut p = Pen::new(q(hs.p), 0.);
    for (cx, cy, ux, uy, vx, vy) in [
        (w, 0., -1., 0., 0., 1.),
        (w, h, 0., -1., -1., 0.),
        (0., h, 1., 0., 0., -1.),
        (0., 0., 0., 1., 1., 0.),
    ] {
        let (s1, a1) = if uy == 0. { (&hs, ha) } else { (&vs, va) };
        let (s2, a2) = if vy == 0. { (&hs, ha) } else { (&vs, va) };
        let ox = cx + (ux + vx) * r;
        let oy = cy + (uy + vy) * r;
        let j1x = ox - vx * r * a1.cos() - ux * r * a1.sin();
        let j1y = oy - vy * r * a1.cos() - uy * r * a1.sin();
        let j2x = ox - ux * r * a2.cos() - vx * r * a2.sin();
        let j2y = oy - uy * r * a2.cos() - vy * r * a2.sin();
        let x0 = cx + ux * s1.p;
        let y0 = cy + uy * s1.p;
        let x3 = cx + vx * s2.p;
        let y3 = cy + vy * s2.p;
        let arced = (j2x - j1x).hypot(j2y - j1y) > 1e-6;
        let (ex, ey) = if arced { (j2x, j2y) } else { (j1x, j1y) };
        p.line(q(x0), q(y0));
        p.segment(
            cubic([
                -ux * s1.a,
                -uy * s1.a,
                -ux * (s1.a + s1.b),
                -uy * (s1.a + s1.b),
                j1x - x0,
                j1y - y0,
            ]),
            1,
        );
        if arced {
            p.segment(arc(r, j2x - j1x, j2y - j1y), 1);
        }
        p.segment(
            cubic([
                x3 - vx * (s2.a + s2.b) - ex,
                y3 - vy * (s2.a + s2.b) - ey,
                x3 - vx * s2.a - ex,
                y3 - vy * s2.a - ey,
                x3 - ex,
                y3 - ey,
            ]),
            1,
        );
    }
    Some(p.finish())
}
