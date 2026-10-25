import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
const adb = resolve(sdk, 'platform-tools/adb');
const apk = resolve(workspaceRoot, 'dist/native/mason-core/android-host/tests/MasonCore-tests.apk');
const applicationId = 'org.nativescript.mason.masonkit.test';
assert.ok(existsSync(apk), 'Build nativescript-mason-core:build.tests.android first.');
function run(args, timeout = 30000) {
  const result = spawnSync(adb, args, { encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `adb failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const connected = run(['devices', '-l']).split(/\r?\n/).filter((line) => /^\S+\s+device\s/.test(line) && !line.startsWith('emulator-'));
const requested = process.env.MASON_CORE_ANDROID_SERIAL;
const candidates = connected.filter((line) => !requested || line.split(/\s+/)[0] === requested);
assert.equal(candidates.length, 1, 'Connect exactly one physical Android device, or set MASON_CORE_ANDROID_SERIAL.');
const serial = candidates[0].split(/\s+/)[0];
const device = (args, timeout) => run(['-s', serial, ...args], timeout);
assert.notEqual(device(['shell', 'getprop', 'ro.kernel.qemu']).trim(), '1');
assert.ok(device(['shell', 'getprop', 'ro.product.cpu.abilist']).trim().split(',').includes('arm64-v8a'));
const api = Number(device(['shell', 'getprop', 'ro.build.version.sdk']).trim());
assert.ok(api >= 21);
const model = device(['shell', 'getprop', 'ro.product.model']).trim();
const output = resolve(workspaceRoot, 'tmp/mason-core-android-device-tests', String(Date.now()));
mkdirSync(output, { recursive: true });
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
const ownership = resolve(workspaceRoot, 'tmp', `mason-core-android-device-${createHash('sha256').update(serial).digest('hex').slice(0, 16)}.json`);
const installedPackage = spawnSync(adb, ['-s', serial, 'shell', 'pm', 'path', applicationId], { encoding: 'utf8', timeout: 30000 });
if (installedPackage.error) throw installedPackage.error;
// Android pm reports an absent package with exit 1 and no output.
assert.ok(installedPackage.status === 0 || (installedPackage.status === 1 && !installedPackage.stdout.trim() && !installedPackage.stderr.trim()),
  `Cannot inspect the existing test package: ${installedPackage.stdout}\n${installedPackage.stderr}`);
const previousPath = installedPackage.stdout.trim();
if (previousPath) {
  assert.ok(existsSync(ownership), 'An existing test package has no ownership record; refusing to replace it.');
  const previous = JSON.parse(readFileSync(ownership, 'utf8'));
  assert.equal(previous.applicationId, applicationId);
  const paths = previousPath.split(/\r?\n/);
  assert.equal(paths.length, 1);
  assert.ok(paths[0].startsWith('package:'));
  const installed = resolve(output, 'previous.apk');
  device(['pull', paths[0].slice('package:'.length), installed], 60000);
  assert.equal(hash(installed), previous.apkSha256, 'The installed package changed outside this runner; refusing to replace it.');
  rmSync(installed);
}
console.log(`Running the 24 native core tests on physical ${model} (API ${api}).`);
device(['install', '-r', '-t', apk], 120000);
writeFileSync(ownership, JSON.stringify({ applicationId, apkSha256: hash(apk) }) + '\n');
try {
  const text = device(['shell', 'am', 'instrument', '-w', `${applicationId}/androidx.test.runner.AndroidJUnitRunner`], 240000);
  writeFileSync(resolve(output, 'instrumentation.log'), text);
  console.log(text);
  assert.match(text, /OK \(24 tests\)/);
  assert.doesNotMatch(text, /FAILURES!!!|INSTRUMENTATION_FAILED|INSTRUMENTATION_STATUS_CODE: -[34]\b/);
  writeFileSync(resolve(output, 'summary.json'), JSON.stringify({
    device: model, api, physical: true, total: 24, passed: 24, failed: 0, skipped: 0,
    apkSha256: hash(apk), evidence: 'Native Android instrumentation; NativeScript lifecycle and OS input are separate gates.',
  }, null, 2) + '\n');
  console.log('All 24 native Android core tests passed on the physical device with no skips.');
} catch (error) {
  writeFileSync(resolve(output, 'failure.log'), String(error.stack ?? error));
  throw error;
} finally {
  // Only our verified/installed test package is stopped; the user's apps stay running.
  device(['shell', 'am', 'force-stop', applicationId]);
}
