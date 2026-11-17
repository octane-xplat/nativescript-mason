console.log('MASON_CORE_BOOT entry');
const { Application, Label, knownFolders, isIOS } = require('@nativescript/core');
console.log('MASON_CORE_BOOT nativescript');

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function report(result) {
  const text = JSON.stringify({ ...result, scenario: 'nativescript' });
  knownFolders.documents().getFile('mason-core-result.json').writeTextSync(text);
  console.log(`MASON_CORE_RESULT ${text}`);
}

function errorText(error) {
  return `${error?.name ?? 'Error'}: ${error?.message ?? error}\n${error?.stack ?? ''}`;
}

Application.on(Application.uncaughtErrorEvent, (event) => {
  report({ passed: false, error: errorText(event.error ?? event) });
});

let core;
try {
  core = require('@octane-xplat/nativescript-mason-core');
  console.log('MASON_CORE_BOOT core');
} catch (error) {
  report({ passed: false, error: errorText(error) });
  throw error;
}

Application.run({
  create() {
    const root = new core.View();
    root.style.display = 'flex';
    root.style.flexDirection = 'column';
    const label = new Label();
    label.text = 'A NativeScript label in Mason core';
    label.height = 40;
    root.addChild(label);
    const nested = new core.View();
    nested.style.display = 'flex';
    nested.height = 80;
    const second = new Label();
    second.text = 'Nested foreign view';
    nested.addChild(second);
    root.addChild(nested);
    root.once('loaded', () => {
      setTimeout(() => {
        try {
          for (const name of ['Div', 'Text', 'Input', 'Button', 'HTMLParser', 'TextNode']) {
            check(!(name in core), `Unexpected full-package export: ${name}`);
          }
          const rootSize = root.getActualSize();
          const labelSize = label.getActualSize();
          const nestedSize = nested.getActualSize();
          const secondSize = second.getActualSize();
          check(rootSize.width > 100 && rootSize.height > 100, 'Root has no usable layout');
          check(labelSize.width > 50 && Math.abs(labelSize.height - 40) < 2, 'Foreign label was not measured/placed');
          check(nestedSize.width > 50 && Math.abs(nestedSize.height - 80) < 2, 'Nested Mason container was not placed');
          check(secondSize.width > 20 && secondSize.height > 0, 'Nested foreign label was not measured');
          check(label.parent === root && second.parent === nested, 'NativeScript ownership differs');
          const nativeClass = isIOS ? String(root.ios.class()) : String(root.android.getClass().getName());
          check(nativeClass.includes(isIOS ? 'MasonUIView' : 'org.nativescript.mason.masonkit.View'), `Unexpected native host: ${nativeClass}`);
          if (!isIOS) {
            check(typeof nested.android.getStyle === 'function', 'Android native style getter is missing');
            const nativeStyle = nested.android.getStyle();
            const stored = nativeStyle.getClass().getDeclaredField('smoothCorners');
            stored.setAccessible(true);
            core.setSmoothCorners(nested, { topLeft: { radius: 24, curve: 'squircle' }, bottomRight: 12 });
            let corners = stored.get(nativeStyle);
            check(corners != null && corners.length === 20 && corners[0] === 24 && corners[1] === 1 && corners[10] === 12, 'Mixed corners did not reach the native style');
            core.setSmoothCorners(nested, 16);
            corners = stored.get(nativeStyle);
            check(corners != null && corners[0] === 16 && corners[15] === 16, 'Updated corners did not reach the native style');
            core.setSmoothCorners(nested, null);
            check(stored.get(nativeStyle) == null, 'Clearing corners did not reset the native style');
            check(nested.parent === root && second.parent === nested, 'Smooth corner updates changed native ownership');
          }
          report({ passed: true, platform: isIOS ? 'ios' : 'android', nativeClass, rootSize, labelSize, nestedSize, secondSize,
            evidence: 'NativeScript application and native bridge; OS input and release-size savings are not covered.' });
        } catch (error) {
          report({ passed: false, error: errorText(error) });
        }
      }, 1500);
    });
    return root;
  },
});
