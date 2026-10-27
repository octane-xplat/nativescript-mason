const { Application, Frame, Label, Page } = require('@nativescript/core');
const core = require('@octane-xplat/nativescript-mason-core');
const { flexShrinkProperty } = require('@nativescript/core/ui/layouts/flexbox-layout');
const { nativeArg } = require('@octane-xplat/nativescript-mason-core/panel-helpers');
const { resultPath } = require('./fixture-config.json');
const result = { success: false, phase: 'starting', checks: [], measurements: {} };
const save = () => {
  const json = JSON.stringify(result, null, 2);
  console.log('MASON_QUALIFICATION ' + json);
  NativeScript.MasonQualification.Result.Write(resultPath, json);
};
function phase(name) { result.phase = name; save(); }
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function assert(name, ok, actual) {
  result.checks.push({ name, ok: Boolean(ok), actual });
  save();
  if (!ok) throw new Error(`${name}: ${JSON.stringify(actual)}`);
}
function near(a, b) { return Number.isFinite(a) && Math.abs(a - b) < 1; }
async function until(read, test, name) {
  const deadline = Date.now() + 10000;
  let actual;
  do { actual = read(); if (test(actual)) return actual; await pause(50); } while (Date.now() < deadline);
  throw new Error(`${name} timed out: ${JSON.stringify(actual)}`);
}
function box(view, relative) {
  const n = view.nativeViewProtected ?? view._view ?? view;
  const values = NativeScript.MasonQualification.Result.Box(nativeArg(n) ?? 0, nativeArg(relative) ?? 0);
  return { x: Number(values[0]), y: Number(values[1]), width: Number(values[2]), height: Number(values[3]) };
}
const childIndex = (parent, child) => Number(NativeScript.MasonQualification.Result.ChildIndex(nativeArg(parent._view), nativeArg(child.nativeViewProtected ?? child._view)));
const detached = (native) => NativeScript.MasonQualification.Result.Detached(nativeArg(native) ?? 0);
function dimensions(bytes) {
  const values = new Uint8Array(bytes);
  const data = new DataView(values.buffer);
  // ABI offsets from style.ts / StyleKeys.h. Assert type bytes as well as f32 values.
  return { widthType: data.getUint8(106), heightType: data.getUint8(107), width: data.getFloat32(108, true), height: data.getFloat32(112, true) };
}
function view(width, height) {
  const v = new core.View();
  Object.assign(v.style, { width, height, flexShrink: 0 });
  return v;
}
Application.on(Application.uncaughtErrorEvent, (event) => {
  result.error = String(event.error?.stack ?? event.error); result.phase = 'failed'; save();
});
phase('boot');
Application.run({ create() {
  phase('create-window');
  const frame = new Frame();
  const page = new Page(); page.actionBarHidden = true;
  page.once('loaded', async () => {
    try {
      phase('loaded');
      const engine = NativeScript.Mason.Mason.Instance();
      phase('engine-ready');
      const root = view(400, 600); root.style.display = 'flex'; root.style.flexDirection = 'column';
      const a = view(100, 60), b = view(100, 80);
      root.addChild(a); root.addChild(b); page.content = root;
      await pause(100);
      result.measurements.initial = {
        a: Array.from(NativeScript.MasonQualification.Result.StyleDimensions(nativeArg(a._view))),
        b: Array.from(NativeScript.MasonQualification.Result.StyleDimensions(nativeArg(b._view))),
        root: Array.from(NativeScript.MasonQualification.Result.StyleDimensions(nativeArg(root._view))),
        helperWidth: a._styleHelper.width, helperHeight: a._styleHelper.height,
        helperState: { dirty: a._styleHelper._hasDirty, scheduled: a._styleHelper._syncScheduled, synced: a._styleHelper._synced, inBatch: a._styleHelper.inBatch, bytes: dimensions(a._styleHelper._sv.buffer) },
        jsWidth: a.style.width, jsHeight: a.style.height,
        loaded: { root: root.isLoaded, a: a.isLoaded, b: b.isLoaded },
        suspended: { root: root._suspendNativeUpdatesCount, a: a._suspendNativeUpdatesCount, b: b._suspendNativeUpdatesCount },
        nativeBoxes: { root: box(root), a: box(a, root._view), b: box(b, root._view) },
      };
      phase('reading-flex-geometry');
      await until(() => box(b, root._view), (v) => near(v.y, 60) && near(v.height, 80), 'flex geometry');
      const flex = [box(a, root._view), box(b, root._view)];
      assert('native child order', childIndex(root, a) === 0 && childIndex(root, b) === 1, [childIndex(root, a), childIndex(root, b)]);
      assert('flex native geometry', near(flex[0].width, 100) && near(flex[0].height, 60) && near(flex[0].y, 0) && near(flex[1].y, 60), flex);
      const grid = view(200, 50); grid.style.display = 'grid'; grid.style.gridTemplateColumns = '100px 100px';
      const g1 = view(100, 40), g2 = view(100, 40); grid.addChild(g1); grid.addChild(g2); root.addChild(grid);
      const gridBox = await until(() => box(g2, grid._view), (v) => near(v.x, 100), 'grid geometry');
      assert('grid native columns', near(box(g1, grid._view).x, 0) && near(gridBox.width, 100) && near(gridBox.height, 40), gridBox);
      const label = new Label(); label.text = 'mason-core fixture'; label.width = 180; label.height = 28; label.style.flexShrink = 0.25;
      const originalLabelStylePrototype = Object.getPrototypeOf(label.style), originalRequestLayout = label.requestLayout, originalFlexSetter = label[flexShrinkProperty.setNative];
      root.addChild(label);
      await until(() => box(label), (v) => v.height > 0, 'foreign text attachment');
      const nativeLabel = label.nativeViewProtected;
      const text = String(NativeScript.MasonQualification.Result.NativeText(nativeArg(nativeLabel)));
      const foreignBytes = new Uint8Array(engine.ReadForeignStyleValuesPtr(nativeArg(nativeLabel)));
      const foreign = { flexShrink: new DataView(foreignBytes.buffer).getFloat32(97, true), box: box(label, root._view) };
      const scale = 1; // Windows Mason buffers and native XAML frames both use DIPs.
      assert('text content and native parent', text === label.text && Boolean(nativeLabel.Parent), { text, parent: nativeArg(nativeLabel.Parent), box: box(label, root._view) });
      assert('foreign style buffer values', foreign.flexShrink === 0.25 && near(foreign.box.width, 180) && near(foreign.box.height, 28), foreign);
      a.style.width = 140; a.style.height = 90;
      const resized = await until(() => box(a), (v) => near(v.width, 140) && near(v.height, 90), 'resize geometry');
      const style = dimensions(engine.ReadStyleValues(a._view));
      assert('resize write read round trip', style.widthType === 1 && style.heightType === 1 && style.width === 140 * scale && style.height === 90 * scale, { style, native: resized, scale });
      const dynamic = view(50, 30), owner = view(120, 50); root.addChild(dynamic); root.addChild(owner);
      await until(() => box(dynamic), (v) => near(v.width, 50), 'dynamic attachment');
      assert('dynamic ownership', dynamic.parent === root && childIndex(root, dynamic) >= 0, { parent: nativeArg(dynamic._view.Parent), expected: nativeArg(root._view) });
      root.removeChild(dynamic); owner.addChild(dynamic);
      await until(() => box(dynamic, owner._view), (v) => near(v.y, 0), 'reparent');
      assert('reparent native and logical ownership', dynamic.parent === owner && childIndex(owner, dynamic) === 0 && childIndex(root, dynamic) === -1, { parent: nativeArg(dynamic._view.Parent), expected: nativeArg(owner._view), box: box(dynamic, owner._view) });
      owner.removeChild(dynamic);
      assert('detach releases ownership', !dynamic.parent && detached(dynamic._view) && dynamic._isMasonChild === false, { logical: Boolean(dynamic.parent), native: nativeArg(dynamic._view.Parent), masonChild: dynamic._isMasonChild });
      root.removeChild(label);
      assert('foreign detach clears adoption', !label.parent && detached(nativeLabel) && label._isMasonChild === false && Object.getPrototypeOf(label.style) === originalLabelStylePrototype && label.requestLayout === originalRequestLayout && label[flexShrinkProperty.setNative] === originalFlexSetter, { logical: Boolean(label.parent), native: nativeArg(nativeLabel.Parent), masonChild: label._isMasonChild, stylePrototypeRestored: Object.getPrototypeOf(label.style) === originalLabelStylePrototype, requestLayoutRestored: label.requestLayout === originalRequestLayout, nativeFlexSetterRestored: label[flexShrinkProperty.setNative] === originalFlexSetter });
      const sc = new core.Scroll(); sc.style.width = 250; sc.style.height = 100; sc.style.flexShrink = 0;
      const inner = view(240, 700); const row = view(240, 40); row.style.backgroundColor = '#3366ff'; inner.addChild(row); sc.addChild(inner); root.addChild(sc);
      await until(() => Number(sc.nativeViewProtected.ScrollableHeight), (v) => v >= 500, 'scroll extent');
      let events = 0, clicks = 0;
      const scrollListener = () => { events++; };
      const clickListener = () => { clicks++; };
      sc.addEventListener('scroll', scrollListener); row.addEventListener('click', clickListener);
      await pause(250); // Let the native viewport finish its first arrange.
      const before = box(row);
      result.measurements.scroll = { before, viewport: box(sc), extent: Number(sc.nativeViewProtected.ScrollableHeight), offsetBefore: Number(sc.nativeViewProtected.VerticalOffset) };
      const screen = NativeScript.MasonQualification.Result.ScreenBox(nativeArg(sc.nativeViewProtected));
      result.measurements.scroll.screenViewport = { x: Number(screen[0]), y: Number(screen[1]), width: Number(screen[2]), height: Number(screen[3]), scale: Number(screen[4]) };
      assert('native viewport screen bounds', Number(screen[2]) > 0 && Number(screen[3]) > 0, result.measurements.scroll.screenViewport);
      // The runner must inject OS click + wheel in the owning interactive session.
      // No ChangeView/ScrollTo call is permitted in this scenario.
      result.phase = 'awaiting-os-input'; save();
      await until(() => ({ offset: Number(sc.nativeViewProtected.VerticalOffset), events, clicks }), (v) => v.offset - result.measurements.scroll.offsetBefore > 20 && v.events > 0 && v.clicks > 0, 'OS click and wheel');
      const after = box(row), offset = Number(sc.nativeViewProtected.VerticalOffset);
      result.measurements.scroll.after = after;
      assert('OS click reaches native row', clicks > 0, { clicks });
      assert('OS wheel offset matches row movement', offset > 20 && events > 0 && near(before.y - after.y, offset - result.measurements.scroll.offsetBefore), { offset, movement: before.y - after.y, events });
      sc.removeEventListener('scroll', scrollListener); row.removeEventListener('click', clickListener);
      root.removeChild(sc); sc.removeChild(inner); inner.removeChild(row); root.removeChild(owner); grid.removeChild(g1); grid.removeChild(g2); root.removeChild(grid); root.removeChild(a); root.removeChild(b);
      assert('cleanup releases native and logical parents', [sc, inner, row, owner, grid, g1, g2, a, b].every((v) => !v.parent && detached(v.nativeViewProtected ?? v._view)), { children: root.getChildrenCount(), parents: [sc, inner, row].map((v) => Boolean(v.parent)) });
      const nativeCount = Number(NativeScript.MasonQualification.Result.ChildCount(nativeArg(root._view)));
      assert('cleanup root empty', root.getChildrenCount() === 0 && nativeCount === 0, { logical: root.getChildrenCount(), native: nativeCount });
      result.phase = 'complete'; result.success = true; save();
    } catch (error) { result.phase = 'failed'; result.error = String(error.stack ?? error); save(); }
  });
  frame.navigate({ create: () => page }); return frame;
} });
