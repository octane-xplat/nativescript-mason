import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { coreSourceRoot } from './sources.mjs';

// Confirms the built Windows core host exposes the layout/style/container
// surface and no widget runtimeclasses. Parses the winmd through the SDK's
// winmdidl tool: member names like CreateTextNode stay in the engine contract,
// so a raw string scan cannot separate them from widget type names.

const dir = resolve(coreSourceRoot, 'platforms/windows/x64');
const dll = resolve(dir, 'NativeScript.Mason.dll');
const winmd = resolve(dir, 'NativeScript.Mason.winmd');
for (const artifact of [dll, winmd]) {
  assert.ok(existsSync(artifact), `Missing core Windows host artifact: ${artifact}`);
}

const kits = 'C:\\Program Files (x86)\\Windows Kits\\10\\bin';
let tool = null;
for (const version of readdirSync(kits).sort().reverse()) {
  const candidate = resolve(kits, `${version}\\x64\\winmdidl.exe`);
  if (existsSync(candidate)) { tool = candidate; break; }
}
assert.ok(tool, 'winmdidl.exe not found under Windows Kits — install the Windows SDK.');

const out = mkdtempSync(resolve(tmpdir(), 'mason-core-winmd-'));
const run = spawnSync(tool, [`/metadata_dir:${dir}`, `/outdir:${out}`, '/utf8', winmd], { encoding: 'utf8' });
assert.equal(run.status, 0, `winmdidl failed: ${run.stderr || run.stdout}`);
const idl = readFileSync(resolve(out, 'NativeScript.Mason.idl'), 'utf8');
const runtimeclasses = [...idl.matchAll(/runtimeclass\s+(\w+)/g)].map((match) => match[1]).sort();

assert.deepEqual(runtimeclasses, [
  'Css', 'CssImageResult', 'Diagnostics', 'Event', 'FixedLayer', 'FixedSlot',
  'Layout', 'Mason', 'MeasureOutput', 'Node', 'RoundedColorBrush', 'Style', 'View',
]);
console.log(`windows-host: winmd exposes the ${runtimeclasses.length} core runtimeclasses, no widget types`);
