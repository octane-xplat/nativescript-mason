import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { workspaceRoot } from './sources.mjs';

const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
const require = createRequire(resolve(consumer, 'package.json'));
const scenario = JSON.parse(readFileSync(resolve(consumer, 'consumer-scenario.json'), 'utf8'));
assert.equal(scenario.scenario, 'xplat-compiled');
assert.equal(JSON.parse(readFileSync(resolve(consumer, 'node_modules/@tsrx/oxc/package.json'), 'utf8')).version, scenario.compiler.parser);
const { compile } = await import(pathToFileURL(require.resolve('octane/compiler')).href);
const { nativeScriptRenderer } = await import(pathToFileURL(require.resolve('@nativescript-community/octane/config')).href);
const source = readFileSync(resolve(consumer, scenario.compiler.source), 'utf8');
// Only this explicit src/*.tsrx input is owned by the native renderer. Plain
// JavaScript bootstrap/tooling files remain outside its compilation scope.
const result = compile(source, scenario.compiler.source, {
  renderer: { id: 'nativescript', ...nativeScriptRenderer }, mode: 'client', hmr: false, dev: true,
});
assert.deepEqual(result.diagnostics, []);
assert.match(result.code, /from ['"]@nativescript-community\/octane['"]/);
assert.doesNotMatch(result.code, /from ['"]octane['"]/, 'Compiled hooks must use the same native renderer runtime.');
writeFileSync(resolve(consumer, 'app/hook-component.js'), result.code);
const hash = (text) => createHash('sha256').update(text).digest('hex');
writeFileSync(resolve(consumer, 'compiled-component-manifest.json'), JSON.stringify({
  compiler: scenario.versions.octane, parser: scenario.compiler.parser,
  renderer: '@nativescript-community/octane', source: scenario.compiler.source,
  sourceSha256: hash(source), emittedSha256: hash(result.code),
  qualification: 'Compiler output only; NativeScript application assertions qualify hooks and native geometry separately.',
}, null, 2) + '\n');
console.log('Compiled authored TSRX to native host plans and renderer-owned hooks.');
