// Appended to the unchanged interop tests in the generated core test target.
extension CoreLayoutInteropTests {
  @objc func test_coreGridPlacesOrdinaryContainersInDeclaredTracks() {
    let scale = NSCMason.scale
    let root = MasonUIView(mason: mason)
    root.display = .Grid
    root.style.gridTemplateColumns = "100px 100px"
    root.style.gridTemplateRows = "50px"
    let first = MasonUIView(mason: mason)
    let second = MasonUIView(mason: mason)
    first.setSize(40 * scale, 30 * scale)
    second.setSize(40 * scale, 30 * scale)
    root.addView(first)
    root.addView(second)
    root.computeWithSize(200 * scale, 100 * scale)
    XCTAssertEqual(first.frame.origin.x, 0, accuracy: 0.5)
    XCTAssertEqual(second.frame.origin.x, 100, accuracy: 0.5)
    XCTAssertEqual(second.frame.size.width, 40, accuracy: 0.5)
  }

  @objc func test_coreForeignLabelRemeasuresAfterContentChanges() {
    let root = MasonUIView(mason: mason)
    root.alignItems = .FlexStart
    let label = UILabel()
    label.text = "Core"
    root.addView(label)
    root.computeWithSize(-2, -2)
    let previous = label.frame.size
    label.text = "An ordinary UIKit label inside Mason core"
    mason.invalidateForeignView(label)
    root.computeWithSize(-2, -2)
    let expected = label.sizeThatFits(CGSize(width: CGFloat.greatestFiniteMagnitude, height: CGFloat.greatestFiniteMagnitude))
    XCTAssertGreaterThan(label.frame.width, previous.width)
    XCTAssertEqual(label.frame.width, expected.width, accuracy: 1)
    XCTAssertEqual(label.frame.height, expected.height, accuracy: 1)
  }

  @objc func test_corePercentSizingRecomputesAndClearsToIntrinsicWidth() {
    let scale = NSCMason.scale
    let root = MasonUIView(mason: mason)
    root.display = .Flex
    root.flexDirection = .Row
    root.alignItems = .FlexStart
    let child = MasonUIView(mason: mason)
    let label = UILabel()
    label.text = "Core"
    child.addView(label)
    child.style.size = MasonSize(.Percent(0.5), .Points(30 * scale))
    root.addView(child)
    root.setSize(200 * scale, 100 * scale)
    root.computeWithSize(200 * scale, 100 * scale)
    XCTAssertEqual(child.frame.width, 100, accuracy: 0.5)
    root.setSize(300 * scale, 100 * scale)
    root.computeWithSize(300 * scale, 100 * scale)
    XCTAssertEqual(child.frame.width, 150, accuracy: 0.5)
    child.style.size = MasonSize(.Auto, .Points(30 * scale))
    root.computeWithSize(300 * scale, 100 * scale)
    let expected = label.sizeThatFits(CGSize(width: CGFloat.greatestFiniteMagnitude, height: 30))
    XCTAssertEqual(child.frame.width, expected.width, accuracy: 1)
  }

  @objc func test_coreProgrammaticScrollSeeksClampToContentBounds() {
    let scale = NSCMason.scale
    let host = UIView(frame: CGRect(x: 0, y: 0, width: 100, height: 100))
    let view = MasonUIView(mason: mason)
    view.frame = host.bounds
    host.addSubview(view)
    view.display = .Block
    view.setSize(100 * scale, 100 * scale)
    view.isScrollContainer = true
    let content = MasonUIView(mason: mason)
    content.setSize(100 * scale, 500 * scale)
    view.addView(content)
    view.computeWithSize(100 * scale, 100 * scale)
    view.markRootComputeApplied(100 * scale, 100 * scale)
    XCTAssertTrue(view.node.isLayoutValid)
    XCTAssertEqual(view.contentSize.height, 500, accuracy: 0.5)
    view.mason_scrollTo(0, 80, false)
    XCTAssertEqual(view.mason_scrollTop, 80, accuracy: 0.5)
    view.mason_scrollTo(.nan, 1000, false)
    XCTAssertEqual(view.mason_scrollTop, 400, accuracy: 0.5)
    view.mason_scrollTo(.nan, -20, false)
    XCTAssertEqual(view.mason_scrollTop, 0, accuracy: 0.5)
  }
}
