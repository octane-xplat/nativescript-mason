import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const platform = process.argv[2];
assert.ok(['ios', 'android'].includes(platform));
const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
assert.ok(existsSync(resolve(consumer, '.mason-core-consumer')));
const manifest = JSON.parse(readFileSync(resolve(consumer, 'package.json'), 'utf8'));
assert.deepEqual(Object.keys(manifest.dependencies).sort(), ['@nativescript/core', '@octane-xplat/nativescript-mason-core']);
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
