import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fullSourceRoot, workspaceRoot } from './sources.mjs';
import { SwiftSource, replaceOnce } from './swift-source.mjs';

export const iosSourceRoot = resolve(fullSourceRoot, 'src-native/mason-ios/Mason/Mason');
export const iosHostFiles = Object.freeze([
  'Background.swift', 'BackgroundParser.swift', 'Border.swift', 'BorderParser.swift',
  'BoxShadowRenderer.swift', 'ClipPath.swift', 'Constants.swift', 'CSSFilters.swift',
  'Enums.swift', 'Extensions.swift', 'MasonCompat.swift', 'MasonElement.swift',
  'MasonEvent.swift', 'MasonEventTarget.swift', 'MasonGestureRecognizer.swift',
  'MasonLayout.swift', 'MasonLine.swift', 'MasonNode.swift', 'MasonPoint.swift',
  'MasonPositioning.swift', 'MasonRect.swift', 'MasonShadowLayer.swift', 'MasonSize.swift',
  'MasonStyle.swift', 'MasonUIView.swift', 'Mask.swift', 'MaxSizing.swift',
  'MeasureOutput.swift', 'MinMax.swift', 'MinSizing.swift', 'NativeHelpers.swift',
  'NineSlice.swift', 'NodeUtils.swift', 'NSCMason.swift', 'Scroll.swift',
  'Shadow.swift', 'SvgParser.swift', 'SwiftHelpers.swift', 'TrackSizingFunction.swift',
]);

function declarationText(source, name) {
  const nodes = source.declarations(name);
  if (nodes.length !== 1) throw new Error(`Missing shared Swift declaration: ${name}`);
  return source.lines.slice(nodes[0].first, nodes[0].last + 1).join('\n');
}

export function projectIosSource(name) {
  const source = new SwiftSource(resolve(iosSourceRoot, name));
  if (name === 'NSCMason.swift') {
    source.remove('htmlParser');
    for (const node of source.nodes.filter((node) => node.kind === 'func_decl' && node.name?.startsWith('create') && !['createView()', 'createScrollView()', 'createNode()', 'createNode(measure:)'].includes(node.name))) source.edit(node);
    source.statement('if event.type == "click" && !event.defaultPrevented');
  }
  if (name === 'MasonNode.swift') {
    for (const signature of [
      'invalidateDescendantTextViews(_:_:)', 'invalidateDescendantTextViews(_:_:_:)',
      'invalidateDescendantTextViews(inheritedBy:_:_:)', 'invalidateDescendantDefaultAttributes(_:)',
      'invalidateDefaultAttributes()', 'getDefaultAttributes()', '_buildDefaultAttributes()',
      'getDecorationColor()', 'spaceAdvance(_:)', 'document', 'assignedInnerHTML', 'htmlAttributes',
      '_cachedDefaultAttributes', '_defaultAttrsStyleVersion', 'notInheritedTextKeys',
      'init(dataNode:)', 'init(masonLineBreak:)', 'init(masonImage:)', 'init(masonButton:)',
      'init(textNode:_:)', 'init(listItem:)', 'init(listItem:measureFunc:)',
    ]) source.remove(signature);
    const extension = source.nodes.filter((node) => node.kind === 'extension_decl' && node.name === 'MasonNode');
    if (extension.length !== 1) throw new Error('MasonNode child/measure extension changed.');
    const retained = ['getChildAt(_:)', 'setChildren(value:)', 'removeAllChildren()', 'removeMeasureFunction()', 'setMeasureFunction(_:)', 'setDefaultMeasureFunction()', 'measureFunction(_:_:_:)'];
    const children = readFileSync(resolve(workspaceRoot, 'tools/mason-core/ios-node-children.swift'), 'utf8');
    source.edit(extension[0], children + '\nextension MasonNode {\n' + retained.map((name) => declarationText(source, name)).join('\n') + '\n}\n');
  }
  if (name === 'MasonElement.swift') {
    for (const signature of ['innerHTML', 'append(text:)', 'append(texts:)', 'prepend(string:)', 'prepend(strings:)', 'addChildAt(text:_:)', 'replaceChildAt(text:_:)' ]) source.remove(signature, 2);
    source.remove('getDefaultAttributes()');
    source.replace('rootLayoutElement()', '  private func rootLayoutElement() -> MasonElement? { MasonViewKind.element(node.getRootNode().view) }');
    source.replace('addView(_:)', '  public func addView(_ view: UIView) { addView(view, at: -1) }');
    source.replace('addView(_:at:)', `  public func addView(_ view: UIView, at: Int) {
    if view.superview == uiView { return }
    node.addChildAt(node.mason.nodeForView(view), at)
  }`);
    const prepend = source.declarations('prepend(nodes:)');
    if (prepend.length !== 2) throw new Error('MasonElement prepend boundary changed.');
    source.edit(prepend[1], '  public func prepend(nodes: [MasonNode]) { for child in nodes.reversed() { node.addChildAt(child, 0) } }');
    source.statement('if let parentText = parentText, let childText');
    source.statement('if let view = view as? MasonText {');
    source.statement('if(isTextView){');
    source.remove('isTextContainer(_:)');
    source.remove('textContainer(_:)');
    source.remove('textBit');
  }
  if (name === 'MasonUIView.swift') {
    for (const signature of [
      'hasListMarkers', 'isSummary', 'isAccessibilityElement', 'accessibilityLabel', 'accessibilityTraits',
      'accessibilityExpandedStatus', 'accessibilityActivate()', 'drawListItemMarkers(in:)',
      'listStyleType(list:item:preflight:)', 'isInside(list:item:)', 'insideMarker(for:)',
      'resolveListStyleTypeFor(_:)', 'drawMarkerText(_:font:color:right:baseline:in:)', 'drawMarkerFor(listItem:in:position:)',
    ]) source.remove(signature);
    source.statement('if hasListMarkers {');
  }
  if (name === 'MasonStyle.swift') {
    source.statement('if node.detailsRole == MasonDetails.summary');
    source.statement('if filter.isEmpty != oldValue.isEmpty, let parent');
    source.statement('if changed.contains(StateKeys.display.union');
    const imageUpdates = source.nodes.filter((node) => node.kind === 'if_stmt' && source.lines[node.first].includes('if state.contains(.objectPosition)'));
    if (imageUpdates.length !== 2) throw new Error('Image-style callbacks changed.');
    imageUpdates.forEach((node) => source.edit(node));
  }
  if (name === 'NodeUtils.swift') {
    source.replace('invalidateLayout(_:)', `  static func invalidateLayout(_ node: MasonNode) {
    node.markDirty()
    MasonViewKind.element(node.getRootNode().view)?.setNeedsLayoutPass()
  }`);
    const guards = source.nodes.filter((node) => node.kind === 'if_stmt' && source.lines[node.first].includes('MasonViewKind.textContainer(parent)'));
    if (guards.length !== 3) throw new Error('NodeUtils text-parent boundary changed.');
    guards.forEach((node) => source.edit(node));
  }
  if (name === 'Extensions.swift') {
    for (const signature of [
      'mason_innerHTML', 'mason_detailsRole', 'mason_detailsOpen', 'append(_:text:)', 'append(_:texts:)',
      'prepend(_:text:)', 'prepend(_:texts:)', 'addChildAt(_:text:index:)', 'replaceChildAt(_:text:index:)',
      'mason_append(text:)', 'mason_append(texts:)', 'mason_prepend(text:)', 'mason_prepend(texts:)',
      'mason_addChildAt(text:_:)', 'mason_replaceChildAt(text:_:)',
      'getInnerHTML(_:)', 'setInnerHTML(_:_:)',
    ]) source.remove(signature);
  }
  if (name === 'SwiftHelpers.swift') {
    for (const signature of ['append(_:text:)', 'append(_:texts:)', 'prepend(_:string:)', 'prepend(_:strings:)', 'addChildAt(_:text:_:)']) source.remove(signature);
  }
  if (name === 'MasonPositioning.swift') {
    source.replace('rootView(of:)', '  static func rootView(of node: MasonNode) -> UIView? { node.getRootNode().view }');
  }
  if (name === 'MasonGestureRecognizer.swift') {
    source.statement('if let text = v as? MasonText, text.inlineClickTarget');
    source.statement('if let text = view as? MasonText, text.inlineClickTarget');
  }
  if (name === 'ClipPath.swift') {
    const extensions = source.nodes.filter((node) => node.kind === 'extension_decl' && ['MasonText', 'Button', 'Img', 'MasonInput', 'MasonLi', 'MasonList'].includes(node.name));
    if (extensions.length !== 6) throw new Error('ClipPath widget extensions changed.');
    extensions.forEach((node) => source.edit(node));
  }
  let text = source.result();
  const replacements = {
    'NSCMason.swift': [['      HTMLParser.refreshViewportStyles()', '']],
    'MasonElement.swift': [
      ['if let view = node.view, !(view is MasonBr.FakeView) {', 'if let view = node.view {'],
      [' || MasonDetails.isHidden(node)', ''],
      [' && !(view.superview is MasonText)', ''],
      ['      let parentText = MasonViewKind.textContainer(node.view)\n', ''],
      ['    var isTextView = false\n    var realLayout = layout\n    var hasWidthConstraint: Bool = false\n    var hasHeightConstraint: Bool = false', '    let realLayout = layout'],
      ['    if let text = view.superview as? MasonText, text.ownsInlineBox(view) {\n      text.placeInlineBox(node, view, newFrame)\n    } else if view.transform.isIdentity', '    if view.transform.isIdentity'],
      ['    if obj is TextContainer { b |= textBit }', ''],
    ],
    'MasonUIView.swift': [
      ['    MasonNode.invalidateDescendantTextViews(inheritedBy: node, low, high)', ''],
      ['    MasonNode.invalidateDescendantDefaultAttributes(node)', ''],
      ['    let hasListMarkers = self.hasListMarkers', ''],
    ],
    'Scroll.swift': [
      ['    MasonNode.invalidateDescendantTextViews(inheritedBy: node, low, high)', ''],
      ['    MasonNode.invalidateDescendantDefaultAttributes(node)', ''],
    ],
    'MasonStyle.swift': [[' || MasonDetails.isHidden(node)', '']],
    'Background.swift': [
      ['if let text = view as? MasonText {\n      path.addPath(text.engine.glyphOutlinePath(), transform: transform)', 'if let text = view as? MasonBackgroundGlyphProvider {\n      path.addPath(text.masonBackgroundGlyphPath(), transform: transform)'],
      ['if sub is MasonText { sub.layer.displayIfNeeded() }', 'if sub is MasonBackgroundGlyphProvider { sub.layer.displayIfNeeded() }'],
    ],
    'NineSlice.swift': [['      (view as? MasonText)?.textLayer.setNeedsDisplay()', '']],
  };
  for (const [before, after] of replacements[name] ?? []) text = replaceOnce(text, before, after);
  if (name === 'MasonUIView.swift') {
    if (text.split(' || hasListMarkers').length !== 4) throw new Error('UIView list-marker branches changed.');
    text = text.replaceAll(' || hasListMarkers', '');
  }
  return text;
}

export const backgroundGlyphProtocol = `import UIKit
/// Optional glyph outlines for text-clipped backgrounds. Core owns no text renderer.
@objc public protocol MasonBackgroundGlyphProvider {
  func masonBackgroundGlyphPath() -> CGPath
}
`;
