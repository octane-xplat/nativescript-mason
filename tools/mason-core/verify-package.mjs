import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { relocatedModules, workspaceRoot } from './sources.mjs';

const require = createRequire(import.meta.url);
const output = resolve(workspaceRoot, 'dist/packages/nativescript-mason-core');
const temporary = mkdtempSync(resolve(tmpdir(), 'mason-core-consumer-'));

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, NODE_PATH: '' } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

try {
  const artifacts = resolve(temporary, 'artifacts');
  mkdirSync(artifacts);
  run('pnpm', ['pack', '--pack-destination', artifacts], output);
  const archives = readdirSync(artifacts).filter((name) => name.endsWith('.tgz'));
  assert.equal(archives.length, 1);
  const archive = resolve(artifacts, archives[0]);
  const entries = run('tar', ['-tzf', archive], temporary).trim().split('\n').map((name) => name.replace(/^package\//, ''));
  const expected = ['LICENSE', 'README.md', 'package.json', ...['index', ...relocatedModules].flatMap((name) => [`${name}.js`, `${name}.d.ts`])];
  assert.deepEqual(entries.sort(), expected.sort(), 'Packed artifact must contain only the independent helper surface.');

  const consumer = resolve(temporary, 'consumer');
  const packageRoot = resolve(consumer, 'node_modules/@octane-xplat/nativescript-mason-core');
  mkdirSync(packageRoot, { recursive: true });
  run('tar', ['-xzf', archive, '-C', packageRoot, '--strip-components=1'], temporary);
  const manifest = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'));
  for (const field of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    assert.equal(Object.keys(manifest[field] ?? {}).length, 0, `${field} must stay empty for the portable helper slice.`);
  }
  assert.equal(manifest.private, true, 'The extraction prototype is not ready for publication.');

  writeFileSync(resolve(consumer, 'smoke.cjs'), `
const assert = require('node:assert/strict');
const core = require('@octane-xplat/nativescript-mason-core');
const math = require('@octane-xplat/nativescript-mason-core/css-math');
assert.equal(core.evaluateCssMath, math.evaluateCssMath);
assert.deepEqual(core.evaluateCssMath('calc(1rem + 2px)', (value, unit) => {
  if (unit === 'px') return value;
  if (unit === 'rem') return value * 16;
}), { kind: 'length', px: 18 });
assert.equal(core.evaluateCssMath('calc(100% - 2px)', () => undefined), undefined);
assert.equal(core.parseCssFilter('blur(4px)', parseFloat)[0].sigma, 4);
assert.deepEqual(core.parseCssTransform('translateX(50%)', parseFloat, {width: 200, height: 100}), [1, 0, 0, 1, 100, 0]);
for (const name of ${JSON.stringify(relocatedModules)}) require('@octane-xplat/nativescript-mason-core/' + name);
assert.equal(Object.keys(require.cache).some((path) => /node_modules[\\/]@nativescript[\\/]/.test(path)), false);
console.log('Packed core root and all subpaths execute without NativeScript or MasonKit.');
`);
  console.log(run(process.execPath, ['smoke.cjs'], consumer).trim());

  writeFileSync(resolve(consumer, 'consumer.ts'), `
import { evaluateCssMath, parseCssFilter, type CssMathResult, type FilterStep } from '@octane-xplat/nativescript-mason-core';
import { parseCssTransform } from '@octane-xplat/nativescript-mason-core/css-transform';
const result: CssMathResult | undefined = evaluateCssMath('calc(2px + 3px)', (value, unit) => unit === 'px' ? value : undefined);
const filters: FilterStep[] = parseCssFilter('blur(4px)', parseFloat);
const matrix = parseCssTransform('none', parseFloat, { width: 100, height: 100 });
void [result, filters, matrix];
`);
  writeFileSync(resolve(consumer, 'tsconfig.json'), JSON.stringify({
    compilerOptions: { strict: true, noEmit: true, target: 'ES2020', module: 'Node16', moduleResolution: 'Node16', lib: ['ES2020'], types: [] },
    files: ['consumer.ts'],
  }, null, 2));
  run(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(consumer, 'tsconfig.json')], consumer);
  console.log('Packed core declarations typecheck without NativeScript or DOM ambient types.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
