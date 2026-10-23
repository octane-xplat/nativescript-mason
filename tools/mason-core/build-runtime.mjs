import assert from 'node:assert/strict';
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { workspaceRoot, coreSourceRoot, relocatedFiles } from './sources.mjs';
import { coreCommonSource, coreTreeSource, coreLayoutTypes, corePropertiesSource, coreStyleSource, coreForeignLayoutSource } from './runtime-sources.mjs';
import { resolveMobileConstants } from './mobile-constants.mjs';

const require = createRequire(import.meta.url);
const runtimeSourceRoot = resolve(workspaceRoot, 'tmp/nativescript-mason-core');
const runtimeOutput = resolve(workspaceRoot, 'dist/prototypes/nativescript-mason-core');
const nativeTypes = JSON.parse(readFileSync(resolve(coreSourceRoot, 'typings/manifest.json'), 'utf8'));
for (const { name, sha256 } of nativeTypes.files) {
  const content = readFileSync(resolve(coreSourceRoot, 'typings', name));
  assert.equal(createHash('sha256').update(content).digest('hex'), sha256, `Generated core declaration changed: ${name}`);
}

function write(name, text) {
  const filename = resolve(runtimeSourceRoot, name);
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, text);
}

rmSync(runtimeSourceRoot, { recursive: true, force: true });
rmSync(runtimeOutput, { recursive: true, force: true });
mkdirSync(runtimeSourceRoot, { recursive: true });
for (const name of relocatedFiles.filter((name) => !name.includes('.windows.'))) {
  const filename = resolve(runtimeSourceRoot, name);
  mkdirSync(dirname(filename), { recursive: true });
  copyFileSync(resolve(coreSourceRoot, name), filename);
}
write('common.ts', coreCommonSource());
write('properties.ts', corePropertiesSource());
write('style.ts', coreStyleSource());
write('foreign-layout.ts', coreForeignLayoutSource());
write('layout-types.d.ts', coreLayoutTypes());
cpSync(resolve(coreSourceRoot, 'typings'), resolve(runtimeSourceRoot, 'typings'), { recursive: true });
const entry = `/// <reference path="./typings/native.d.ts" />
export { View } from './view';
export { Scroll } from './scroll';
export { ViewBase, Event } from './common';
export type { ScrollBehavior, ScrollLogicalPosition, ScrollToOptions, ScrollIntoViewOptions } from './common';
export { Style } from './style';
export { setCssDiagnostics, getCssDiagnostics, clearCssDiagnostics, formatCssDiagnostics, cssDiagnosticsEnabled } from './diagnostics';
export { setCssUnitContext, cssUnits } from './units';
export { registerAppFontsDirectory } from './fonts';
export type * from './layout-types';
`;
for (const platform of ['ios', 'android']) {
  write(`tree/index.${platform}.ts`, coreTreeSource(platform));
  write(`index.${platform}.ts`, entry);
}
write('index.d.ts', entry);
write('tree/index.d.ts', coreTreeSource('types'));
// SDK ambient declarations are compiler inputs; native bridge types belong to core.
write('references.d.ts', `/// <reference path="../../node_modules/@nativescript/core/global-types.d.ts" />
/// <reference path="../../node_modules/@nativescript/types-ios/index.d.ts" />
/// <reference path="../../node_modules/@nativescript/types-android/index.d.ts" />
/// <reference path="./typings/native.d.ts" />
`);
write('mobile-build.d.ts', readFileSync(resolve(workspaceRoot, 'tools/mason-core/mobile-build.d.ts'), 'utf8'));
write('tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: { rootDir: '.', outDir: runtimeOutput, sourceMap: false },
  include: ['**/*.ts'],
  exclude: [],
}, null, 2));

const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(runtimeSourceRoot, 'tsconfig.json'), '--listFiles', '--pretty', 'false'], {
  cwd: workspaceRoot,
  encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
});
if (result.error) throw result.error;
if (result.status !== 0) {
  process.stderr.write(`${result.stdout}\n${result.stderr}`);
  process.exit(result.status ?? 1);
}
const compilerFiles = result.stdout.trim().split(/\r?\n/);
assert.ok(compilerFiles.length > 0);
assert.ok(!compilerFiles.some((name) => /(?:^|[/\\])nativescript-masonkit[/\\]/.test(name)),
  'Core runtime compilation loaded full MasonKit source or native declarations.');
writeFileSync(resolve(runtimeSourceRoot, 'compiler-files.json'), JSON.stringify(compilerFiles, null, 2) + '\n');
console.log('Core runtime compiler uses independent native declarations and SDK types, without full MasonKit typings.');
for (const name of ['index.d.ts', 'layout-types.d.ts', 'view/index.d.ts', 'scroll/index.d.ts', 'tree/index.d.ts']) {
  mkdirSync(dirname(resolve(runtimeOutput, name)), { recursive: true });
  copyFileSync(resolve(runtimeSourceRoot, name), resolve(runtimeOutput, name));
}
cpSync(resolve(coreSourceRoot, 'typings'), resolve(runtimeOutput, 'typings'), { recursive: true });
function resolveConstants(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = resolve(directory, entry.name);
    if (entry.isDirectory()) resolveConstants(filename);
    else if (entry.name.endsWith('.js')) {
      const source = readFileSync(filename, 'utf8');
      const projected = resolveMobileConstants(source, filename);
      if (projected !== source) writeFileSync(filename, projected);
    }
  }
}
resolveConstants(runtimeOutput);
const base = JSON.parse(readFileSync(resolve(coreSourceRoot, 'package.json'), 'utf8'));
assert.notEqual(base.type, 'commonjs', 'The native runtime emits ES modules; CommonJS metadata belongs only to the portable helper proof.');
const manifest = {
  ...base,
  private: true,
  description: 'Mason core runtime intermediate; native host artifacts are not included',
  masonCorePrototype: { nativeHosts: false, nativeTypes: true, platforms: ['ios', 'android'] },
};
// This intermediate is not a NativeScript plugin until native assembly.
delete manifest.nativescript;
writeFileSync(resolve(runtimeOutput, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(runtimeOutput, 'LICENSE'));
copyFileSync(resolve(workspaceRoot, 'tools/mason-core/runtime-README.md'), resolve(runtimeOutput, 'README.md'));
for (const name of ['native-types-README.md', 'plugin-README.md']) {
  copyFileSync(resolve(workspaceRoot, 'tools/mason-core', name), resolve(runtimeOutput, name));
}
copyFileSync(resolve(workspaceRoot, 'tools/mason-core/ios-host-README.md'), resolve(runtimeOutput, 'ios-host-README.md'));
console.log('Built isolated core runtime prototype (native host artifacts are still required).');
