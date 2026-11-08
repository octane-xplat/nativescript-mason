//
//  CoreLayoutInteropTests.swift
//  MasonTests
//
//  A Mason root hosting a foreign (non-Mason) container, itself hosting a
//  Mason child added as a plain UIView subview rather than through Mason's
//  node tree — that child is its own root, measured from inside the foreign
//  container's own layout while the outer tree's compute holds Rust's lock.
//

import XCTest
@testable import Mason

/// Forces its child to resolve its own layout before reading its size,
/// simulating a core NativeScript layout container.
private final class ForeignSizingContainer: UIView {
  weak var masonChild: UIView?
  private(set) var sizeThatFitsCallCount = 0

  override func sizeThatFits(_ size: CGSize) -> CGSize {
    sizeThatFitsCallCount += 1
    masonChild?.setNeedsLayout()
    masonChild?.layoutIfNeeded()
    return masonChild?.bounds.size ?? .zero
  }
}

final class CoreLayoutInteropTests: XCTestCase {

  private var mason: NSCMason!

  override func setUpWithError() throws {
    mason = NSCMason.shared
  }

  override func tearDownWithError() throws {
    mason = nil
  }

  func test_droppedForeignViewReleasesItsNodeAndEngine() {
    weak var releasedView: UIView?
    weak var releasedNode: MasonNode?
    weak var releasedMason: NSCMason?
    autoreleasepool {
      let engine = NSCMason()
      let view = UIView()
      releasedMason = engine
      releasedView = view
      releasedNode = engine.nodeForView(view)
    }
    XCTAssertNil(releasedView, "the engine must not keep a foreign view alive")
    XCTAssertNil(releasedNode)
    XCTAssertNil(releasedMason, "foreign nodes must not form an engine retain cycle")
  }

  func test_removedForeignViewAndNodeAreReleased() {
    let root = MasonUIView(mason: mason)
    weak var releasedView: UIView?
    weak var releasedNode: MasonNode?
    autoreleasepool {
      let child = UIView()
      root.addView(child)
      releasedView = child
      releasedNode = mason.nodeForView(child)
      root.removeView(child)
    }
    XCTAssertNil(releasedView)
    XCTAssertNil(releasedNode)
    XCTAssertTrue(root.node.children.isEmpty)
  }

  func test_clearingAnEngineOnlyReleasesItsOwnForeignNodes() {
    let engine = NSCMason()
    let otherEngine = NSCMason()
    let view = UIView()
    weak var previous = engine.nodeForView(view)
    let otherNode = otherEngine.nodeForView(view)
    engine.clear()
    XCTAssertNil(previous)
    XCTAssertTrue(otherEngine.nodeForView(view) === otherNode)
    XCTAssertNotNil(engine.nodeForView(view).nativePtr)
  }

  /// A Mason root's compute must not deadlock when measuring a foreign leaf
  /// whose `sizeThatFits` forces layout on a nested Mason root. If this
  /// regresses, this test never returns.
  func test_nestedMasonRootInsideForeignContainerDoesNotDeadlockDuringOuterCompute() {
    let root = MasonUIView(mason: mason)
    root.frame = CGRect(x: 0, y: 0, width: 300, height: 300)

    let container = ForeignSizingContainer(frame: CGRect(x: 0, y: 0, width: 300, height: 100))

    let nested = MasonUIView(mason: mason)
    nested.setSize(120, 60)
    container.addSubview(nested)
    container.masonChild = nested

    root.addView(container)

    // Would hang forever pre-fix: measuring `container` forces `nested`
    // through a second, reentrant compute call on the same thread.
    root.computeWithSize(300, 300)

    XCTAssertGreaterThan(
      container.sizeThatFitsCallCount, 0,
      "outer compute should have measured the foreign container"
    )

    // The nested root's compute was deferred — let the posted main-queue
    // work run, across however many follow-up passes get scheduled.
    RunLoop.main.run(until: Date().addingTimeInterval(0.2))
    RunLoop.main.run(until: Date().addingTimeInterval(0.2))

    XCTAssertGreaterThan(
      nested.frame.width, 0,
      "nested Mason root should end up with a real computed size after the deferred pass runs"
    )
    XCTAssertGreaterThan(
      nested.frame.height, 0,
      "nested Mason root should end up with a real computed size after the deferred pass runs"
    )
  }

  private func spec(_ size: CGFloat, _ mode: Int) -> Int {
    (Int(size) & 0x3FFF_FFFF) | (mode << 30)
  }

  private func unpack(_ packed: Double) -> CGSize {
    let width = (packed / 16_777_216).rounded(.down)
    return CGSize(width: width, height: packed - width * 16_777_216)
  }

  /// A host bounding only the width still bounds it; only the open axis is max-content.
  func test_rootMeasureKeepsEachBoundedAxis() {
    let scale = CGFloat(NSCMason.scale)
    let root = MasonUIView(mason: mason)
    root.display = .Block
    let child = MasonUIView(mason: mason)
    child.display = .Block
    child.setSizeHeight(50 * NSCMason.scale, 1)
    root.addView(child)

    let size = unpack(root.measure(spec(300 * scale, 1), spec(0, 0), root: true, viewport: false))
    XCTAssertEqual(size, CGSize(width: (300 * scale).rounded(), height: (50 * scale).rounded()))
  }

  /// A scroll viewport is clamped to the bounded axis only.
  func test_rootMeasureClampsAViewportOnBoundedAxes() {
    let scale = CGFloat(NSCMason.scale)
    let root = MasonUIView(mason: mason)
    root.display = .Block
    let child = MasonUIView(mason: mason)
    child.setSize(400 * NSCMason.scale, 500 * NSCMason.scale)
    root.addView(child)

    let size = unpack(root.measure(spec(200 * scale, 2), spec(0, 0), root: true, viewport: true))
    XCTAssertEqual(size, CGSize(width: (200 * scale).rounded(), height: (500 * scale).rounded()))
  }

  /// A Mason root measured by a foreign leaf's host measure during the outer
  /// compute gets its real size in that same pass, not a turn later.
  func test_nestedRootMeasuredByAForeignHostSettlesInTheSamePass() {
    let scale = CGFloat(NSCMason.scale)
    let root = MasonUIView(mason: mason)
    root.display = .Flex
    root.alignItems = .FlexStart
    let leaf = UIView()
    let nested = MasonUIView(mason: mason)
    nested.setSize(120 * NSCMason.scale, 60 * NSCMason.scale)
    leaf.addSubview(nested)
    root.addView(leaf)

    var measures = 0
    mason.setMeasure(for: leaf) { [unowned self] _, _, availableWidth, availableHeight in
      measures += 1
      let width = availableWidth > 0 ? self.spec(availableWidth, 2) : self.spec(0, 0)
      let height = availableHeight > 0 ? self.spec(availableHeight, 2) : self.spec(0, 0)
      return self.unpack(nested.measure(width, height, root: true, viewport: false))
    }

    root.computeWithSize(Float(300 * scale), Float(300 * scale))
    XCTAssertGreaterThan(measures, 1, "the outer pass should rerun once the nested root settles")
    XCTAssertEqual(leaf.frame.size, CGSize(width: 120, height: 60))
    XCTAssertTrue(nested.node.deferredRootSizes.isEmpty)
    XCTAssertTrue(nested.node.settledRootSizes.isEmpty, "settled sizes only last for one outer compute")
  }

  /// Content changes reported during a compute are applied once it returns.
  func test_foreignInvalidationDuringAComputeWaitsForIt() {
    let root = MasonUIView(mason: mason)
    let leaf = UIView()
    root.addView(leaf)
    var width: CGFloat = 40
    var invalidated = false
    mason.setMeasure(for: leaf) { [unowned self] _, _, _, _ in
      if !invalidated {
        invalidated = true
        self.mason.invalidateForeignView(leaf)
      }
      return CGSize(width: width, height: 20)
    }
    root.computeWithSize(-2, -2)
    width = 80
    root.computeWithSize(-2, -2)
    XCTAssertEqual(leaf.frame.width * CGFloat(NSCMason.scale), 80, accuracy: 0.5)
  }

  /// A Mason child added as a plain subview of a foreign container (not
  /// through Mason's node tree) should still resolve to a real, non-zero size.
  func test_masonChildInsideForeignContainerResolvesRealSize() {
    let root = MasonUIView(mason: mason)
    root.frame = CGRect(x: 0, y: 0, width: 300, height: 300)

    let container = UIView(frame: CGRect(x: 0, y: 0, width: 300, height: 80))
    let paragraph = MasonUIView(mason: mason)
    paragraph.setSize(200, 44)
    container.addSubview(paragraph)

    root.addView(container)
    root.computeWithSize(300, 300)

    RunLoop.main.run(until: Date().addingTimeInterval(0.2))
    RunLoop.main.run(until: Date().addingTimeInterval(0.2))

    XCTAssertGreaterThan(paragraph.frame.width, 0, "Mason child inside a foreign container should be visible")
    XCTAssertGreaterThan(paragraph.frame.height, 0, "Mason child inside a foreign container should be visible")
  }

  func test_removingTheLastListenerByIDReleasesItsNode() {
    weak var released: MasonNode?
    autoreleasepool {
      let node = mason.createNode()
      released = node
      let id = mason.addEventListener(node, "alpha") { _ in }
      XCTAssertTrue(mason.removeEventListener(node, "alpha", id: id))
    }
    XCTAssertNil(released, "an empty listener entry must not retain its target")
  }

  func test_removingTheLastListenerTypeReleasesItsNode() {
    weak var released: MasonNode?
    autoreleasepool {
      let node = mason.createNode()
      released = node
      var calls = 0
      mason.addEventListener(node, "alpha") { _ in }
      mason.addEventListener(node, "beta") { _ in calls += 1 }
      XCTAssertTrue(mason.removeEventListener(node, "alpha"))
      mason.dispatch(MasonEvent(type: "beta"), node)
      XCTAssertEqual(calls, 1, "removing one type must keep the others")
      XCTAssertTrue(mason.removeEventListener(node, "beta"))
    }
    XCTAssertNil(released)
  }

  /// The bounds.origin scroll host reports UIScrollView-style drag state: the
  /// pan, then the momentum that follows it, and nothing after it settles.
  func test_scrollHostDraggingCoversPanAndMomentum() {
    let view = MasonUIView(mason: mason)
    view.isScrollContainer = true
    view.overflowY = .Scroll
    XCTAssertFalse(view.dragging)
    view._scrollPanBegan()
    XCTAssertTrue(view.dragging)
    view._scrollPanEnded(CGPoint(x: 0, y: 300))
    XCTAssertTrue(view.dragging, "momentum still counts as dragging, like UIScrollView")
    let deadline = Date().addingTimeInterval(5)
    while view.dragging && Date() < deadline {
      RunLoop.main.run(until: Date().addingTimeInterval(0.05))
    }
    XCTAssertFalse(view.dragging, "dragging must clear once scroll motion settles")
  }

  /// `keyboardDismissMode` resigns the first responder when a scroll drag
  /// begins under `.onDrag`; `.none` leaves it alone. `.interactive` instead
  /// engages a hidden driver UIScrollView whose pan recognizer is re-attached
  /// to the host so UIKit performs its own finger-tracked dismissal — the
  /// responder must NOT resign at drag start, or the drag would be the same
  /// snap dismissal `.onDrag` already provides.
  func test_scrollHostKeyboardDismissModeResignsFirstResponderOnDrag() {
    let window = UIWindow(frame: CGRect(x: 0, y: 0, width: 300, height: 300))
    window.makeKeyAndVisible()
    defer {
      window.resignKey()
      window.isHidden = true
    }
    let field = UITextField(frame: CGRect(x: 0, y: 0, width: 200, height: 30))
    window.addSubview(field)
    let view = MasonUIView(mason: mason)
    view.isScrollContainer = true
    window.addSubview(view)
    XCTAssertTrue(field.becomeFirstResponder())

    view._scrollPanBegan()
    XCTAssertTrue(field.isFirstResponder, "default .none must not dismiss")
    view._scrollPanEnded(.zero)
    XCTAssertFalse(view.dragging)

    view.keyboardDismissMode = .onDrag
    view._scrollPanBegan()
    XCTAssertFalse(field.isFirstResponder, ".onDrag resigns once the drag begins")
    view._scrollPanEnded(.zero)

    XCTAssertTrue(field.becomeFirstResponder())
    view.keyboardDismissMode = .interactive
    XCTAssertNotNil(view._keyboardDismissDriver, ".interactive installs the UIScrollView dismissal driver")
    XCTAssertTrue(view._keyboardDismissDriver?.panGestureRecognizer.view === view,
                  "the driver pan must be attached to the scroll host to track its drags")
    XCTAssertEqual(view._keyboardDismissDriver?.keyboardDismissMode, .interactive)
    view._scrollPanBegan()
    XCTAssertTrue(field.isFirstResponder,
                  ".interactive tracks the drag instead of snap-resigning at its start")
    view._scrollPanEnded(.zero)

    view.keyboardDismissMode = .none
    XCTAssertNil(view._keyboardDismissDriver,
                 "leaving .interactive detaches the driver pan and removes its hidden scroll view")

    view.keyboardDismissMode = .interactive
    XCTAssertNotNil(view._keyboardDismissDriver, "re-entering .interactive installs a fresh driver")
    XCTAssertTrue(view._keyboardDismissDriver?.panGestureRecognizer.view === view,
                  "the fresh driver pan is attached to the scroll host")
  }

  /// The dismissal driver's pan must pass the same begin gate as the host's
  /// own scroll pan. Its owner is a UIScrollView whose always-bounce axes
  /// would otherwise let UIKit start interactive tracking on drags the host's
  /// scroll policy — touch-action, scrollability, bounce — refuses.
  func test_interactiveDismissalDriverPanFollowsTheHostScrollGate() {
    let view = MasonUIView(mason: mason)
    view.frame = CGRect(x: 0, y: 0, width: 100, height: 100)
    view.isScrollContainer = true
    view.overflowY = .Scroll
    view.keyboardDismissMode = .interactive
    let driver = view._keyboardDismissDriver!
    let driverPan = driver.panGestureRecognizer
    // UIScrollView requires its pan's delegate to be the scroll view itself;
    // that delegate consult is the real gate path UIKit takes.
    XCTAssertTrue(driverPan.delegate === driver, "the driver stays its pan's own delegate")
    let driverAllows = { driverPan.delegate!.gestureRecognizerShouldBegin!(driverPan) }

    // With no active gesture the pan reads zero velocity — a vertical drag.
    XCTAssertTrue(driverAllows(), "the driver pan begins on an axis the host can scroll")

    // touch-action: none refuses it, matching the host's own scroll pan.
    view.node.touchAction = 0
    XCTAssertFalse(driverAllows(),
                   "the driver pan must not start UIKit tracking on a touch-action:none drag")
    // The host's own pan gate refuses the same drag.
    XCTAssertFalse(view._scrollPanAllowed(horizontal: false, at: CGPoint(x: 50, y: 50)))
    XCTAssertFalse(view._scrollPanAllowed(horizontal: true, at: CGPoint(x: 50, y: 50)))
    view.node.touchAction = 7
    XCTAssertTrue(driverAllows(), "restoring touch-action lets the driver pan begin again")

    // Directional contract: pan-x only — the vertical dismissal drag is refused.
    view.node.touchAction = 1
    XCTAssertFalse(view._scrollPanAllowed(horizontal: false, at: CGPoint(x: 50, y: 50)),
                   "a pan-x policy must refuse the vertical dismissal drag")
    XCTAssertTrue(view._scrollPanAllowed(horizontal: true, at: CGPoint(x: 50, y: 50)),
                  "a pan-x policy still allows horizontal drags")
    view.node.touchAction = 7

    // A host that can neither scroll nor bounce refuses the driver outright.
    let plain = MasonUIView(mason: mason)
    plain.keyboardDismissMode = .interactive
    let plainDriver = plain._keyboardDismissDriver!
    let plainPan = plainDriver.panGestureRecognizer
    XCTAssertTrue(plainPan.delegate === plainDriver, "the driver stays its pan's own delegate")
    XCTAssertFalse(plainPan.delegate!.gestureRecognizerShouldBegin!(plainPan),
                   "a non-scroll, non-bounce host must not start dismissal tracking")
    plain.alwaysBounceVertical = true
    XCTAssertTrue(plainPan.delegate!.gestureRecognizerShouldBegin!(plainPan),
                  "an always-bounce axis lets the dismissal drag engage")

    view.keyboardDismissMode = .none
    XCTAssertNil(view._keyboardDismissDriver, "leaving .interactive tears the driver down")
    XCTAssertNil(driver.superview, "teardown removes the hidden driver from the hierarchy")
    XCTAssertNil(driverPan.view, "teardown detaches the driver pan from the host")
  }

  /// An always-bounce axis lets the scroll pan begin even when its content
  /// cannot move, so dismissal drags still engage on short content.
  func test_scrollPanBeginsOnAlwaysBounceAxisWithoutScrollableContent() {
    let view = MasonUIView(mason: mason)
    view.isScrollContainer = true
    XCTAssertFalse(view._scrollPanCanBegin(horizontal: false))
    XCTAssertFalse(view._scrollPanCanBegin(horizontal: true))
    view.alwaysBounceVertical = true
    XCTAssertTrue(view._scrollPanCanBegin(horizontal: false))
    XCTAssertFalse(view._scrollPanCanBegin(horizontal: true))
    view.alwaysBounceHorizontal = true
    XCTAssertTrue(view._scrollPanCanBegin(horizontal: true))
    view.overflowY = .Scroll
    view.alwaysBounceHorizontal = false
    view.alwaysBounceVertical = false
    XCTAssertTrue(view._scrollPanCanBegin(horizontal: false))
  }
}
