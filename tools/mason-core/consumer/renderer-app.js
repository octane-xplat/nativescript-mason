console.log('MASON_CORE_BOOT renderer-entry');
const { Application, knownFolders, isIOS } = require('@nativescript/core');
const core = require('@octane-xplat/nativescript-mason-core');
const renderer = require('@nativescript-community/octane');
let phase = 'initialization';
let failed = false;

function check(condition, message) {
  if (!condition) throw new Error(message);
}
function report(result) {
  if (failed) return;
  if (result.passed === false) failed = true;
  knownFolders.documents().getFile('mason-core-result.json').writeTextSync(JSON.stringify(result));
  console.log(`MASON_CORE_RESULT ${JSON.stringify(result)}`);
}
function fail(error) {
  report({ passed: false, platform: isIOS ? 'ios' : 'android', phase, error: `${error?.name}: ${error?.message}\n${error?.stack}` });
}
Application.on(Application.uncaughtErrorEvent, (event) => fail(event.error ?? event));

function verifyComponent(host, result) {
  phase = 'component mount';
  const componentHost = new core.View();
  componentHost.height = 100;
  host.addChild(componentHost);
  let label;
  const capture = (view) => { label = view; };
  const plan = renderer.universalPlan('nativescript', {
    kind: 'host', type: 'masonview', props: { style: { width: 200, height: 80 } }, children: [
      { kind: 'host', type: 'label', props: { text: 'Octane component in core' }, bindings: [['style', 0], ['ref', 1]] },
    ],
  });
  const Component = renderer.defineUniversalComponent('nativescript', (props) =>
    renderer.universalValue(plan, [{ width: props.width, height: props.height }, capture]));
  const root = renderer.createNativeScriptRoot(componentHost);
  root.render(Component, { width: 90, height: 35 });
  setTimeout(() => {
    try {
      const first = label.getActualSize();
      check(Math.abs(first.width - 90) < 2 && Math.abs(first.height - 35) < 2, `Octane component geometry: ${JSON.stringify(first)}`);
      const original = label;
      phase = 'component update';
      root.render(Component, { width: 130, height: 45 });
      setTimeout(() => {
        try {
          const next = label.getActualSize();
          check(label === original, 'Octane prop update recreated the foreign view');
          check(Math.abs(next.width - 130) < 2 && Math.abs(next.height - 45) < 2, `Octane prop update geometry: ${JSON.stringify(next)}`);
          phase = 'component unmount';
          root.unmount();
          check(componentHost.getChildrenCount() === 0, 'Octane unmount retained its host tree');
          host.removeChild(componentHost);
          // Let queued style work and deferred native teardown finish before
          // recording success. An uncaught failure keeps the first report.
          setTimeout(() => report({ ...result, componentFirst: first, componentNext: next,
            evidence: 'Canonical Xplat driver commands and real Octane component mount/update/unmount through core; hook subscriptions and OS input are separate checks.' }), 50);
        } catch (error) { fail(error); }
      }, 500);
    } catch (error) { fail(error); }
  }, 500);
}

Application.run({
  create() {
    const host = new core.View();
    const container = { host, nodes: new Map(), children: [], portalTargets: new Map(), root: null };
    const apply = (...commands) => renderer.nativeScriptDriver.prepareBatch(container, { renderer: 'nativescript', version: 1, commands }, {}).apply();
    const view = (id) => renderer.nativeScriptDriver.getPublicInstance(container, id);
    const create = (id, type, props = {}) => ({ op: 'create', id, type, props });
    const insert = (id, parent = null, before = null) => ({ op: 'insert', id, parent, before });
    phase = 'initial driver batch';
    apply(
      create(1, 'masonview', { style: { display: 'flex', flexDirection: 'column', width: 240, height: 300 } }), insert(1),
      create(2, 'label', { text: 'Foreign renderer label', style: { width: 100, height: 40 } }), insert(2, 1),
      create(3, 'masonview', { style: { display: 'flex', width: 200, height: 80 } }), insert(3, 1),
      create(4, 'label', { text: 'Nested renderer label', style: { height: 30 } }), insert(4, 3),
    );
    host.once('loaded', () => setTimeout(() => {
      try {
        phase = 'initial geometry';
        check(view(1) instanceof core.View && view(3) instanceof core.View, 'Renderer did not instantiate core containers');
        const rootSize = view(1).getActualSize();
        const labelSize = view(2).getActualSize();
        const nestedSize = view(3).getActualSize();
        check(Math.abs(rootSize.width - 240) < 2 && Math.abs(rootSize.height - 300) < 2, `Renderer root geometry: ${JSON.stringify(rootSize)}`);
        check(Math.abs(labelSize.width - 100) < 2 && Math.abs(labelSize.height - 40) < 2, `Foreign style geometry: ${JSON.stringify(labelSize)}`);
        check(Math.abs(nestedSize.height - 80) < 2 && view(4).parent === view(3), 'Nested renderer ownership/geometry differs');
        phase = 'foreign style update';
        apply({ op: 'update', id: 2, props: { text: 'Updated renderer label', style: { width: 150, height: 50 } } });
        setTimeout(() => {
          try {
            const updatedSize = view(2).getActualSize();
            check(Math.abs(updatedSize.width - 150) < 2 && Math.abs(updatedSize.height - 50) < 2, `Foreign update geometry: ${JSON.stringify(updatedSize)}`);
            phase = 'foreign reparenting';
            apply({ op: 'remove', id: 4, parent: 3 }, insert(4, 1, 3));
            check(view(4).parent === view(1), 'Renderer reparenting failed');
            phase = 'foreign disposal';
            apply({ op: 'remove', id: 4, parent: 1 }, { op: 'destroy', id: 4 });
            check(!container.nodes.has(4), 'Renderer disposal retained its node');
            verifyComponent(host, { passed: true, platform: isIOS ? 'ios' : 'android', scenario: 'xplat-renderer', rootSize, labelSize, nestedSize, updatedSize });
          } catch (error) { fail(error); }
        }, 500);
      } catch (error) { fail(error); }
    }, 1200));
    phase = 'application root adoption';
    if (!isIOS) {
      check(!host.android.getParent(), `Probe root was already attached before application adoption: ${host.android.getParent()}; root/child share a native view: ${host.android === view(1).android}`);
    }
    return host;
  },
});
