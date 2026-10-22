import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: workspaceRoot, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status})${capture ? ': ' + result.stderr : ''}`);
  return result.stdout;
}

const device = readFileSync(resolve(workspaceRoot, 'tmp/mason-core-ios-test-device.txt'), 'utf8').trim();
const devices = JSON.parse(run('xcrun', ['simctl', 'list', 'devices', '-j'], true));
const selected = Object.values(devices.devices).flat().find((entry) => entry.udid === device);
if (!selected || selected.name !== 'Mason core extraction') throw new Error('Use the dedicated Mason core extraction simulator.');
const products = resolve(workspaceRoot, 'tmp/mason-core-ios-derived/Build/Products');
const plans = readdirSync(products).filter((name) => name.endsWith('.xctestrun'));
if (plans.length !== 1) throw new Error('Build the core iOS test bundle first; expected exactly one test plan.');
const results = resolve(workspaceRoot, 'tmp/mason-core-ios-tests', String(Date.now()));
mkdirSync(results, { recursive: true });
const bundle = resolve(results, 'tests.xcresult');

try {
  if (selected.state !== 'Booted') run('xcrun', ['simctl', 'boot', device]);
  run('xcrun', ['simctl', 'bootstatus', device, '-b']);
  run('xcodebuild', [
    'test-without-building', '-xctestrun', resolve(products, plans[0]),
    '-destination', `platform=iOS Simulator,id=${device}`,
    '-parallel-testing-enabled', 'NO', '-maximum-concurrent-test-simulator-destinations', '1',
    '-only-testing:MasonTests/CoreLayoutInteropTests',
    '-resultBundlePath', bundle,
    '-test-timeouts-enabled', 'YES', '-maximum-test-execution-time-allowance', '120',
  ]);
  const summary = JSON.parse(run('xcrun', ['xcresulttool', 'get', 'test-results', 'summary', '--path', bundle, '--format', 'json'], true));
  writeFileSync(resolve(results, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  assert.equal(summary.totalTestCount, 15, 'Expected all preserved interop tests and core host regressions.');
  assert.equal(summary.passedTests, 15);
  assert.equal(summary.failedTests, 0);
  assert.equal(summary.skippedTests, 0);
  console.log('All 15 native core layout/foreign-view tests passed on the dedicated iOS simulator.');
} finally {
  run('xcrun', ['simctl', 'shutdown', device]);
}
