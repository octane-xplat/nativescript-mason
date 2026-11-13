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

// Xplat #50: collapsed content can legitimately measure its foreign host at
// zero while UIKit still has the old screen-sized bounds.
extension CoreLayoutInteropTests {
  @objc func test_coreCustomZeroMeasureIsNotReplacedByUIKitIntrinsicSize() {
    let scale = NSCMason.scale
    let root = MasonUIView(mason: mason)
    root.display = .Flex
    root.flexDirection = .Column
    root.alignItems = .FlexStart
    root.setSize(300 * scale, 200 * scale)
    let label = UILabel(frame: CGRect(x: 0, y: 0, width: 300, height: 200))
    label.text = "Collapsed host content"
    root.addView(label)
    var calls = 0
    mason.setMeasure(for: label) { _, _, _, _ in
      calls += 1
      return .zero
    }
    root.computeWithSize(300 * scale, 200 * scale)
    XCTAssertGreaterThan(calls, 0)
    XCTAssertEqual(label.frame.size, .zero, "The host callback's zero size is authoritative")

    let node = mason.nodeForView(label)
    node.setDefaultMeasureFunction()
    node.markDirty()
    root.computeWithSize(300 * scale, 200 * scale)
    XCTAssertGreaterThan(label.frame.width, 0, "Restoring UIKit measurement restores intrinsic size")
    XCTAssertGreaterThan(label.frame.height, 0)
  }
}

extension CoreLayoutInteropTests {
  @objc func test_coreFinalHostMeasureSupersedesQueuedNestedCompute() {
    let scale = NSCMason.scale
    let host = UIView(frame: CGRect(x: 0, y: 0, width: 119, height: 300))
    let root = MasonUIView(mason: mason)
    root.style.size = MasonSize(.Percent(1), .Percent(1))
    host.addSubview(root)

    // A provisional outer-tree pass schedules a zero-size compute. The host
    // then supplies its final box before that main-queue work can execute.
    root.computeNestedRootLater(0, 0)
    _ = root.measure(spec(CGFloat(119 * scale), 1), spec(CGFloat(300 * scale), 1), root: true, viewport: false)
    XCTAssertEqual(root.node.computedLayout.height, 300 * scale, accuracy: 0.5)
    RunLoop.main.run(until: Date().addingTimeInterval(0.2))
    XCTAssertEqual(root.node.computedLayout.width, 119 * scale, accuracy: 0.5)
    XCTAssertEqual(root.node.computedLayout.height, 300 * scale, accuracy: 0.5,
                   "Queued provisional work must not overwrite the final host measurement")
  }
}

extension CoreLayoutInteropTests {
  @objc func test_coreSettledMeasurementRestoresItsRootLayout() {
    let root = MasonUIView(mason: mason)
    root.style.size = MasonSize(.Percent(1), .Percent(1))
    let expected = CGSize(width: 357, height: 900)
    _ = root.computeRoot(357, 900)
    root.node.settledRootSizes.append(MasonRootSize(available: expected, size: expected))
    _ = root.computeRoot(0, 0)
    // An outer pass asks for an already-settled box after another intrinsic
    // query changed the real layout. Returning the cached size is insufficient.
    mason.inCompute = true
    let measured = unpack(root.measure(spec(357, 1), spec(900, 1), root: true, viewport: false))
    mason.inCompute = false
    XCTAssertEqual(measured, expected)
    XCTAssertFalse(root.settleDeferredSizes(), "The reported size was already correct")
    XCTAssertEqual(root.node.computedLayout.width, 357, accuracy: 0.5)
    XCTAssertEqual(root.node.computedLayout.height, 900, accuracy: 0.5)
    root.node.settledRootSizes.removeAll()
  }
}

// Deferred intrinsic queries must not become the host root's final viewport.
extension CoreLayoutInteropTests {
  @objc func test_coreDeferredIntrinsicMeasurePreservesAssignedRootBounds() {
    let scale = NSCMason.scale
    let host = UIView()
    let root = MasonUIView(mason: mason)
    root.display = .Flex
    root.flexDirection = .Column
    root.style.size = MasonSize(.Percent(1), .Percent(1))
    host.addSubview(root)
    let stage = MasonUIView(mason: mason)
    stage.display = .Grid
    stage.flexGrow = 1
    stage.style.gridTemplateColumns = "1fr"
    stage.style.gridTemplateRows = "1fr"
    let confirmation = MasonUIView(mason: mason)
    confirmation.setSize(240 * scale, 200 * scale)
    stage.addView(confirmation)
    root.addView(stage)

    for size in [CGSize(width: 402, height: 874), CGSize(width: 107, height: 300),
                 CGSize(width: 200, height: 500), CGSize(width: 107, height: 300),
                 CGSize(width: 402, height: 874)] {
      host.frame = CGRect(origin: .zero, size: size)
      root.frame = host.bounds
      let pixels = CGSize(width: size.width * CGFloat(scale), height: size.height * CGFloat(scale))
      // Pending intrinsic work must not restore the previous viewport when
      // the host supplies a new box in this pass.
      mason.inCompute = true
      _ = root.measure(spec(0, 0), spec(0, 0), root: true, viewport: false)
      mason.inCompute = false
      _ = root.computeRoot(Float(pixels.width), Float(pixels.height))
      XCTAssertEqual(root.frame.width, size.width, accuracy: 0.5)
      XCTAssertEqual(stage.frame.width, size.width, accuracy: 0.5)
      // Model the foreign host's intrinsic query while the shared engine is locked.
      mason.inCompute = true
      _ = root.measure(spec(0, 0), spec(0, 0), root: true, viewport: false)
      mason.inCompute = false
      _ = root.settleDeferredSizes()

      let intrinsic = root.node.settledRootSizes.first { $0.available == CGSize(width: -2, height: -2) }
      XCTAssertNotNil(intrinsic)
      XCTAssertEqual(intrinsic!.size.width, CGFloat(240 * scale), accuracy: 0.5,
                     "The outer tree must still receive the real intrinsic measurement")
      XCTAssertEqual(root.frame.width, size.width, accuracy: 0.5)
      XCTAssertEqual(root.frame.height, size.height, accuracy: 0.5)
      XCTAssertEqual(stage.frame.width, size.width, accuracy: 0.5)
      XCTAssertEqual(stage.frame.height, size.height, accuracy: 0.5)
      XCTAssertEqual(root.node.computedLayout.width, Float(pixels.width), accuracy: 0.5)
      XCTAssertEqual(root.node.computedLayout.height, Float(pixels.height), accuracy: 0.5)
      XCTAssertEqual(root.computeCache(), pixels)
      XCTAssertEqual(root.node.elementHostRootSize, pixels)
      mason.endPass()
    }
  }
}

extension CoreLayoutInteropTests {
  @objc func test_coreMaterialHostsOneFlexBoxAndNativeChildren() {
    let scale = NSCMason.scale
    let root = mason.createMaterialView()
    root.effect = UIBlurEffect(style: .systemMaterial)
    XCTAssertTrue(root.node.view === root)
    XCTAssertEqual(root.style.display, .Block)
    root.style.display = .Flex
    root.style.alignItems = .Center
    root.style.justifyContent = .Center
    root.style.size = MasonSize(.Points(72 * scale), .Points(48 * scale))
    let child = MasonUIView(mason: mason)
    child.setSize(24 * scale, 24 * scale)
    root.addView(child)
    root.computeWithSize(72 * scale, 48 * scale)
    root.layoutIfNeeded()
    XCTAssertTrue(child.superview === root.contentView)
    XCTAssertEqual(root.node.children.count, 1)
    XCTAssertEqual(child.frame, CGRect(x: 24, y: 12, width: 24, height: 24))
    XCTAssertEqual(root.contentView.bounds.size, root.bounds.size)
    XCTAssertNil(root.layer.mask)
    XCTAssertFalse(root.clipsToBounds)
    XCTAssertFalse(root.contentView.subviews[0].isUserInteractionEnabled)
    let hit = root.hitTest(CGPoint(x: 36, y: 24), with: nil)
    XCTAssertTrue(hit === child, "hit=\(String(describing: hit)) root=\(root.frame) content=\(root.contentView.frame) enabled=\(root.isUserInteractionEnabled)/\(root.contentView.isUserInteractionEnabled)")
  }

  @objc func test_coreMaterialIndexedInsertionRemovalAndReplacement() {
    let root = mason.createMaterialView()
    root.effect = UIBlurEffect(style: .systemMaterial)
    let first = MasonUIView(mason: mason)
    let second = MasonUIView(mason: mason)
    let third = MasonUIView(mason: mason)
    root.addView(first)
    root.addView(third)
    root.addView(second, at: 1)
    XCTAssertEqual(root.node.children.count, 3)
    XCTAssertTrue(root.contentView.subviews[1] === first)
    XCTAssertTrue(root.contentView.subviews[2] === second)
    XCTAssertTrue(root.contentView.subviews[3] === third)
    root.removeView(second)
    XCTAssertNil(second.superview)
    XCTAssertNil(second.node.parent)
    root.effect = UIBlurEffect(style: .systemThinMaterial)
    XCTAssertTrue(first.superview === root.contentView)
    XCTAssertTrue(third.superview === root.contentView)
    root.removeView(first)
    root.removeView(third)
    XCTAssertEqual(root.node.children.count, 0)
    XCTAssertEqual(root.contentView.subviews.count, 1)
  }

  @objc func test_coreMaterialGridBoxInsetsResizeAndIntrinsicMeasurement() {
    let scale = NSCMason.scale
    let root = mason.createMaterialView()
    root.effect = UIBlurEffect(style: .systemMaterial)
    root.style.display = .Grid
    root.style.gridTemplateColumns = "1fr 1fr"
    root.style.padding = MasonRect(.Points(8 * scale), .Points(8 * scale), .Points(8 * scale), .Points(8 * scale))
    root.style.border = "2px solid red"
    let label = UILabel()
    label.text = "Hi"
    root.addView(label)
    root.style.size = MasonSize(.Points(100 * scale), .Points(60 * scale))
    root.computeWithSize(100 * scale, 60 * scale)
    XCTAssertEqual(label.frame.minX, 10, accuracy: 0.5)
    XCTAssertEqual(label.frame.minY, 10, accuracy: 0.5)
    XCTAssertEqual(label.frame.width, 40, accuracy: 0.5)
    root.style.size = MasonSize(.Points(200 * scale), .Points(80 * scale))
    root.computeWithSize(200 * scale, 80 * scale)
    XCTAssertEqual(label.frame.width, 90, accuracy: 0.5)
    XCTAssertEqual(root.bounds.size, CGSize(width: 200, height: 80))
    root.style.display = .Block
    root.style.size = MasonSize(.Auto, .Auto)
    root.computeWithSize(-2, -2)
    let before = root.frame.size
    label.text = "A longer dynamic material label"
    mason.invalidateForeignView(label)
    root.computeWithSize(-2, -2)
    XCTAssertGreaterThan(root.frame.width, before.width)
    XCTAssertEqual(root.frame.width, label.frame.width + 20, accuracy: 0.5)
  }

  @objc func test_coreMaterialRootKeepsDirectUIKitGroupingHierarchy() {
    let scale = NSCMason.scale
    let group = mason.createMaterialView()
    let glass = mason.createMaterialView()
    if #available(iOS 26.0, *) {
      group.effect = UIGlassContainerEffect()
      glass.effect = UIGlassEffect(style: .regular)
    }
    group.style.display = .Flex
    group.style.alignItems = .Center
    group.style.justifyContent = .Center
    group.style.size = MasonSize(.Points(200 * scale), .Points(60 * scale))
    glass.style.size = MasonSize(.Points(72 * scale), .Points(40 * scale))
    group.addView(glass)
    group.computeWithSize(200 * scale, 60 * scale)
    group.layoutIfNeeded()
    glass.layoutIfNeeded()
    XCTAssertTrue(glass.superview === group.contentView)
    XCTAssertTrue(glass.node.parent === group.node)
    XCTAssertEqual(glass.frame, CGRect(x: 64, y: 10, width: 72, height: 40))
    XCTAssertEqual(group.node.children.count, 1)
    XCTAssertNil(group.layer.mask)
  }
}


extension CoreLayoutInteropTests {
  @objc func test_coreMaterialCornersAndOverflowStayOnTheEffectRoot() {
    let scale = NSCMason.scale
    let root = mason.createMaterialView()
    root.effect = UIBlurEffect(style: .systemMaterial)
    root.style.size = MasonSize(.Points(72 * scale), .Points(48 * scale))
    root.style.borderRadius = "12px 8px 4px 2px"
    root.computeWithSize(72 * scale, 48 * scale)
    root.layoutIfNeeded()
    XCTAssertNil(root.layer.mask)
    XCTAssertFalse(root.clipsToBounds)
    if #available(iOS 26.0, *) {
      XCTAssertEqual(root.effectiveRadius(corner: .topLeft), 12, accuracy: 0.5)
      XCTAssertEqual(root.effectiveRadius(corner: .topRight), 8, accuracy: 0.5)
      XCTAssertEqual(root.effectiveRadius(corner: .bottomRight), 4, accuracy: 0.5)
      XCTAssertEqual(root.effectiveRadius(corner: .bottomLeft), 2, accuracy: 0.5)
    }
    root.style.overflow = MasonPoint(.Hidden, .Hidden)
    root.computeWithSize(72 * scale, 48 * scale)
    XCTAssertTrue(root.clipsToBounds)
    XCTAssertNotNil(root.layer.mask)
    root.style.overflow = MasonPoint(.Visible, .Visible)
    root.computeWithSize(72 * scale, 48 * scale)
    XCTAssertFalse(root.clipsToBounds)
    XCTAssertNil(root.layer.mask)
    root.style.borderRadius = "25%"
    for size in [Float(64), Float(128)] {
      root.style.size = MasonSize(.Points(size * scale), .Points(size * scale))
      root.computeWithSize(size * scale, size * scale)
      root.setNeedsLayout()
      root.layoutIfNeeded()
      if #available(iOS 26.0, *) {
        XCTAssertEqual(root.effectiveRadius(corner: .topLeft), CGFloat(size / 4), accuracy: 0.5)
      }
    }
  }
}
