import assert from 'node:assert/strict';
import { existsSync, mkdirSync, openSync, closeSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { workspaceRoot } from './sources.mjs';

const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
const adb = resolve(sdk, 'platform-tools/adb');
const emulator = resolve(sdk, 'emulator/emulator');
const avd = 'mason-core-extraction';
const image = 'system-images;android-35;google_apis;arm64-v8a';
const ownershipFile = resolve(workspaceRoot, 'tmp/mason-core-android-avd.json');
const consumer = process.argv.includes('--consumer');
const apk = resolve(workspaceRoot, consumer ? 'tmp/mason-core-nativescript-consumer/platforms/android/app/build/outputs/apk/debug/app-debug.apk' : 'dist/native/mason-core/android-host/tests/MasonCore-tests.apk');
if (!existsSync(apk)) throw new Error(consumer ? 'Build nativescript-mason-core:build.consumer.android first.' : 'Build nativescript-mason-core:build.tests.android first.');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', timeout: 30000, maxBuffer: 16 * 1024 * 1024, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const names = run(emulator, ['-list-avds']).trim().split('\n');
if (names.includes(avd)) {
  assert.ok(existsSync(ownershipFile), `An existing ${avd} AVD has no prototype ownership record.`);
  assert.deepEqual(JSON.parse(readFileSync(ownershipFile, 'utf8')), { avd, image });
} else {
  run(resolve(sdk, 'cmdline-tools/latest/bin/avdmanager'), ['create', 'avd', '-n', avd, '-k', image, '-d', 'pixel_7'], { input: 'no\n', timeout: 60000 });
  writeFileSync(ownershipFile, JSON.stringify({ avd, image }) + '\n');
}

async function available(port) {
  return await new Promise((resolve) => {
    const server = createServer();
    server.once('error', () => resolve(false));
    server.listen(port, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

const devices = run(adb, ['devices']);
let port;
// Stay inside adb's default emulator discovery range. Higher console ports
// can boot successfully while remaining invisible to an existing adb server.
for (let candidate = 5554; candidate <= 5584; candidate += 2) {
  if (!devices.includes(`emulator-${candidate}`) && await available(candidate) && await available(candidate + 1)) {
    port = candidate;
    break;
  }
}
assert.ok(port, 'No free Android emulator port pair.');
const serial = `emulator-${port}`;
const results = resolve(workspaceRoot, consumer ? 'tmp/mason-core-nativescript-android-emulator-tests' : 'tmp/mason-core-android-tests', String(Date.now()));
mkdirSync(results, { recursive: true });
const descriptor = openSync(resolve(results, 'emulator.log'), 'w');
const child = spawn(emulator, ['-avd', avd, '-port', String(port), '-no-window', '-no-audio', '-no-boot-anim', '-no-snapshot', '-gpu', 'swiftshader_indirect'], { stdio: ['ignore', descriptor, descriptor] });
let launchError;
child.on('error', (error) => { launchError = error; });
try {
  console.log(`Booting dedicated ${avd} (${serial}).`);
  const deadline = Date.now() + 180000;
  let booted = false;
  while (Date.now() < deadline) {
    if (launchError) throw launchError;
    if (child.exitCode !== null) throw new Error(`Dedicated Android emulator exited with ${child.exitCode}. See ${results}/emulator.log.`);
    const status = spawnSync(adb, ['-s', serial, 'shell', 'getprop', 'sys.boot_completed'], { encoding: 'utf8', timeout: 10000 });
    if (status.status === 0 && status.stdout.trim() === '1') { booted = true; break; }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  assert.ok(booted, `Dedicated Android emulator did not boot. See ${results}/emulator.log.`);
  const reportedName = run(adb, ['-s', serial, 'emu', 'avd', 'name']);
  assert.ok(reportedName.split(/\r?\n/).includes(avd), `Unexpected AVD name response: ${JSON.stringify(reportedName)}`);
  if (consumer) {
    const result = spawnSync(process.execPath, [resolve(workspaceRoot, 'tools/mason-core/run-android-consumer.mjs')], {
      encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, MASON_CORE_ANDROID_EMULATOR_SERIAL: serial },
    });
    writeFileSync(resolve(results, 'consumer.log'), `${result.stdout ?? ''}\n${result.stderr ?? ''}`);
    if (result.error) throw result.error;
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    console.log(result.stdout.trim());
  } else {
    run(adb, ['-s', serial, 'install', '-r', '-t', apk], { timeout: 120000 });
    const output = run(adb, ['-s', serial, 'shell', 'am', 'instrument', '-w', 'org.nativescript.mason.masonkit.test/androidx.test.runner.AndroidJUnitRunner'], { timeout: 240000 });
    writeFileSync(resolve(results, 'instrumentation.log'), output);
    console.log(output);
    assert.match(output, /OK \(17 tests\)/);
    assert.doesNotMatch(output, /FAILURES!!!|INSTRUMENTATION_FAILED|INSTRUMENTATION_STATUS_CODE: -[34]\b/);
    writeFileSync(resolve(results, 'summary.json'), JSON.stringify({ avd, serial, total: 17, passed: 17, failed: 0, skipped: 0, evidence: 'Android native instrumentation; no NativeScript runtime or OS-input qualification.' }, null, 2) + '\n');
    console.log('All 17 native Android core tests passed with no skips.');
  }
} catch (error) {
  const logs = spawnSync(adb, ['-s', serial, 'logcat', '-d', '-s', 'AndroidRuntime', 'masonnative'], { encoding: 'utf8', timeout: 15000 });
  writeFileSync(resolve(results, 'failure.log'), `${error.stack}\n${logs.stdout ?? ''}\n${logs.stderr ?? ''}`);
  throw error;
} finally {
  const name = spawnSync(adb, ['-s', serial, 'emu', 'avd', 'name'], { encoding: 'utf8', timeout: 10000 });
  if (name.status === 0 && name.stdout.split(/\r?\n/).includes(avd)) spawnSync(adb, ['-s', serial, 'emu', 'kill'], { encoding: 'utf8', timeout: 10000 });
  if (child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([new Promise((resolve) => child.once('exit', resolve)), new Promise((resolve) => setTimeout(resolve, 10000))]);
    if (child.exitCode === null) child.kill('SIGKILL');
  }
  closeSync(descriptor);
}
