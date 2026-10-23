import assert from 'node:assert/strict';
import { closeSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';
import { driveInputStep } from './input-driver.mjs';

function run(args, timeout = 30000) {
  const result = spawnSync('xcrun', args, { encoding: 'utf8', timeout, maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `xcrun ${args.join(' ')}:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

const device = readFileSync(resolve(workspaceRoot, 'tmp/mason-core-ios-test-device.txt'), 'utf8').trim();
const osInput = process.argv.includes('--os-input');
if (osInput) assert.equal(JSON.parse(readFileSync(resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer/consumer-scenario.json'), 'utf8')).scenario, 'xplat-compiled');
const devices = JSON.parse(run(['simctl', 'list', 'devices', '-j']));
const selected = Object.values(devices.devices).flat().find((entry) => entry.udid === device);
assert.equal(selected?.name, 'Mason core extraction', 'Use the owned Mason core extraction simulator.');
assert.equal(selected.state, 'Shutdown', 'The consumer runner requires its dedicated simulator to be shut down.');
const products = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer/platforms/ios/build/Debug-iphonesimulator');
const apps = readdirSync(products).filter((name) => name.endsWith('.app'));
assert.equal(apps.length, 1, 'Build the isolated iOS consumer first.');
const app = resolve(products, apps[0]);
assert.ok(existsSync(resolve(app, 'Frameworks/MasonCore.framework/MasonCore')));
assert.ok(existsSync(resolve(app, 'Frameworks/MasonCore.framework/SDWebImage_SDWebImage.bundle/PrivacyInfo.xcprivacy')));
assert.ok(!existsSync(resolve(app, 'Frameworks/Mason.framework')));
const id = 'org.octane.masoncoreprobe';
const output = resolve(workspaceRoot, 'tmp/mason-core-nativescript-ios-tests', String(Date.now()));
mkdirSync(output, { recursive: true });
const consoleFile = resolve(output, 'console.log');
const descriptor = openSync(consoleFile, 'w');
let consoleProcess;
let companion;
let socketDirectory;
const actions = [];
try {
  console.log(`Booting dedicated Mason core extraction simulator (${device}).`);
  run(['simctl', 'boot', device]);
  run(['simctl', 'bootstatus', device, '-b'], 180000);
  console.log('Installing the isolated core-only NativeScript app.');
  run(['simctl', 'install', device, app], 60000);
  const data = run(['simctl', 'get_app_container', device, id, 'data']).trim();
  const resultFile = resolve(data, 'Documents/mason-core-result.json');
  const readyFile = resolve(data, 'Documents/mason-core-input-ready.json');
  rmSync(resultFile, { force: true });
  rmSync(readyFile, { force: true });
  const marker = resolve(data, 'Documents/mason-core-os-input');
  if (osInput) writeFileSync(marker, '');
  else rmSync(marker, { force: true });
  let socket;
  if (osInput) {
    socketDirectory = mkdtempSync(resolve(tmpdir(), 'mc-hid-'));
    socket = resolve(socketDirectory, 'idb.sock');
    companion = spawn('idb_companion', ['--udid', device, '--grpc-domain-sock', socket,
      '--log-level', 'info', '--log-file-path', resolve(output, 'idb-companion.log'), '--terminate-offline', '1'],
    { stdio: ['ignore', descriptor, descriptor] });
    let companionError;
    companion.on('error', (error) => { companionError = error; });
    const deadline = Date.now() + 30000;
    while (!existsSync(socket) && Date.now() < deadline && companion.exitCode === null && !companionError) await new Promise((resolve) => setTimeout(resolve, 100));
    if (companionError) throw companionError;
    assert.ok(existsSync(socket), 'The owned idb companion did not expose its private socket.');
  }
  console.log('Launching with console capture and waiting for native assertions.');
  consoleProcess = spawn('xcrun', ['simctl', 'launch', '--terminate-running-process', '--console-pty', device, id], { stdio: ['ignore', descriptor, descriptor] });
  let launchError;
  consoleProcess.on('error', (error) => { launchError = error; });
  const deadline = Date.now() + (osInput ? 90000 : 45000);
  while (!existsSync(resultFile) && Date.now() < deadline && consoleProcess.exitCode === null && !launchError) {
    if (osInput && existsSync(readyFile)) {
      let ready;
      try { ready = JSON.parse(readFileSync(readyFile, 'utf8')); } catch (error) { if (!(error instanceof SyntaxError)) throw error; }
      if (ready) driveInputStep(ready, 'ios', actions, (action) => {
        const command = action.phase === 'tap'
          ? ['tap', String(action.point.x), String(action.point.y), '--api', 'hid']
          : ['swipe', String(action.from.x), String(action.from.y), String(action.to.x), String(action.to.y), '--duration', '0.35', '--delta', '2'];
        const input = spawnSync('idb', ['--companion', socket, 'ui', ...command, '--udid', device,
          '--reason', 'Qualify OS hit testing and scrolling in the owned Mason core application'],
        { encoding: 'utf8', timeout: 30000, env: { ...process.env, AI_AGENT: process.env.AI_AGENT ?? 'Codex/MasonCoreProbe' } });
        if (input.error) throw input.error;
        assert.equal(input.status, 0, `idb input failed: ${input.stdout}\n${input.stderr}`);
        writeFileSync(resolve(output, 'input-actions.json'), JSON.stringify([...actions, action], null, 2) + '\n');
      });
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
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
  if (osInput) {
    assert.equal(result.osInput, true);
    assert.deepEqual(actions.map(({ phase }) => phase), ['tap', 'scroll']);
  }
  const scenarioPath = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer/consumer-scenario.json');
  if (existsSync(scenarioPath)) {
    const scenario = JSON.parse(readFileSync(scenarioPath, 'utf8'));
    assert.equal(result.scenario, scenario.scenario, 'The installed app does not match the prepared consumer scenario.');
    if (scenario.bundler) assert.equal(result.bundler, scenario.bundler, 'The installed app does not match the prepared bundler.');
  }
  console.log('The isolated NativeScript iOS consumer passed its native bridge, layout and ownership assertions.');
} finally {
  consoleProcess?.kill('SIGTERM');
  if (companion && companion.exitCode === null) {
    companion.kill('SIGTERM');
    await Promise.race([new Promise((resolve) => companion.once('exit', resolve)), new Promise((resolve) => setTimeout(resolve, 2000))]);
    if (companion.exitCode === null) companion.kill('SIGKILL');
  }
  if (socketDirectory) rmSync(socketDirectory, { recursive: true, force: true });
  closeSync(descriptor);
  // This runner owns the simulator and checks it was shut down before booting.
  spawnSync('xcrun', ['simctl', 'terminate', device, id], { timeout: 15000, stdio: 'ignore' });
  run(['simctl', 'shutdown', device]);
}
