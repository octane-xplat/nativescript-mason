const { Application, Frame, Page, knownFolders, isIOS } = require('@nativescript/core');
const { renderNativeScriptApp } = require('@nativescript-community/octane');
const { Counter } = require('./hook-component');

let failed = false;
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
  report({ passed: false, error: `${error?.name}: ${error?.message}\n${error?.stack}` });
}
const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function waitFor(predicate, description) {
  const deadline = Date.now() + 8000;
  while (!predicate()) {
    if (failed) throw new Error('A prior application failure stopped the probe.');
    if (Date.now() > deadline) throw new Error(`Timed out: ${description}`);
    await pause(40);
  }
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
    async function assertions() {
      phase = 'compiled initial render and effect';
      await waitFor(() => mounts === 1 && label?.text === 'Count 0' && near(label.getActualSize().width, 90) && near(label.getActualSize().height, 35),
        'compiled component CSS, native geometry and mount effect');
      check(button && scroll, 'Compiled native refs were not committed');
      const original = label;
      const initialSize = label.getActualSize();
      phase = 'compiled tap handler and state update';
      button.notify({ eventName: 'tap', object: button });
      await waitFor(() => label?.text === 'Count 1' && near(label.getActualSize().width, 130), 'hook-driven native text and geometry update');
      check(label === original, 'A hook update recreated the foreign native label');
      check(mounts === 1 && disposals === 0, 'A state update restarted the mount effect');
      const updatedSize = label.getActualSize();
      phase = 'compiled scroll host';
      await waitFor(() => scroll.scrollHeight > scroll.clientHeight && scroll.clientHeight > 0, 'compiled scroll content geometry');
      scroll.scrollTo({ top: 90, left: 0, behavior: 'auto' });
      await waitFor(() => near(scroll.scrollTop, 90), 'native programmatic scroll seek');
      const scrollTop = scroll.scrollTop;
      phase = 'compiled unmount and effect cleanup';
      root.unmount();
      await waitFor(() => disposals === 1 && label == null && button == null && scroll == null && page.content == null,
        'effect disposal, ref clearing and host release');
      await pause(50);
      report({ passed: true, initialSize, updatedSize, mounts, disposals, scrollTop,
        input: 'Synthesized NativeScript tap notification; OS input is not covered.',
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
