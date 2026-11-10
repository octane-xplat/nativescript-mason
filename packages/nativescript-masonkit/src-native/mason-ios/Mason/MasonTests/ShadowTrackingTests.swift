//
//  ShadowTrackingTests.swift
//  MasonTests
//
//  The outset box-shadow layer is a sibling in the superview's layer so it can
//  escape the view's clip. Nothing animates a sibling, so geometry/visibility
//  changes that bypass layout — view.transform, center, alpha, hidden and
//  Core Animation — must be mirrored onto it.
//

import UIKit
import XCTest
@testable import Mason

final class ShadowTrackingTests: XCTestCase {

  /// A shadowed view in a host, with the shadow layer attached.
  private func shadowedView(file: StaticString = #filePath, line: UInt = #line) -> (host: UIView, view: MasonUIView) {
    let host = UIView(frame: CGRect(x: 0, y: 0, width: 500, height: 400))
    let v = MasonUIView(mason: NSCMason.shared)
    v.frame = CGRect(x: 130, y: 145, width: 240, height: 110)
    v.style.backgroundColor = 0xFFFFFFFF
    v.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.5)"
    host.addSubview(v)
    v.style.updateShadowLayer(for: CGRect(origin: .zero, size: v.bounds.size))
    XCTAssertTrue(v.style.mShadowLayer.superlayer === host.layer, "shadow is a sibling under the view", file: file, line: line)
    XCTAssertFalse(v.style.mShadowLayer.isHidden, file: file, line: line)
    return (host, v)
  }

  // Writing the layer's transform (NativeScript translateX/scaleX/rotate and
  // CSS transform paths that don't relayout) moves the shadow too.
  func testLayerTransformIsMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    v.layer.transform = CATransform3DMakeTranslation(40, 25, 0)
    XCTAssertTrue(CATransform3DEqualToTransform(v.style.mShadowLayer.transform, v.layer.transform),
                  "shadow transform must equal the view's")
    v.layer.transform = CATransform3DIdentity
    XCTAssertTrue(CATransform3DEqualToTransform(v.style.mShadowLayer.transform, CATransform3DIdentity))
  }

  // view.transform writes land on the layer as an affine transform.
  func testViewTransformSetterIsMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    v.transform = CGAffineTransform(translationX: 30, y: 20)
    XCTAssertTrue(CATransform3DEqualToTransform(v.style.mShadowLayer.transform,
                                              CATransform3DMakeAffineTransform(v.transform)))
  }

  // Position-only moves (center/frame writes and layout that never resizes)
  // keep the shadow under the element.
  func testCenterMoveIsMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    v.center = CGPoint(x: 100, y: 60)
    XCTAssertEqual(v.style.mShadowLayer.position, v.layer.position)
    v.center = CGPoint(x: 300, y: 200)
    XCTAssertEqual(v.style.mShadowLayer.position, v.layer.position)
  }

  // A CABasicAnimation added to the view's layer — NativeScript animate() and
  // keyframe animations — is replayed on the shadow, and removed with it.
  func testExplicitAnimationIsMirroredAndRemoved() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    let anim = CABasicAnimation(keyPath: "transform")
    anim.toValue = NSValue(caTransform3D: CATransform3DMakeTranslation(10, 0, 0))
    anim.duration = 1
    v.layer.add(anim, forKey: "transform")
    XCTAssertNotNil(v.style.mShadowLayer.animation(forKey: "transform"),
                    "the view's transform animation must drive the shadow")

    // Keys outside the shared geometry space are not replayed: the shadow's
    // bounds carry the shadow's expansion padding.
    let bounds = CABasicAnimation(keyPath: "bounds")
    bounds.toValue = NSValue(cgRect: CGRect(x: 0, y: 0, width: 1, height: 1))
    v.layer.add(bounds, forKey: "bounds")
    XCTAssertNil(v.style.mShadowLayer.animation(forKey: "bounds"),
                 "bounds animations must not reach the shadow")

    v.layer.removeAnimation(forKey: "transform")
    XCTAssertNil(v.style.mShadowLayer.animation(forKey: "transform"),
                 "removing the view's animation removes the shadow's")
    v.layer.removeAllAnimations()
    XCTAssertNil(v.style.mShadowLayer.animation(forKey: "bounds"))
  }

  // Inside a UIView animation block the shadow must inherit the view's implicit
  // animation instead of snapping to the end value. A windowless view never
  // materializes a render-committed animation, so the maintained check is the
  // delegation contract: inside the block the shadow's action(forKey:) yields
  // the view layer's non-null implicit action, outside it yields NSNull.
  func testUIViewAnimationBlockIsMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    var inBlockAction: CAAction?
    UIView.animate(withDuration: 0.4) {
      inBlockAction = v.style.mShadowLayer.action(forKey: "transform")
      v.transform = CGAffineTransform(translationX: 50, y: 0)
    }
    CATransaction.flush()
    XCTAssertNotNil(inBlockAction, "inside an animation block the shadow answers the implicit action")
    XCTAssertFalse(inBlockAction is NSNull, "inside an animation block the shadow must not snap")
    XCTAssertTrue(v.style.mShadowLayer.action(forKey: "transform") is NSNull,
                  "outside an animation block the shadow keeps snapping")
    XCTAssertTrue(CATransform3DEqualToTransform(v.style.mShadowLayer.transform,
                                              CATransform3DMakeAffineTransform(v.transform)))
    v.layer.removeAllAnimations()
    v.style.mShadowLayer.removeAllAnimations()
  }

  // Plain writes still snap: no animation is created outside an animation block.
  func testWritesOutsideAnimationBlocksStillSnap() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    v.transform = CGAffineTransform(rotationAngle: .pi / 4)
    CATransaction.flush()
    XCTAssertNil(v.style.mShadowLayer.animation(forKey: "transform"))
    XCTAssertTrue(CATransform3DEqualToTransform(v.style.mShadowLayer.transform,
                                              CATransform3DMakeAffineTransform(v.transform)))
  }

  // Render-tree state a sibling can't inherit follows the view.
  func testHiddenAndOpacityAreMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    v.isHidden = true
    XCTAssertTrue(v.style.mShadowLayer.isHidden, "a hidden element casts no shadow")
    v.isHidden = false
    XCTAssertFalse(v.style.mShadowLayer.isHidden)

    v.alpha = 0.5
    XCTAssertEqual(v.style.mShadowLayer.opacity, 0.5, accuracy: 0.001,
                   "a fading element's shadow fades with it")
    v.alpha = 1
    XCTAssertEqual(v.style.mShadowLayer.opacity, 1, accuracy: 0.001)

    v.layer.zPosition = 7
    XCTAssertEqual(v.style.mShadowLayer.zPosition, 7)
  }

  // A bounds.size write without a layout pass still resizes the shadow box.
  func testBoundsSizeIsMirrored() {
    let (host, v) = shadowedView()
    XCTAssertNotNil(host)
    let before = v.style.mShadowLayer.bounds.width
    v.layer.bounds = CGRect(x: 0, y: 0, width: 300, height: 110)
    XCTAssertGreaterThan(v.style.mShadowLayer.bounds.width, before)
  }


}
