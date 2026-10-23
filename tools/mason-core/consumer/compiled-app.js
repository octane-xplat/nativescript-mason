const { Application, File, Frame, Page, Screen, knownFolders, isIOS, path } = require('@nativescript/core');
const { renderNativeScriptApp } = require('@nativescript-community/octane');
const { Counter } = require('./hook-component');

let failed = false;
let captureDiagnostics = () => ({});
let phase = 'initialization';
function check(condition, message) {
  if (!condition) throw new Error(message);
}
function report(result) {
  if (failed) return;
  if (!result.passed) failed = true;
  const text = JSON.stringify({ ...result, platform: isIOS ? 'ios' : 'android', scenario: 'xplat-compiled', phase });
  knownFolders.documents().getFile('mason-core-result.json').writeTextSync(text);
  console.log(`MASON_CORE_RESULT ${text}`);
}
function fail(error) {
  let diagnostics;
  try { diagnostics = captureDiagnostics(); } catch (diagnosticError) { diagnostics = { error: String(diagnosticError) }; }
  report({ passed: false, error: `${error?.name}: ${error?.message}\n${error?.stack}`, diagnostics });
}
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function waitFor(predicate, description, timeout = 8000) {
  const deadline = Date.now() + timeout;
  while (!predicate()) {
    if (failed) throw new Error('A prior application failure stopped the probe.');
    if (Date.now() > deadline) throw new Error(`Timed out: ${description}`);
    await pause(40);
  }
}
function ready(input) {
  knownFolders.documents().getFile('mason-core-input-ready.json').writeTextSync(JSON.stringify({
    version: 1, platform: isIOS ? 'ios' : 'android', density: Screen.mainScreen.scale, ...input,
  }));
}
function point(view, horizontal, vertical) {
  const origin = view.getLocationOnScreen();
  const size = view.getActualSize();
  return { x: origin.x + size.width * horizontal, y: origin.y + size.height * vertical };
}
let lastWindowGate;
async function stableInputPoint(view, horizontal, vertical) {
  let previous;
  let stableSince = Date.now();
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const native = view.nativeViewProtected;
    lastWindowGate = {
      attached: !!native?.isAttachedToWindow(), laidOut: !!native?.isLaidOut(),
      focused: !!native?.hasWindowFocus(), insets: native?.getRootWindowInsets() != null,
      layoutRequested: !!native?.isLayoutRequested(), loaded: !!view.isLoaded,
    };
    const windowReady = isIOS || (lastWindowGate.attached && lastWindowGate.laidOut &&
      lastWindowGate.focused && lastWindowGate.insets && !lastWindowGate.layoutRequested);
    if (!windowReady || !view.isLoaded) {
      previous = undefined;
      stableSince = Date.now();
      await pause(40);
      continue;
    }
    const next = point(view, horizontal, vertical);
    const size = view.getActualSize();
    const sample = { ...next, width: size.width, height: size.height };
    if (size.width <= 0 || size.height <= 0 || !previous ||
        Object.keys(sample).some((key) => !near(sample[key], previous[key]))) {
      stableSince = Date.now();
      previous = sample;
    }
    else if (Date.now() - stableSince >= 250) return next;
    await pause(40);
  }
  throw new Error('The native input target did not reach stable window geometry.');
}
async function settleScroll(scroll) {
  let previous = scroll.scrollTop;
  let changed = Date.now();
  const deadline = Date.now() + 6000;
  while (Date.now() < deadline) {
    await pause(40);
    const next = scroll.scrollTop;
    if (!near(next, previous)) { previous = next; changed = Date.now(); }
    if (Date.now() - changed > 240) return;
  }
  throw new Error('Native scroll motion did not settle.');
}
const near = (actual, expected) => Math.abs(actual - expected) < 2;
Application.on(Application.uncaughtErrorEvent, (event) => fail(event.error ?? event));
Application.addCss(`
  .mason-core-hook-root { display: flex; flex-direction: column; align-items: flex-start; width: 220; height: 260; }
  .mason-core-hook-label { height: 35; }
  .mason-core-hook-button { width: 200; height: 44; }
  .mason-core-hook-viewport { width: 200; height: 120; margin-top: 8; overflow-x: hidden; overflow-y: scroll; }
  .mason-core-hook-content { display: flex; flex-direction: column; width: 200; height: 600; }
  .mason-core-hook-row { width: 200; height: 30; }
`);

Application.run({
  create() {
    const frame = new Frame();
    const page = new Page();
    page.actionBarHidden = true;
    let label;
    let button;
    let scroll;
    let mounts = 0;
    let disposals = 0;
    let root;
    const buttonTouches = [];
    async function assertions() {
      const osInput = File.exists(path.join(knownFolders.documents().path, 'mason-core-os-input'));
      captureDiagnostics = () => ({
        labelText: label?.text, labelSize: label?.getActualSize(),
        buttonLoaded: button?.isLoaded, buttonEnabled: button?.isEnabled,
        buttonSize: button?.getActualSize(), buttonPoint: button && point(button, 0.5, 0.5),
        buttonTouches, windowGate: lastWindowGate, mounts, disposals, scrollTop: scroll?.scrollTop,
      });
      if (isIOS) {
        const resources = NSBundle.bundleForClass(NSCMason).pathForResourceOfType('SDWebImage_SDWebImage', 'bundle');
        check(resources && File.exists(path.join(resources, 'PrivacyInfo.xcprivacy')), 'The selected core framework slice lost its dependency privacy bundle');
      }
      phase = 'compiled initial render and effect';
      await waitFor(() => mounts === 1 && label?.text === 'Count 0' && near(label.getActualSize().width, 90) && near(label.getActualSize().height, 35),
        'compiled component CSS, native geometry and mount effect');
      check(button && scroll, 'Compiled native refs were not committed');
      if (osInput) button.on('touch', (event) => { if (buttonTouches.length < 20) buttonTouches.push(event.action); });
      const original = label;
      const initialSize = label.getActualSize();
      phase = 'compiled tap handler and state update';
      if (osInput) ready({ phase: 'tap', point: await stableInputPoint(button, 0.5, 0.5) });
      else button.notify({ eventName: 'tap', object: button });
      await waitFor(() => label?.text === 'Count 1' && near(label.getActualSize().width, 130), 'hook-driven native text and geometry update', osInput ? 30000 : 8000);
      check(label === original, 'A hook update recreated the foreign native label');
      check(mounts === 1 && disposals === 0, 'A state update restarted the mount effect');
      const updatedSize = label.getActualSize();
      phase = 'compiled scroll host';
      await waitFor(() => scroll.scrollHeight > scroll.clientHeight && scroll.clientHeight > 0, 'compiled scroll content geometry');
      const firstRow = scroll.getChildAt(0).getChildAt(0);
      const rowBefore = firstRow.getLocationOnScreen();
      if (osInput) {
        const from = await stableInputPoint(scroll, 0.5, 0.85);
        ready({ phase: 'scroll', from, to: point(scroll, 0.5, 0.15) });
        await waitFor(() => scroll.scrollTop > 20, 'OS swipe moves the native scroll host', 30000);
        await settleScroll(scroll);
      } else {
        scroll.scrollTo({ top: 90, left: 0, behavior: 'auto' });
        await waitFor(() => near(scroll.scrollTop, 90), 'native programmatic scroll seek');
      }
      const scrollTop = scroll.scrollTop;
      const rowAfter = firstRow.getLocationOnScreen();
      check(near(rowBefore.y - rowAfter.y, scrollTop), 'Native scroll content did not move with its reported offset');
      phase = 'compiled unmount and effect cleanup';
      root.unmount();
      await waitFor(() => disposals === 1 && label == null && button == null && scroll == null && page.content == null,
        'effect disposal, ref clearing and host release');
      await pause(50);
      report({ passed: true, initialSize, updatedSize, mounts, disposals, scrollTop, rowMovement: rowBefore.y - rowAfter.y, osInput,
        input: osInput ? 'OS coordinate tap and swipe; no synthesized handler notification or programmatic seek.' : 'Synthesized NativeScript tap notification; OS input is not covered.',
        evidence: 'Authored TSRX compiled by the pinned Octane compiler; native class styles, hook updates, scroll seek and cleanup.' });
    }
    page.once('loaded', () => { assertions().catch(fail); });
    phase = 'compiled mount';
    root = renderNativeScriptApp(page, Counter, {
      captureLabel: (view) => { label = view; },
      captureButton: (view) => { button = view; },
      captureScroll: (view) => { scroll = view; },
      mounted: () => { mounts++; }, disposed: () => { disposals++; },
    });
    frame.navigate({ create: () => page });
    return frame;
  },
});
