# Built-in smooth corners

Mason's Rust core generates the outline. The iOS and Android border renderers
consume the same absolute move, line, cubic, circular-arc and close commands.
No geometry package, registration step, extra child view or framework renderer
is required. The existing JavaScript implementation remains the browser reference;
this feature adds no browser WebAssembly requirement.

```ts
import { View, setSmoothCorners } from '@octane-xplat/nativescript-mason-core';

const card = new View();
setSmoothCorners(card, 24); // continuous, in device-independent pixels
setSmoothCorners(card, {
  topLeft: { radius: 24, curve: 'squircle', smoothing: 0.6 },
  topRight: { radius: 24, curve: 'superellipse', exponent: 4 },
  bottomRight: { radius: 16, curve: 'clothoid' },
  bottomLeft: 8,
});
setSmoothCorners(card, null); // restore authored CSS border radii/corner shapes
```

A number or `{ radius, ...options }` applies to every corner. A per-corner
object defaults omitted corners to zero. Defaults are `curve: 'continuous'`,
`smoothing: 0.65`, `exponent: 4`, `preserveSmoothing: true`. Curves are
`continuous`, `squircle`, `superellipse`, `clothoid`, and `arc`. Radius must be
finite and nonnegative, smoothing must be in `[0,1]`, and exponent must be finite
and at least 2. Native radii must also fit the platform's finite float range.
Invalid updates fail before replacing the current settings.

Continuous is the fixed Rosenfeld/Apple reference curve. Squircle uses smoothing
and preserveSmoothing, including capsule and constrained-size blending.
Superellipse uses exponent; clothoid uses smoothing. The other settings do not
change those families, matching the browser reference. Rust distributes the edge
budget between competing corners and fits oversized radii. Zero dimensions produce
a closed, zero-area outline. Native borders inset each corner conservatively by
the larger adjacent inset, retaining its curve family.

The setting shapes the existing background and style-painted borders. Authored
CSS radii remain stored while smooth corners are active. Normal layout and size
changes refresh the outline; clearing restores the current CSS values. The helper
accepts Mason View/Scroll wrappers; native clients can call
`style.setSmoothCorners(values)` directly and check its boolean result. Values
are TL, TR, BR, BL, each containing `[radius, curveId, smoothing, exponent,
preserveSmoothing]`, with curve IDs 0–4 in the order listed above and preserve 0/1.

Visible overflow leaves descendants unmasked. Hidden overflow uses the matching
outline through Mason's existing clip owner, composed with CSS masks/clip-paths.
Clipped-out regions are rejected by native hit testing and element-from-point.
Outset CSS box shadows stay with Mason's sibling/parent shadow owner, outside the
content clip; inset and outset shadow geometry use the same outline. No new
listener, display layer or native pointer needs explicit disposal. Existing
border-image semantics remain: border images are not shaped like style-painted
borders. Android elevation outlines are not supplied by this API.

## Qualification and boundaries

- Rust: 1,200 pinned browser-reference command fixtures, plus validation and C
  buffer-ownership tests. Regenerate with
  `bun tools/smooth-corners/reference.ts FRAMEWORK_CHECKOUT LISSE_0_7_3_CORE_SOURCE`.
- Android: native instrumentation covers update, resize, reset, clip ownership,
  synthetic touch rejection and detach. Synthetic MotionEvents and native handler
  calls do not establish real OS-input behavior or pixel parity. An isolated
  NativeScript Android consumer also verifies mixed settings, update and reset
  through the native `getStyle()` bridge on the existing API 35 emulator.
- iOS: simulator/device engine archives and simulator Swift/Objective-C hosts
  compile and link. All three native corner tests pass on an iPhone 13 Pro Max
  running iOS 27.0.1, including same-size clipping updates, resize, reset, mask
  ownership and disposal. The complete core suite passes 36/38 tests: the scroll
  cancellation/momentum and suspension/overscroll tests fail on that device.
  These tests do not enable smooth corners; their failures remain unresolved.
  No real OS-input testing was performed. The simulator suite remains unexecuted.
- UIKit material effect roots reject this setting: their native effect surface
  needs its own adapter. Text/widgets/foreign controls, Android physical devices, shadow
  raster quality, border-image combinations and complex filters remain unqualified.
- Windows has Rust/C geometry availability but no WinUI outline adapter. AppKit,
  GTK and other hosts have no renderer supplied here. The TypeScript helper throws
  for unsupported native hosts. Downstream UI props remain separate work.

Run native builds under a `goddard-agent resource` reservation. The maintained
Android corner runner only reuses `elegant-fir-probe`, never creates devices:
`node tools/smooth-corners/run-android.mjs` (`--all` includes existing core tests).
iOS tests use `MASON_CORE_IOS_DEVICE=91D40099-A056-497D-A572-ADDDFD6A8F23 node
tools/mason-core/run-ios-tests.mjs --smooth-corners`. The build prerequisites are
`build-native.mjs ios`, `build-android-jni.mjs`, and each platform's
`build-*-host.mjs --tests` under `tools/mason-core`.

For a connected physical iPhone, build the device engine first and set
`MASON_CORE_IOS_DEVICE` to its UDID and `MASON_CORE_IOS_SIGNING_TEAM` to a local
development team when running `build-ios-host.mjs --device --tests`. Set
`MASON_CORE_IOS_PROVISIONING_UPDATES=1` only when automatic provisioning is needed.
Run `MASON_CORE_IOS_DEVICE=UDID node tools/mason-core/run-ios-tests.mjs --device
--smooth-corners` under a separate device reservation. The generated project uses
a minimal scene-based app host with dedicated bundle identifiers; the source demo
project is unchanged. Omit `--smooth-corners` to run the complete core suite.

Adapted algorithms and reference code retain the MIT notices in
`LICENSE-LISSE`, included in native outputs and packages.
