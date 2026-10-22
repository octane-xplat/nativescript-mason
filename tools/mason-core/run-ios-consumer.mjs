import assert from 'node:assert/strict';
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

function run(args, timeout = 30000) {
  const result = spawnSync('xcrun', args, { encoding: 'utf8', timeout, maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `xcrun ${args.join(' ')}:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const device = readFileSync(resolve(workspaceRoot, 'tmp/mason-core-ios-test-device.txt'), 'utf8').trim();
const devices = JSON.parse(run(['simctl', 'list', 'devices', '-j']));
const selected = Object.values(devices.devices).flat().find((entry) => entry.udid === device);
assert.equal(selected?.name, 'Mason core extraction', 'Use the owned Mason core extraction simulator.');
assert.equal(selected.state, 'Shutdown', 'The consumer runner requires its dedicated simulator to be shut down.');
const products = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer/platforms/ios/build/Debug-iphonesimulator');
const apps = readdirSync(products).filter((name) => name.endsWith('.app'));
assert.equal(apps.length, 1, 'Build the isolated iOS consumer first.');
const app = resolve(products, apps[0]);
assert.ok(existsSync(resolve(app, 'Frameworks/MasonCore.framework/MasonCore')));
assert.ok(existsSync(resolve(app, 'SDWebImage_SDWebImage.bundle/PrivacyInfo.xcprivacy')));
assert.ok(!existsSync(resolve(app, 'Frameworks/Mason.framework')));
const id = 'org.octane.masoncoreprobe';
const output = resolve(workspaceRoot, 'tmp/mason-core-nativescript-ios-tests', String(Date.now()));
mkdirSync(output, { recursive: true });
const consoleFile = resolve(output, 'console.log');
const descriptor = openSync(consoleFile, 'w');
let consoleProcess;
try {
  console.log(`Booting dedicated Mason core extraction simulator (${device}).`);
  run(['simctl', 'boot', device]);
  run(['simctl', 'bootstatus', device, '-b'], 180000);
  console.log('Installing the isolated core-only NativeScript app.');
  run(['simctl', 'install', device, app], 60000);
  const data = run(['simctl', 'get_app_container', device, id, 'data']).trim();
  const resultFile = resolve(data, 'Documents/mason-core-result.json');
  rmSync(resultFile, { force: true });
  console.log('Launching with console capture and waiting for native assertions.');
  consoleProcess = spawn('xcrun', ['simctl', 'launch', '--terminate-running-process', '--console-pty', device, id], { stdio: ['ignore', descriptor, descriptor] });
  let launchError;
  consoleProcess.on('error', (error) => { launchError = error; });
  const deadline = Date.now() + 45000;
  while (!existsSync(resultFile) && Date.now() < deadline && consoleProcess.exitCode === null && !launchError) await new Promise((resolve) => setTimeout(resolve, 500));
  if (launchError) throw launchError;
  if (!existsSync(resultFile)) {
    const logs = spawnSync('xcrun', ['simctl', 'spawn', device, 'log', 'show', '--last', '2m', '--style', 'compact', '--predicate', `process == "${apps[0].slice(0, -4)}"`], { encoding: 'utf8', timeout: 20000, maxBuffer: 4 * 1024 * 1024 });
    writeFileSync(resolve(output, 'unified.log'), `${logs.stdout ?? ''}\n${logs.stderr ?? ''}`);
  }
  assert.ok(existsSync(resultFile), `NativeScript consumer did not report its assertions.\n${readFileSync(consoleFile, 'utf8').slice(-8000)}`);
  const result = JSON.parse(readFileSync(resultFile, 'utf8'));
  writeFileSync(resolve(output, 'result.json'), JSON.stringify(result, null, 2) + '\n');
  assert.equal(result.passed, true, result.error);
  assert.equal(result.platform, 'ios');
  const scenarioPath = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer/consumer-scenario.json');
  if (existsSync(scenarioPath)) assert.equal(result.scenario, JSON.parse(readFileSync(scenarioPath, 'utf8')).scenario, 'The installed app does not match the prepared consumer scenario.');
  console.log('The isolated NativeScript iOS consumer passed its native bridge, layout and ownership assertions.');
} finally {
  consoleProcess?.kill('SIGTERM');
  closeSync(descriptor);
  // This runner owns the simulator and checks it was shut down before booting.
  spawnSync('xcrun', ['simctl', 'terminate', device, id], { timeout: 15000, stdio: 'ignore' });
  run(['simctl', 'shutdown', device]);
}
