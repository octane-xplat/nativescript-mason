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

// Xplat #41: percentage bitmap leaves must not set a star track's minimum.
extension CoreLayoutInteropTests {
  @objc func test_corePercentageImageDoesNotInflateNestedGridTracks() {
    for nested in [false, true] {
      let scale = NSCMason.scale
      let root = MasonUIView(mason: mason)
      root.display = .Grid
      root.style.gridTemplateColumns = "1fr 1fr"
      root.setSize(402 * scale, 402 * scale)
      let renderer = UIGraphicsImageRenderer(size: CGSize(width: 360, height: 640))
      let bitmap = renderer.image { context in
        UIColor.red.setFill()
        context.fill(CGRect(x: 0, y: 0, width: 360, height: 640))
      }
      var tiles: [MasonUIView] = []
      var images: [UIImageView] = []
      for index in 0..<2 {
        let tile = MasonUIView(mason: mason)
        tile.display = .Flex
        tile.flexDirection = .Column
        tile.style.size = MasonSize(.Auto, .Points(402 * scale))
        let image = UIImageView(image: bitmap)
        image.contentMode = .scaleAspectFill
        // NativeScript installs its own foreign-view measure callback. Match
        // its aspect-preserving one-axis measurement rather than UIKit's
        // UIImageView.sizeThatFits, which ignores the proposed constraint.
        mason.setMeasure(for: image) { width, height, _, _ in
          if !width.isNaN && !height.isNaN { return CGSize(width: width, height: height) }
          if !width.isNaN { return CGSize(width: width, height: width * 640 / 360) }
          if !height.isNaN { return CGSize(width: height * 360 / 640, height: height) }
          return CGSize(width: 360 * CGFloat(scale), height: 640 * CGFloat(scale))
        }
        let node = mason.nodeForView(image)
        node.style.size = MasonSize(.Percent(1), .Percent(1))
        if nested {
          let grow = MasonUIView(mason: mason)
          grow.display = .Flex
          grow.flexDirection = .Column
          grow.flexGrow = 1
          grow.addView(image)
          tile.addView(grow)
        } else {
          tile.addView(image)
        }
        root.addView(tile)
        tiles.append(tile)
        images.append(image)
        tile.tag = index
      }
      root.computeWithSize(402 * scale, 402 * scale)
      for tile in tiles {
        XCTAssertEqual(tile.frame.width, 201, accuracy: 0.5, "nested=\(nested)")
        XCTAssertEqual(tile.frame.minX, CGFloat(tile.tag * 201), accuracy: 0.5)
      }
      for image in images {
        XCTAssertEqual(image.frame.width, 201, accuracy: 0.5)
        XCTAssertEqual(image.frame.height, 402, accuracy: 0.5)
      }
    }
  }
}
