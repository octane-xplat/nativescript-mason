import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
const adb = resolve(sdk, 'platform-tools/adb');
const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
assert.ok(existsSync(resolve(consumer, '.mason-core-consumer')));
const apk = resolve(consumer, 'platforms/android/app/build/outputs/apk/debug/app-debug.apk');
assert.ok(existsSync(apk), 'Build nativescript-mason-core:build.consumer.android first.');
const applicationId = 'org.octane.masoncoreprobe';
function run(args, timeout = 30000) {
  const result = spawnSync(adb, args, { encoding: 'utf8', timeout, maxBuffer: 8 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `adb failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const emulatorSerial = process.env.MASON_CORE_ANDROID_EMULATOR_SERIAL;
if (emulatorSerial) assert.match(emulatorSerial, /^emulator-\d+$/);
const requested = emulatorSerial ?? process.env.MASON_CORE_ANDROID_SERIAL;
const connected = run(['devices', '-l']).split(/\r?\n/).filter((line) => /^\S+\s+device\s/.test(line) && (emulatorSerial || !line.startsWith('emulator-')));
const candidates = connected.filter((line) => !requested || line.split(/\s+/)[0] === requested);
assert.equal(candidates.length, 1, 'Connect exactly one physical Android device, or run the dedicated emulator consumer target.');
const serial = candidates[0].split(/\s+/)[0];
const device = (args, timeout) => run(['-s', serial, ...args], timeout);
if (emulatorSerial) {
  assert.equal(device(['shell', 'getprop', 'ro.kernel.qemu']).trim(), '1');
  assert.ok(device(['emu', 'avd', 'name']).split(/\r?\n/).includes('mason-core-extraction'), 'Use only the owned Mason core extraction AVD.');
} else {
  assert.notEqual(device(['shell', 'getprop', 'ro.kernel.qemu']).trim(), '1');
}
assert.ok(device(['shell', 'getprop', 'ro.product.cpu.abilist']).trim().split(',').includes('arm64-v8a'));
const api = Number(device(['shell', 'getprop', 'ro.build.version.sdk']).trim());
assert.ok(api >= 23, 'The NativeScript Android runtime requires API 23 or later.');
const output = resolve(workspaceRoot, 'tmp/mason-core-nativescript-android-tests', String(Date.now()));
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, 'device.json'), JSON.stringify({ api, physical: !emulatorSerial }) + '\n');
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
const ownership = resolve(workspaceRoot, 'tmp', `mason-core-android-consumer-${createHash('sha256').update(serial).digest('hex').slice(0, 16)}.json`);
const installed = spawnSync(adb, ['-s', serial, 'shell', 'pm', 'path', applicationId], { encoding: 'utf8', timeout: 30000 });
if (installed.error) throw installed.error;
assert.ok(installed.status === 0 || (installed.status === 1 && !installed.stdout.trim() && !installed.stderr.trim()),
  `Cannot inspect the existing consumer package: ${installed.stdout}\n${installed.stderr}`);
if (installed.stdout.trim()) {
  assert.ok(existsSync(ownership), 'An existing consumer app has no ownership record; refusing to replace it.');
  const previous = JSON.parse(readFileSync(ownership, 'utf8'));
  assert.equal(previous.applicationId, applicationId);
  const paths = installed.stdout.trim().split(/\r?\n/);
  assert.equal(paths.length, 1);
  assert.ok(paths[0].startsWith('package:'));
  const previousApk = resolve(output, 'previous.apk');
  device(['pull', paths[0].slice('package:'.length), previousApk], 60000);
  assert.equal(hash(previousApk), previous.apkSha256, 'The installed consumer app changed outside this runner.');
  rmSync(previousApk);
}
device(['install', '-r', apk], 120000);
writeFileSync(ownership, JSON.stringify({ applicationId, apkSha256: hash(apk) }) + '\n');
let pid;
try {
  device(['shell', 'am', 'force-stop', applicationId]);
  device(['shell', 'run-as', applicationId, 'rm', '-f', 'files/mason-core-result.json']);
  const launch = device(['shell', 'am', 'start', '-W', '-n', `${applicationId}/com.tns.NativeScriptActivity`], 60000);
  writeFileSync(resolve(output, 'launch.log'), launch);
  const running = spawnSync(adb, ['-s', serial, 'shell', 'pidof', applicationId], { encoding: 'utf8', timeout: 10000 });
  pid = running.stdout?.trim();
  assert.ok(!pid || /^\d+$/.test(pid), 'Unexpected consumer process identifier.');
  const deadline = Date.now() + 45000;
  let text;
  while (Date.now() < deadline) {
    const report = spawnSync(adb, ['-s', serial, 'shell', 'run-as', applicationId, 'cat', 'files/mason-core-result.json'], { encoding: 'utf8', timeout: 10000 });
    if (report.error) throw report.error;
    if (report.status === 0) { text = report.stdout; break; }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  assert.ok(text, 'NativeScript Android consumer did not report its assertions; inspect launch.log and console.log.');
  writeFileSync(resolve(output, 'result.json'), text);
  const result = JSON.parse(text);
  assert.equal(result.passed, true, result.error);
  assert.equal(result.platform, 'android');
  const scenarioPath = resolve(consumer, 'consumer-scenario.json');
  if (existsSync(scenarioPath)) assert.equal(result.scenario, JSON.parse(readFileSync(scenarioPath, 'utf8')).scenario, 'The installed app does not match the prepared consumer scenario.');
  console.log('The isolated NativeScript Android consumer passed its native bridge, layout and ownership assertions.');
} finally {
  try {
    if (pid) writeFileSync(resolve(output, 'console.log'), device(['logcat', '-d', '--pid', pid, '-v', 'brief']));
  } finally {
    device(['shell', 'am', 'force-stop', applicationId]);
  }
}
