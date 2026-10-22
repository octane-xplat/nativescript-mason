import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const platform = process.argv[2];
assert.ok(['ios', 'android'].includes(platform));
const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
assert.ok(existsSync(resolve(consumer, '.mason-core-consumer')));
const manifest = JSON.parse(readFileSync(resolve(consumer, 'package.json'), 'utf8'));
let expectedDependencies = ['@nativescript/core', '@octane-xplat/nativescript-mason-core'];
const scenarioPath = resolve(consumer, 'consumer-scenario.json');
if (existsSync(scenarioPath)) {
  const scenario = JSON.parse(readFileSync(scenarioPath, 'utf8'));
  assert.ok(['xplat-renderer', 'nativescript'].includes(scenario.scenario));
  expectedDependencies.push('@nativescript-community/octane', 'octane');
  const require = createRequire(resolve(consumer, 'package.json'));
  assert.equal(createHash('sha256').update(readFileSync(resolve(consumer, 'node_modules/@octane-xplat/nativescript-mason-core/artifact-inventory.json'))).digest('hex'),
    scenario.coreInventorySha256, 'Reinstall the prepared core tarball with pnpm install --force before building.');
  for (const [name, version] of Object.entries(scenario.versions)) {
    assert.equal(manifest.dependencies[name], version);
    assert.equal(JSON.parse(readFileSync(resolve(consumer, 'node_modules', name, 'package.json'), 'utf8')).version, version);
  }
  for (const { file, fixtureSha256 } of scenario.patches) {
    assert.equal(createHash('sha256').update(readFileSync(resolve(consumer, file))).digest('hex'), fixtureSha256,
      `The renderer fixture patch changed after preparation: ${file}`);
  }
  const rendererRequire = createRequire(require.resolve('@nativescript-community/octane/package.json'));
  const coreRequire = createRequire(require.resolve('@octane-xplat/nativescript-mason-core/package.json'));
  assert.equal(realpathSync(require.resolve('octane/universal/native')), realpathSync(rendererRequire.resolve('octane/universal/native')),
    'The renderer must share the application Octane runtime.');
  for (const peer of [rendererRequire, coreRequire]) {
    assert.equal(realpathSync(require.resolve('@nativescript/core/package.json')), realpathSync(peer.resolve('@nativescript/core/package.json')),
      'The renderer and Mason core must share the application NativeScript core.');
  }
}
assert.deepEqual(Object.keys(manifest.dependencies).sort(), expectedDependencies.sort());
const env = { ...process.env, NODE_PATH: '' };
const listed = spawnSync('pnpm', ['list', '--prod', '--depth', 'Infinity', '--json'], { cwd: consumer, env, encoding: 'utf8' });
if (listed.error) throw listed.error;
assert.equal(listed.status, 0, listed.stderr);
const graph = JSON.parse(listed.stdout);
function checkDependencies(value) {
  for (const [key, entry] of Object.entries(value)) {
    assert.ok(!/^(?:@[^/]+\/)?nativescript-masonkit$/.test(key), `Full MasonKit installed in isolated consumer: ${key}`);
    if (entry && typeof entry === 'object') checkDependencies(entry);
  }
}
checkDependencies(graph);
// NativeScript's generated Xcode project can retain framework references to
// previous pnpm peer paths after changing SDK peers. Regenerate only this owned
// fixture's platform when its native dependency inputs change.
const preparation = resolve(consumer, `platform-preparation-${platform}.json`);
const inputs = {
  dependencies: Object.entries(manifest.dependencies).sort(),
  runtime: manifest.devDependencies[`@nativescript/${platform}`],
  packagePaths: Object.keys(manifest.dependencies).sort().map((name) => realpathSync(resolve(consumer, 'node_modules', name))),
  pluginInventory: JSON.parse(readFileSync(resolve(consumer, 'node_modules/@octane-xplat/nativescript-mason-core/artifact-inventory.json'), 'utf8'))
    .filter(({ name }) => name.startsWith('platforms/')),
};
const fingerprint = createHash('sha256').update(JSON.stringify(inputs)).digest('hex');
const previous = existsSync(preparation) ? JSON.parse(readFileSync(preparation, 'utf8')).fingerprint : null;
if (previous !== fingerprint) {
  rmSync(resolve(consumer, 'platforms', platform), { recursive: true, force: true });
  console.log(`Regenerating the owned ${platform} fixture platform for its current native dependency inputs.`);
}
if (platform === 'ios') {
  env.TNS_TYPESCRIPT_DECLARATIONS_PATH = resolve(consumer, 'typings/ios');
  mkdirSync(env.TNS_TYPESCRIPT_DECLARATIONS_PATH, { recursive: true });
} else {
  const java = spawnSync('/usr/libexec/java_home', ['-v', '21'], { encoding: 'utf8' });
  if (java.error) throw java.error;
  assert.equal(java.status, 0, java.stderr);
  env.JAVA_HOME = process.env.MASON_CORE_JAVA_HOME ?? java.stdout.trim();
}
const args = ['exec', 'ns', 'build', platform, '--no-hmr'];
if (platform === 'android') args.push('--android-typings');
const result = spawnSync('pnpm', args, { cwd: consumer, env, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
if (platform === 'android') {
  const apk = resolve(consumer, 'platforms/android/app/build/outputs/apk/debug/app-debug.apk');
  const inventory = spawnSync('unzip', ['-Z1', apk], { encoding: 'utf8' });
  if (inventory.error) throw inventory.error;
  assert.equal(inventory.status, 0, inventory.stderr);
  const abis = [...new Set(inventory.stdout.split('\n').map((name) => /^lib\/([^/]+)\/.*\.so$/.exec(name)?.[1]).filter(Boolean))].sort();
  assert.deepEqual(abis, ['arm64-v8a'], 'The app must not include unsupported native ABI slices.');
}
if (platform === 'ios') {
  const declarations = resolve(env.TNS_TYPESCRIPT_DECLARATIONS_PATH, 'arm64');
  const modules = readdirSync(declarations).filter((name) => /^objc!MasonCore(?:\.|$)/.test(name));
  assert.ok(modules.length > 0, 'NativeScript silently omitted the core framework from generated native metadata/types.');
  const source = modules.map((name) => readFileSync(resolve(declarations, name), 'utf8')).join('\n');
  for (const name of ['NSCMason', 'MasonUIView', 'MasonNode', 'MasonStyle']) {
    assert.ok(new RegExp(`declare class ${name}\\b`).test(source), `Core metadata omits ${name}.`);
  }
  assert.doesNotMatch(source, /declare class (?:HTMLParser|MasonText|MasonTextNode|MasonDocument|MasonInput|MasonTextArea)\b/);
  console.log('NativeScript generated the core native classes without HTML/text/widget declarations; runtime execution remains required.');
}
writeFileSync(preparation, JSON.stringify({ fingerprint }) + '\n');
