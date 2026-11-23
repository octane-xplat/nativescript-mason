//
//  ForeignRootResizeTests.swift
//  MasonTests
//
//  Reduced native repro for octane-xplat#172 / triniwiz#192.
//
//  An outer Mason tree hosts a grid whose single 1fr cell holds a `layer`
//  view; `layer` hosts a foreign (non-Mason) leaf — the RootLayout model —
//  which hosts a nested Mason root `B` as a plain UIView subview. While the
//  outer compute holds Rust's lock, the leaf's measure block measures `B`
//  through `measure(_:_:root:viewport:)`, which hits `deferredRootSize` and
//  reports `B`'s last applied layout until the queued key settles. When the
//  provisional size feeds the 1fr track's auto minimum and the bounded
//  `runPass` loop ends still stale, the subtree keeps the old frame.
//
//  Per step the test resizes `bounds`, invalidates the foreign leaf (the
//  RootLayout requestLayout hook), runs the outer compute, then plays the
//  host's foreign layout pass: `B` measured EXACTLY at the leaf's frame and
//  `B.frame` set to the leaf's bounds — what NativeScript's layout() does.
//
//  V1: baseline. V2: JS warmup before each outer compute. V3: extra outer
//  computes after a failing step. V4: outer root is a scroll container
//  driven through measure(root:viewport:) instead of computeWithSize.
//

import XCTest
@testable import Mason

// Core MeasureSpec packing (same scheme as CoreLayoutInteropTests): mode in
// the top two bits, device px below. Modes: 0 UNSPECIFIED, 1 EXACTLY, 2 AT_MOST.
private func spec(_ size: CGFloat, _ mode: Int) -> Int {
  (Int(size) & 0x3FFF_FFFF) | (mode << 30)
}

private func specMode(_ s: Int) -> Int {
  Int(UInt32(truncatingIfNeeded: s) >> 30)
}

private func specSize(_ s: Int) -> CGFloat {
  CGFloat(Int(UInt32(truncatingIfNeeded: s) & 0x3FFF_FFFF))
}

private func specName(_ s: Int) -> String {
  switch specMode(s) {
  case 1: return "EXACTLY(\(specSize(s)))"
  case 2: return "AT_MOST(\(specSize(s)))"
  default: return "UNSPEC(\(specSize(s)))"
  }
}

private func unpack(_ packed: Double) -> CGSize {
  let width = (packed / 16_777_216).rounded(.down)
  return CGSize(width: width, height: packed - width * 16_777_216)
}

private func fmt(_ size: CGSize) -> String {
  String(format: "%.1fx%.1f", size.width, size.height)
}

private func fmt(_ rect: CGRect) -> String {
  String(format: "(%.1f,%.1f %.1fx%.1f)", rect.origin.x, rect.origin.y, rect.size.width, rect.size.height)
}

/// B's true content height for a host width `w` pt: the box is width:100%
/// with aspectRatio 360/640, so height px = w*scale*640/360; in points that
/// is w*16/9 regardless of scale.
private func intrinsicHeight(_ w: CGFloat) -> CGFloat {
  w * 16.0 / 9.0
}

private struct StepOutcome {
  let index: Int
  let expected: CGSize
  let scale: CGFloat
  let bounds: CGRect
  let layer: CGRect
  let leaf: CGRect
  let b: CGRect
  let stage: CGRect
  let bLayout: CGSize
  /// The leaf is auto-sized (a foreign view reports its measured size), so a
  /// correct step has leaf/stage at B's intrinsic aspect height — not bounds
  /// height. `layer` fills the 1fr track: max(bounds height, min-content).
  var heightOK: Bool {
    let intrinsic = intrinsicHeight(expected.width)
    return abs(leaf.height - intrinsic) <= 1.0
      && abs(stage.height - intrinsic) <= 1.0
      && abs(layer.height - max(expected.height, intrinsic)) <= 1.0
      && abs(bLayout.height - intrinsic * scale) <= 2.0
  }
  /// V5 (.vx-screen-shell): the leaf fills `layer`, so every level must equal
  /// the bounds height and B's computed layout must match it in device px.
  var fillOK: Bool {
    abs(layer.height - expected.height) <= 1.0
      && abs(leaf.height - expected.height) <= 1.0
      && abs(b.height - expected.height) <= 1.0
      && abs(stage.height - expected.height) <= 1.0
      && abs(bLayout.height - expected.height * scale) <= 2.0
  }
}

/// The tree under test and the host-side drivers. All sizes in/out of Mason
/// are device px (`* scale`); UIKit frames are points.
private final class ForeignRootFixture {
  let mason: NSCMason
  let scale: CGFloat
  let screenW: CGFloat = 402
  let screenH: CGFloat = 874

  let outer: MasonUIView
  let bounds: MasonUIView
  let grid: MasonUIView
  let sibling: MasonUIView
  let layer: MasonUIView
  let leaf = UIView()
  let b: MasonUIView
  let stage: MasonUIView
  let box: MasonUIView

  var trace: [String] = []
  var measureCall = 0
  /// runPass iterations observed per outer compute: each pass begins with an
  /// empty deferredRootSizes queue (settle clears it between passes).
  var passCount = 0
  var stepPasses = 0

  init(mason: NSCMason, scrollRoot: Bool, shellLeaf: Bool = false, followUp: Bool = false) {
    self.mason = mason
    self.scale = CGFloat(NSCMason.scale)

    outer = MasonUIView(mason: mason)
    bounds = MasonUIView(mason: mason)
    grid = MasonUIView(mason: mason)
    sibling = MasonUIView(mason: mason)
    layer = MasonUIView(mason: mason)
    b = MasonUIView(mason: mason)
    stage = MasonUIView(mason: mason)
    box = MasonUIView(mason: mason)

    outer.display = .Flex
    outer.flexDirection = .Column
    // V6 only: a real frame lets a queued setNeedsLayoutPass recompute at the
    // viewport box (computeWithViewSize uses uiView.frame).
    if followUp {
      outer.frame = CGRect(x: 0, y: 0, width: screenW, height: screenH)
    }
    if scrollRoot {
      outer.isScrollContainer = true
      outer.overflowY = .Scroll
    }

    bounds.display = .Flex
    bounds.flexDirection = .Column

    grid.display = .Grid
    grid.gridTemplateRows = "1fr"
    grid.gridTemplateColumns = "1fr"
    grid.flexGrow = 1

    // Two same-cell items; the sibling is a small fixed box.
    sibling.gridArea = "1 / 1"
    sibling.setSize(50 * Float(scale), 50 * Float(scale))
    layer.gridArea = "1 / 1"
    layer.display = .Flex
    layer.flexDirection = .Column

    // Foreign leaf inside `layer`; B is a plain UIKit subview — its own root.
    layer.addView(leaf)
    if shellLeaf {
      // V5: style the foreign leaf like Xplat's `.vx-screen-shell` so it
      // fills `layer` instead of reporting only intrinsic content size.
      let s = mason.nodeForView(leaf).style
      s.flexGrow = 1
      s.flexShrink = 1
      s.alignSelf = .Stretch
      s.setMinSizeWidthHeight(0, 1)
    }
    leaf.addSubview(b)
    b.display = .Flex
    b.flexDirection = .Column
    b.setSizeWidth(1.0, 2)   // width: 100%
    b.setSizeHeight(1.0, 2)  // height: 100%

    stage.display = .Grid
    stage.gridTemplateRows = "1fr"
    stage.gridTemplateColumns = "1fr"
    stage.flexGrow = 1
    stage.flexShrink = 1
    stage.setMinSizeHeight(0, 1)

    box.setSizeWidth(1.0, 2) // width: 100%
    box.aspectRatio = Float(360.0 / 640.0)

    stage.addView(box)
    b.addView(stage)
    grid.addView(sibling)
    grid.addView(layer)
    bounds.addView(grid)
    outer.addView(bounds)

    // The leaf's measure block mirrors `View._masonMeasureForeign`: the spec
    // EXACTLY(known) / AT_MOST(available) / UNSPECIFIED(0) core would build,
    // a single-cell GridLayout measuring its child under that same spec,
    // then resolving its own box per spec mode (EXACTLY→spec,
    // AT_MOST→min(child,spec), UNSPECIFIED→child). Sizes are device px.
    mason.setMeasure(for: leaf) { [weak self, weak b] knownW, knownH, availW, availH in
      guard let self = self, let b = b else { return .zero }
      self.measureCall += 1
      // A pass's first leaf measure finds the deferred queue empty (settle
      // clears it between runPass iterations).
      if b.node.deferredRootSizes.isEmpty { self.passCount += 1 }
      let ws = !knownW.isNaN ? spec(knownW, 1) : (availW > 0 ? spec(availW, 2) : spec(0, 0))
      let hs = !knownH.isNaN ? spec(knownH, 1) : (availH > 0 ? spec(availH, 2) : spec(0, 0))
      let inCompute = self.mason.inCompute
      let packed = b.measure(ws, hs, root: true, viewport: false)
      let child = unpack(packed)
      let w = specMode(ws) == 1 ? specSize(ws) : (specMode(ws) == 2 ? min(child.width, specSize(ws)) : child.width)
      let h = specMode(hs) == 1 ? specSize(hs) : (specMode(hs) == 2 ? min(child.height, specSize(hs)) : child.height)
      let queued = b.node.deferredRootSizes
        .map { "(\($0.available.width),\($0.available.height))->\($0.size.width)x\($0.size.height)" }
        .joined(separator: ",")
      let line = String(
        format: "  leaf measure #%d known=(%.1f,%.1f) avail=(%.1f,%.1f) specs=(%@,%@) inCompute=%@ B->%@px leaf->%@px queued=[%@]",
        self.measureCall, knownW, knownH, availW, availH,
        specName(ws), specName(hs),
        inCompute ? "true" : "false",
        fmt(child), fmt(CGSize(width: w, height: h)), queued)
      self.trace.append(line)
      print(line)
      return CGSize(width: w, height: h)
    }
  }

  /// The outer root's compute. V1-V3 drive it directly; V4 goes through
  /// `measure(root:viewport:)` the way View.onMeasure calls `mason_measure`
  /// on a scroll container root.
  func driveOuter() {
    if outer.isScrollContainer {
      _ = outer.measure(
        spec(screenW * scale, 1),
        spec(screenH * scale, 1),
        root: true, viewport: true)
    } else {
      outer.computeWithSize(Float(screenW * scale), Float(screenH * scale))
    }
  }

  /// Simulates NativeScript's foreign layout for the leaf's subtree: B is
  /// re-measured EXACTLY at the leaf's bounds (device px) and framed to the
  /// leaf's bounds — core's measureChild + layout() pair.
  func foreignLayout() {
    let w = leaf.bounds.size.width * scale
    let h = leaf.bounds.size.height * scale
    _ = b.measure(spec(w, 1), spec(h, 1), root: true, viewport: false)
    b.frame = leaf.bounds
    b.layoutIfNeeded()
  }

  /// One resize step: new bounds size, foreign invalidation (the RootLayout
  /// requestLayout hook), outer compute, foreign layout. Assertions read the
  /// synchronous outcome — the bug surface. `followUp` additionally spins
  /// the run loop so a queued host layout pass can re-run the outer compute,
  /// then models the host's foreign layout running once more (V6's next-turn
  /// observation only).
  @discardableResult
  func step(_ index: Int, _ w: CGFloat, _ h: CGFloat, warmup: Bool, followUp: Bool = false) -> StepOutcome {
    bounds.setSize(Float(w * scale), Float(h * scale))
    if warmup {
      // JS workaround: measure the nested root UNSPECIFIED outside the lock
      // so the deferred path reports a fresh intrinsic size.
      _ = b.measure(spec(0, 0), spec(0, 0), root: true, viewport: false)
    }
    mason.invalidateForeignView(leaf)
    let head = "step \(index): bounds -> \(w)x\(h)pt"
    trace.append(head)
    print(head)
    let before = passCount
    driveOuter()
    stepPasses = passCount - before
    foreignLayout()
    let blSync = b.node.computedLayout
    let syncLine = "  frames: bounds=\(fmt(bounds.frame)) layer=\(fmt(layer.frame)) leaf=\(fmt(leaf.frame)) B=\(fmt(b.frame)) stage=\(fmt(stage.frame)) B.computedLayout=\(String(format: "%.1fx%.1f", blSync.width, blSync.height))px passes=\(stepPasses) queuedLeft=\(b.node.deferredRootSizes.count)"
    trace.append(syncLine)
    print(syncLine)
    let outcome = StepOutcome(
      index: index, expected: CGSize(width: w, height: h), scale: scale,
      bounds: bounds.frame, layer: layer.frame, leaf: leaf.frame,
      b: b.frame, stage: stage.frame,
      bLayout: CGSize(width: CGFloat(blSync.width), height: CGFloat(blSync.height)))
    if followUp {
      RunLoop.main.run(until: Date().addingTimeInterval(0.2))
      foreignLayout()
      RunLoop.main.run(until: Date().addingTimeInterval(0.2))
      let blSettled = b.node.computedLayout
      let settledLine = "  settled: bounds=\(fmt(bounds.frame)) layer=\(fmt(layer.frame)) leaf=\(fmt(leaf.frame)) B=\(fmt(b.frame)) stage=\(fmt(stage.frame)) B.computedLayout=\(String(format: "%.1fx%.1f", blSettled.width, blSettled.height))px passes=\(passCount - before) queuedLeft=\(b.node.deferredRootSizes.count)"
      trace.append(settledLine)
      print(settledLine)
    }
    return outcome
  }
}

final class ForeignRootResizeTests: XCTestCase {

  private var mason: NSCMason!
  private let issue = "octane-xplat#172 / triniwiz#192: foreign leaf's deferred root measure feeds a stale size to the outer grid, frames keep the previous resize"

  override func setUpWithError() throws {
    mason = NSCMason()
  }

  override func tearDownWithError() throws {
    mason = nil
  }

  private let sizes: [(CGFloat, CGFloat)] = [
    (107, 400), (107, 300), (107, 500), (200, 500), (107, 300),
  ]

  private func attach(_ fixture: ForeignRootFixture, _ name: String) {
    let attachment = XCTAttachment(string: fixture.trace.joined(separator: "\n"))
    attachment.name = name
    attachment.lifetime = .keepAlways
    add(attachment)
  }

  private func assertStep(_ outcome: StepOutcome, _ variant: String) {
    XCTAssertTrue(
      outcome.heightOK,
      "\(variant) step \(outcome.index) expected intrinsic height \(intrinsicHeight(outcome.expected.width))pt (layer max(\(outcome.expected.height), intrinsic)): layer=\(outcome.layer.height) leaf=\(outcome.leaf.height) stage=\(outcome.stage.height) B.layout=\(outcome.bLayout.height)px")
  }

  private func assertFill(_ outcome: StepOutcome, _ variant: String) {
    XCTAssertTrue(
      outcome.fillOK,
      "\(variant) step \(outcome.index) expected fill height \(outcome.expected.height): layer=\(outcome.layer.height) leaf=\(outcome.leaf.height) B=\(outcome.b.height) stage=\(outcome.stage.height) B.layout=\(outcome.bLayout.height)px")
  }

  // MARK: - V1 baseline

  func test_v1_foreignRootResize_baseline() {
    let f = ForeignRootFixture(mason: mason, scrollRoot: false)
    defer { attach(f, "v1-trace") }
    for (i, size) in sizes.enumerated() {
      let outcome = f.step(i, size.0, size.1, warmup: false)
      if i == sizes.count - 1 {
        XCTExpectFailure(issue) { assertStep(outcome, "v1") }
      } else {
        assertStep(outcome, "v1")
      }
    }
  }

  // MARK: - V2 warmup (models the JS workaround; should pass)

  func test_v2_foreignRootResize_warmup() {
    let f = ForeignRootFixture(mason: mason, scrollRoot: false)
    defer { attach(f, "v2-trace") }
    for (i, size) in sizes.enumerated() {
      assertStep(f.step(i, size.0, size.1, warmup: true), "v2")
    }
  }

  // MARK: - V3 convergence: extra outer computes after a failing step

  func test_v3_foreignRootResize_extraPasses() {
    let f = ForeignRootFixture(mason: mason, scrollRoot: false)
    defer { attach(f, "v3-trace") }
    for (i, size) in sizes.enumerated() {
      let outcome = f.step(i, size.0, size.1, warmup: false)
      if i == sizes.count - 1 {
        XCTExpectFailure(issue) { assertStep(outcome, "v3") }
      } else {
        assertStep(outcome, "v3")
      }
      guard !outcome.heightOK else { continue }
      var converged = false
      for pass in 1...5 {
        // No changes: same bounds, no explicit foreign invalidation — only
        // what settleDeferredSizes itself dirtied.
        f.driveOuter()
        f.foreignLayout()
        let bl = f.b.node.computedLayout
        let line = "  step \(i) extra pass \(pass): layer=\(fmt(f.layer.frame)) leaf=\(fmt(f.leaf.frame)) B=\(fmt(f.b.frame)) stage=\(fmt(f.stage.frame)) B.layout=\(String(format: "%.1fx%.1f", bl.width, bl.height))px"
        f.trace.append(line)
        print(line)
        let intrinsic = intrinsicHeight(size.0)
        converged = abs(f.leaf.frame.height - intrinsic) <= 1.0
          && abs(f.stage.frame.height - intrinsic) <= 1.0
          && abs(f.layer.frame.height - max(size.1, intrinsic)) <= 1.0
        if converged { break }
      }
      let verdict = "  step \(i): \(converged ? "converged" : "did NOT converge") within 5 extra passes"
      f.trace.append(verdict)
      print(verdict)
    }
  }

  // MARK: - V4 scroll-container root via measure(root:viewport:)

  func test_v4_foreignRootResize_scrollRoot() {
    let f = ForeignRootFixture(mason: mason, scrollRoot: true)
    defer { attach(f, "v4-trace") }
    for (i, size) in sizes.enumerated() {
      let outcome = f.step(i, size.0, size.1, warmup: false)
      if i == sizes.count - 1 {
        XCTExpectFailure(issue) { assertStep(outcome, "v4") }
      } else {
        assertStep(outcome, "v4")
      }
    }
  }

  // MARK: - V5 CI-faithful: leaf styled like .vx-screen-shell (fills layer)

  func test_v5_foreignRootResize_screenShellLeaf() {
    let f = ForeignRootFixture(mason: mason, scrollRoot: false, shellLeaf: true)
    defer { attach(f, "v5-trace") }
    for (i, size) in sizes.enumerated() {
      let outcome = f.step(i, size.0, size.1, warmup: false)
      if i == sizes.count - 1 {
        XCTExpectFailure(issue) { assertFill(outcome, "v5") }
      } else {
        assertFill(outcome, "v5")
      }
    }
  }

  // MARK: - V6 next-turn model (logging only, no assertions)

  /// Same trees as V1/V5 but with the outer view framed at the viewport and
  /// two run-loop spins per step: the first lets any queued host layout pass
  /// run, the second re-models the foreign layout at the (possibly corrected)
  /// leaf frame. Answers whether the stale state persists across a UIKit
  /// turn when a follow-up pass is allowed to run.
  func test_v6_followUpPassModel() {
    for shell in [false, true] {
      let f = ForeignRootFixture(mason: mason, scrollRoot: false, shellLeaf: shell, followUp: true)
      defer { attach(f, shell ? "v6-shell-trace" : "v6-trace") }
      let head = "v6 \(shell ? "shell" : "intrinsic") leaf model"
      f.trace.append(head)
      print(head)
      for (i, size) in sizes.enumerated() {
        f.step(i, size.0, size.1, warmup: false, followUp: true)
      }
    }
  }
}
