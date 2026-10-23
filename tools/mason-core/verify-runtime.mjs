import assert from 'node:assert/strict';
import ts from 'typescript';
import { resolveMobileConstants } from './mobile-constants.mjs';
import { coreStyleSource, coreForeignLayoutSource, coreEnvironmentPropertiesSource } from './runtime-sources.mjs';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, relative } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { workspaceRoot, coreSourceRoot, relocatedFiles } from './sources.mjs';

const require = createRequire(import.meta.url);
const output = resolve(workspaceRoot, 'dist/prototypes/nativescript-mason-core');
const temporary = mkdtempSync(resolve(tmpdir(), 'mason-core-runtime-consumer-'));

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_PATH: '' } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

function graph(root, platform) {
  const visited = new Set();
  const pending = [resolve(root, `index.${platform}.js`)];
  while (pending.length) {
    const file = pending.pop();
    if (visited.has(file)) continue;
    visited.add(file);
    const name = relative(root, file);
    assert.ok(!name.startsWith('..'), `Import escaped core: ${name}`);
    assert.doesNotMatch(name, /(?:^|\/)(?:web|elements|html|text|text-node|text-runs|img|input|button|br|list|li|textarea)(?:\/|\.)/);
    const source = readFileSync(file, 'utf8');
    for (const dependency of ts.preProcessFile(source).importedFiles) {
      const specifier = dependency.fileName;
      if (!specifier.startsWith('.')) {
        assert.match(specifier, /^@nativescript\/core(?:\/|$)/, `Undeclared runtime dependency: ${specifier}`);
        continue;
      }
      const base = resolve(dirname(file), specifier);
      const candidates = [base, `${base}.${platform}.js`, `${base}/index.${platform}.js`, `${base}.js`, `${base}/index.js`];
      const next = candidates.find((candidate) => candidate.endsWith('.js') && existsSync(candidate));
      assert.ok(next, `Unresolved ${platform} import: ${name} -> ${specifier}`);
      pending.push(next);
    }
  }
  return visited;
}

try {
  const artifacts = resolve(temporary, 'artifacts');
  mkdirSync(artifacts);
  run('pnpm', ['pack', '--pack-destination', artifacts], output);
  const archives = readdirSync(artifacts).filter((name) => name.endsWith('.tgz'));
  assert.equal(archives.length, 1);
  const archive = resolve(artifacts, archives[0]);
  const entries = run('tar', ['-tzf', archive], temporary).trim().split('\n').map((name) => name.replace(/^package\//, ''));
  const modules = [
    'css-environment',
    ...relocatedFiles.filter((name) => name.endsWith('.ts') && !name.endsWith('.d.ts') && !name.includes('.windows.')).map((name) => name.replace(/\.ts$/, '')),
    'common', 'index.ios', 'index.android', 'tree/index.ios', 'tree/index.android',
  ];
  const expected = [
    'LICENSE', 'README.md', 'ios-host-README.md', 'native-types-README.md', 'plugin-README.md', 'package.json', 'index.d.ts', 'layout-types.d.ts',
    'view/index.d.ts', 'scroll/index.d.ts', 'tree/index.d.ts',
    ...modules.flatMap((name) => [`${name}.js`, `${name}.d.ts`]),
    'typings/manifest.json',
    ...JSON.parse(readFileSync(resolve(coreSourceRoot, 'typings/manifest.json'), 'utf8')).files.map(({ name }) => `typings/${name}`),
  ];
  assert.deepEqual(entries.sort(), expected.sort(), 'The runtime archive must contain only the declared core source closure.');
  const packageRoot = resolve(temporary, 'node_modules/@octane-xplat/nativescript-mason-core');
  mkdirSync(packageRoot, { recursive: true });
  run('tar', ['-xzf', archive, '-C', packageRoot, '--strip-components=1'], temporary);
  for (const name of entries.filter((name) => name.endsWith('.d.ts'))) {
    const file = resolve(packageRoot, name);
    for (const dependency of ts.preProcessFile(readFileSync(file, 'utf8')).importedFiles) {
      const specifier = dependency.fileName;
      if (!specifier.startsWith('.')) {
        assert.match(specifier, /^@nativescript\/core(?:\/|$)/);
        continue;
      }
      const base = resolve(dirname(file), specifier);
      assert.ok([`${base}.d.ts`, `${base}/index.d.ts`].some(existsSync), `Missing declaration dependency: ${name} -> ${specifier}`);
    }
  }
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'));
  assert.equal(manifest.private, true);
  assert.equal(manifest.masonCorePrototype.nativeHosts, false);
  assert.deepEqual(Object.keys(manifest.dependencies ?? {}), []);
  assert.deepEqual(Object.keys(manifest.peerDependencies), ['@nativescript/core']);
  for (const platform of ['ios', 'android']) {
    const files = graph(packageRoot, platform);
    console.log(`Packed ${platform} entry closes over ${files.size} local JS modules and NativeScript core only.`);
  }
  // Compare both emissions under the prototype's iOS/Android platform constant.
  // Apply the explicit mobile-only style and foreign-release adaptations;
  // every other shared difference still fails, including the property seam.
  for (const name of relocatedFiles.filter((name) => name.endsWith('.ts') && !name.endsWith('.d.ts') && !name.includes('.windows.'))) {
    const emitted = name.replace(/\.ts$/, '.js');
    const clean = (text) => text.replace(/\n?\/\/# sourceMappingURL=.*\s*$/, '').trimEnd();
    let full = readFileSync(resolve(workspaceRoot, 'dist/packages/nativescript-masonkit', emitted), 'utf8');
    if (name === 'style.ts') full = coreStyleSource(full);
    if (name === 'properties.ts') full = coreEnvironmentPropertiesSource(full);
    if (name === 'foreign-layout.ts') full = coreForeignLayoutSource(full);
    assert.equal(clean(readFileSync(resolve(packageRoot, emitted), 'utf8')),
      clean(resolveMobileConstants(full, emitted)),
      `Shared runtime changed: ${name}`);
  }

  // Resolve the peer and standard SDK ambient platform types in an isolated
  // consumer. The package supplies its own native bridge declarations.
  mkdirSync(resolve(temporary, 'node_modules/@nativescript'), { recursive: true });
  symlinkSync(resolve(workspaceRoot, 'node_modules/@nativescript/core'), resolve(temporary, 'node_modules/@nativescript/core'), 'dir');
  for (const name of ['types-ios', 'types-android']) {
    symlinkSync(resolve(workspaceRoot, 'node_modules/@nativescript', name), resolve(temporary, 'node_modules/@nativescript', name), 'dir');
  }
  writeFileSync(resolve(temporary, 'sdk.d.ts'), `/// <reference path="./node_modules/@nativescript/core/global-types.d.ts" />
/// <reference path="./node_modules/@nativescript/types-ios/index.d.ts" />
/// <reference path="./node_modules/@nativescript/types-android/index.d.ts" />
`);
  writeFileSync(resolve(temporary, 'consumer.ts'), `
import { Label } from '@nativescript/core';
import { View, Scroll, bindCssEnvironment, setCssEnvironment, refreshCssEnvironment, type Length, type ScrollToOptions, type CssEnvironmentSource } from '@octane-xplat/nativescript-mason-core';
import { Style } from '@octane-xplat/nativescript-mason-core/style';
const root = new View();
const source: CssEnvironmentSource = { read: () => null, subscribe: () => () => {} };
const disconnect = bindCssEnvironment(root, source);
setCssEnvironment(root, { top: 0, right: 0, bottom: 0, left: 0 });
refreshCssEnvironment(root);
disconnect();
const length: Length = '50%';
root.style.width = length;
root.style.display = 'grid';
root.style.gridTemplateColumns = '1fr 1fr';
root.addChild(new Label());
const scroll = new Scroll();
scroll.addChild(root);
const seek: ScrollToOptions = { top: 100, behavior: 'smooth' };
scroll.scrollTo(seek);
const iosContainer: MasonUIView = NSCMason.shared.createView();
const iosScroll: MasonScroll = NSCMason.shared.createScrollView();
declare const androidContext: android.content.Context;
const androidTree = new org.nativescript.mason.masonkit.Mason();
const androidContainer: org.nativescript.mason.masonkit.View = androidTree.createView(androidContext);
const androidScroll: org.nativescript.mason.masonkit.Scroll = androidTree.createScrollView(androidContext);
void [iosContainer, iosScroll, androidContainer, androidScroll];
// @ts-expect-error Core has no iOS HTML parser bridge class.
MasonHTMLParser;
// @ts-expect-error Core has no Android HTML parser bridge class.
org.nativescript.mason.masonkit.HTMLParser;
void Style;
// @ts-expect-error Windows rich-text run copying is outside the core style API.
Style.prototype.copyTextStyleTo;
// @ts-expect-error Core has no HTML parser API.
root.innerHTML = '<div>hello</div>';
// @ts-expect-error Core accepts NativeScript views, rather than raw text nodes.
root.addChild({ text: 'hello' });
// @ts-expect-error HTML intrinsics are outside the core public API.
import { Div } from '@octane-xplat/nativescript-mason-core';
`);
  writeFileSync(resolve(temporary, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { strict: true, noEmit: true, skipLibCheck: true, target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', lib: ['ES2020'], types: [] },
    files: ['sdk.d.ts', 'consumer.ts'],
  }, null, 2));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(temporary, 'tsconfig.json')], temporary);
  console.log('Isolated consumer types accept containers, style and foreign controls; reject HTML and raw text.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
