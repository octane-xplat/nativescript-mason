import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fullSourceRoot, workspaceRoot } from './sources.mjs';
import { KotlinSource, parseKotlinSources } from './kotlin-source.mjs';
import { replaceOnce } from './swift-source.mjs';

export const androidProjectRoot = resolve(fullSourceRoot, 'src-native/mason-android');
export const androidSourceRoot = resolve(androidProjectRoot, 'masonkit/src/main/java/org/nativescript/mason/masonkit');
export const androidHostFiles = Object.freeze([
  'AppFonts.kt', 'AvailableSpace.kt', 'BackdropHelper.kt', 'Background.kt', 'Border.kt',
  'BoxShadowRenderer.kt', 'ChildList.kt', 'ClipPath.kt', 'ColorInterpolation.kt', 'Colors.kt',
  'ComputedStyle.kt', 'Constants.kt', 'Dimension.kt', 'DimensionSerializer.kt', 'Element.kt',
  'ElementExtensions.kt', 'EventTarget.kt', 'GC.kt', 'GradientStops.kt', 'GridPlacement.kt',
  'GridTemplate.kt', 'GridTrackRepetition.kt', 'HitTesting.kt', 'IdleHandler.kt',
  'InlineSegment.java', 'Layout.kt', 'LengthPercentage.kt', 'LengthPercentageAuto.kt',
  'LengthPercentageAutoSerializer.kt', 'LengthPercentageSerializer.kt', 'Line.kt',
  'LoadingState.kt', 'Mask.kt', 'Mason.kt', 'MasonPositioning.kt', 'MaxSizing.kt',
  'MeasureFunc.kt', 'MeasureOutput.kt', 'MinMax.kt', 'MinSizing.kt', 'NativeHelpers.java',
  'NativeObject.kt', 'NineSlice.kt', 'Node.kt', 'NodeHelper.kt', 'NodeType.kt', 'NodeUtils.kt',
  'ObjectManager.kt', 'Point.kt', 'Rect.kt', 'Scroll.kt', 'Shadow.kt', 'SharedBoxShadowCache.kt',
  'Size.kt', 'Style.kt', 'StyleHelpers.kt', 'Styles.kt', 'SvgParser.kt', 'TextDefaultAttributes.kt',
  'Transform.kt', 'TwoDScrollView.kt', 'Utils.kt', 'View.kt', 'ViewLayoutFactory.kt',
  'ViewUtils.kt', 'WebScroll.kt', 'CSSFilters.kt',
  ...readdirSync(resolve(androidSourceRoot, 'enums')).sort().map((name) => `enums/${name}`),
  'events/Event.kt', 'events/EventOptions.kt',
]);

function replaceCount(text, before, after, count) {
  if (text.split(before).length !== count + 1) throw new Error(`Android source changed: expected ${count} copies of ${before}.`);
  return text.replaceAll(before, after);
}

function functions(source, name, owner, predicate) {
  return source.declarations(name, owner).filter((node) => node.kind === 'KtNamedFunction' && (!predicate || predicate(node.parameters)));
}

export function projectAndroidSources() {
  const filenames = androidHostFiles.filter((name) => name.endsWith('.kt')).map((name) => resolve(androidSourceRoot, name));
  // Container construction also uses this context helper, currently housed in
  // the text widget's file. Extract only that unchanged declaration.
  const contextSource = resolve(androidSourceRoot, 'TextView.kt');
  filenames.push(contextSource);
  const parsed = parseKotlinSources(filenames);
  const sources = androidHostFiles.map((name) => {
    const filename = resolve(androidSourceRoot, name);
    if (!name.endsWith('.kt')) return { name, text: readFileSync(filename, 'utf8') };
    const source = new KotlinSource(filename, parsed[filename]);
    if (name === 'Mason.kt') {
      for (const member of ['mHtmlParser', 'getHtmlParser', 'refreshTextMetrics']) source.remove(member, 'Mason');
      for (const node of source.nodes.filter((node) => node.owner === 'Mason' && node.kind === 'KtNamedFunction' && node.name.startsWith('create') && !['createNode', 'createView', 'createScrollView'].includes(node.name))) source.edit(node);
      source.branch('event.type == "click" && !event.defaultPrevented');
    }
    if (name === 'Node.kt') {
      for (const member of [
        'assignedInnerHTML', 'mHtmlAttributes', 'htmlAttributes', 'document', 'hasTextDescendant',
        'lastTextAttachParent', 'detachTextEpoch', 'getOrCreateAnonymousTextContainer',
        'getOrCreateAnonymousInlineContainer', 'normalizingRuns', 'runsEstablished',
        'establishesInlineRuns', 'joinsInlineRun', 'isRunContainer', 'detachViewQuietly',
        'normalizeInlineRuns', 'runDisplay', 'layoutMatches', 'applyRunPlan', 'fillRun',
        'runForAppend', 'appendToRun', 'attachForRebuild', 'detachForRebuild',
        'onFlowTypeChanged', 'markHasTextDescendant', 'invalidateOnAttach',
        'mAttributes', 'attributes', 'removeAuthorChild',
      ]) source.remove(member, 'Node');
      source.remove('getDefaultAttributes', '');
      for (const member of ['textInvalidationEpoch', 'inAttachWalk', 'bumpTextInvalidationEpoch', 'invalidateDescendantInlineSegments', 'invalidateDescendantTextViewsInner']) source.remove(member, 'Node.Companion');
      source.remove('invalidateDescendantTextViews', 'Node.Companion', 2);
      source.replace('parent', 'Node', `open var parent: Node?
    internal set(value) { dirtyMarkedEpoch = -1; layoutParent = value }
    get() = layoutParent`);
      for (const member of ['replaceChildAt', 'addChildAt', 'removeChildAt', 'removeChild']) source.remove(member, 'Node');
      const append = functions(source, 'appendChild', 'Node', (parameters) => parameters[0] === 'Node');
      if (append.length !== 1) throw new Error('Android Node.appendChild boundary changed.');
      source.edit(append[0], readFileSync(resolve(workspaceRoot, 'tools/mason-core/android-node-children.kt'), 'utf8'));
    }
    if (name === 'Element.kt') {
      for (const member of ['innerHTML', 'detailsRole', 'detailsOpen']) source.remove(member, 'Element');
      for (const member of ['append', 'prepend', 'addChildAt', 'replaceChildAt']) {
        const overloads = functions(source, member, 'Element', (parameters) => parameters.some((type) => type === 'String' || type === 'Array<String>'));
        const count = ['append', 'prepend'].includes(member) ? 2 : 1;
        if (overloads.length !== count) throw new Error(`Android Element.${member} text overloads changed.`);
        overloads.forEach((node) => source.edit(node));
      }
      const listAppend = functions(source, 'append', 'Element', (parameters) => parameters[0] === 'List<*>');
      const nodeAppend = functions(source, 'append', 'Element', (parameters) => parameters[0] === 'Array<Node>');
      if (listAppend.length !== 1 || nodeAppend.length !== 1) throw new Error('Android collection append boundary changed.');
      source.edit(listAppend[0], replaceOnce(source.text.slice(nodeAppend[0].start, nodeAppend[0].end), 'Array<Node>', 'List<Node>'));
      const documentBranches = source.nodes.filter((node) => node.kind === 'KtIfExpression' && node.name === 'root.type == NodeType.Document');
      if (documentBranches.length !== 3) throw new Error('Android document layout boundary changed.');
      for (const node of documentBranches) {
        if (node.otherwise === null) source.edit(node);
        else source.keepElse(node);
      }
      source.branch('view is TextContainer', { count: 2 });
      source.branch('node.detailsHidden || node.layoutParent?.detailsRole == Details.DETAILS');
      source.branch('textHost != null', { otherwise: true });
      source.branch('view is Input', { otherwise: true });
      source.branch('child.layoutParent?.view is TextContainer && child.view is TextContainer');
    }
    if (name === 'View.kt' || name === 'Scroll.kt') {
      const owner = name.slice(0, -3);
      source.remove('onInitializeAccessibilityNodeInfo', owner);
      source.remove('performAccessibilityAction', owner);
      if (name === 'View.kt') source.branch('TextEngine.hasAnyTextFlags(low, high)');
    }
    if (name === 'NodeUtils.kt') {
      source.replace('isInlineLike', 'NodeUtils', `fun isInlineLike(node: Node): Boolean = node.style.isValueInitialized &&
    node.style.display in arrayOf(Display.Inline, Display.InlineBlock, Display.InlineFlex, Display.InlineGrid)`);
      source.branch('node.type == NodeType.Text');
    }
    if (name === 'Style.kt') {
      // Commit the slow-style flag before synchronizing. Otherwise the first
      // grid-template write sees the old flag and never reaches JNI; writing
      // it after synchronization also undoes resetState(). Full source stays
      // untouched so this behavioral fix can be offered upstream separately.
      source.replace('isSlowDirty', 'Style', `private var isSlowDirty = false
    set(value) {
      field = value
      if (value && !inBatch) {
        node.dirty()
        updateNativeStyle()
      }
    }`);
      source.branch('node.view is TextContainer', { otherwise: true, expression: true });
      source.branch('node.detailsRole == Details.SUMMARY');
    }
    let text = source.result();
    const replacements = {
      'Mason.kt': [
        ['      refreshTextMetrics()', ''], ['    HTMLParser.refreshViewportStyles(this)', ''],
        // Match syncStyleParts: a foreign leaf's own dirty flag does not
        // invalidate the root's cached flat layout for unchanged constraints.
        ['    node.dirty()\n    view.requestLayout()', '    node.dirty()\n    node.getRootNode()?.computeCacheDirty = true\n    view.requestLayout()'],
      ],
      'Element.kt': [
        ['    TextEngine.flushPendingTextStyles(node)', ''],
        ['      root.type == NodeType.Document -> root.document?.documentElement?.view\n', ''],
        ['root.type != NodeType.Document && targetView.isAttachedToWindow', 'targetView.isAttachedToWindow'],
        ['      if (node.view is Br.FakeView) continue', ''],
        ['          val isText = view is TextContainer', '          val isText = false'],
        ['view !is Li && !view.isLayoutRequested', '!view.isLayoutRequested'],
        ['          val textHost = view.parent as? TextView', ''],
      ],
      'View.kt': [['    ListMarkers.draw(this, style, c)', '']],
      'Scroll.kt': [
        ['    Node.invalidateDescendantTextViews(node, low, high)', ''],
        ['        ListMarkers.draw(this@Scroll, style, this)', ''],
      ],
      'Style.kt': [
        ['        (node.parent?.view as? TextView)?.engine?.invalidateInlineSegments()', ''],
        ['            (node.view as? TextContainer)?.engine?.invalidateInlineSegments()', ''],
      ],
      'ViewUtils.kt': [
        ['if (view is TextView) view.drawGlyphMask(canvas)', 'if (view is MasonBackgroundGlyphProvider) view.drawGlyphMask(canvas)'],
        ['if (view is TextArea) 0f else view.scrollX.toFloat()', 'view.scrollX.toFloat()'],
        ['if (view is TextArea) 0f else view.scrollY.toFloat()', 'view.scrollY.toFloat()'],
      ],
    };
    for (const [before, after] of replacements[name] ?? []) text = replaceOnce(text, before, after);
    if (name === 'Element.kt') text = replaceCount(text, '    TextEngine.warmMeasures(node)', '', 2);
    if (name === 'Style.kt') {
      text = replaceCount(text, 'node.onFlowTypeChanged(firstSync)', '', 1);
    }
    if (name === 'NodeHelper.kt') {
      text = replaceCount(text, '        is TextView -> view.node\n', '', 2);
      text = replaceOnce(text, '      is TextView -> view.node\n', '');
    }
    return { name, text };
  });
  const context = new KotlinSource(contextSource, parsed[contextSource]);
  const declarations = context.declarations('ThemelessContext', '');
  if (declarations.length !== 1) throw new Error('Android ThemelessContext boundary changed.');
  const declaration = declarations[0];
  sources.push({ name: 'ThemelessContext.kt', originalName: 'TextView.kt', text: `package org.nativescript.mason.masonkit
import android.content.Context
import android.view.ContextThemeWrapper
import android.os.Build
import android.text.TextPaint
import java.lang.ref.WeakReference
import java.util.WeakHashMap

` + context.text.slice(declaration.start, declaration.end) + '\n' });
  return sources;
}

export const backgroundGlyphProvider = `package org.nativescript.mason.masonkit
import android.graphics.Canvas
/** Optional glyph masks for text-clipped backgrounds. Core owns no text renderer. */
interface MasonBackgroundGlyphProvider { fun drawGlyphMask(canvas: Canvas) }
`;
