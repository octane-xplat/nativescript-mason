import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { workspaceRoot, coreSourceRoot, relocatedFiles } from './sources.mjs';
import { coreCommonSource, coreTreeSource, coreLayoutTypes, corePropertiesSource } from './runtime-sources.mjs';

const require = createRequire(import.meta.url);
const runtimeSourceRoot = resolve(workspaceRoot, 'tmp/nativescript-mason-core');
const runtimeOutput = resolve(workspaceRoot, 'dist/prototypes/nativescript-mason-core');

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
write('layout-types.d.ts', coreLayoutTypes());
const entry = `export { View } from './view';
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
// Build-only native declarations. No full-package runtime imports or binaries.
write('references.d.ts', '/// <reference path="../../packages/nativescript-masonkit/references.d.ts" />\n');
write('tsconfig.json', JSON.stringify({
  extends: '../../tsconfig.base.json',
  compilerOptions: { rootDir: '.', outDir: runtimeOutput, sourceMap: false },
  include: ['**/*.ts'],
  exclude: [],
}, null, 2));

const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(runtimeSourceRoot, 'tsconfig.json')], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
for (const name of ['index.d.ts', 'layout-types.d.ts', 'view/index.d.ts', 'scroll/index.d.ts', 'tree/index.d.ts']) {
  mkdirSync(dirname(resolve(runtimeOutput, name)), { recursive: true });
  copyFileSync(resolve(runtimeSourceRoot, name), resolve(runtimeOutput, name));
}
const base = JSON.parse(readFileSync(resolve(coreSourceRoot, 'package.json'), 'utf8'));
const manifest = {
  name: base.name, version: base.version, private: true, license: base.license,
  description: 'Mason core runtime prototype; native host artifacts are not yet included',
  main: 'index', types: 'index.d.ts',
  peerDependencies: { '@nativescript/core': '~9.1.2' },
  repository: base.repository,
  masonCorePrototype: { nativeHosts: false, platforms: ['ios', 'android'] },
};
writeFileSync(resolve(runtimeOutput, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(runtimeOutput, 'LICENSE'));
copyFileSync(resolve(workspaceRoot, 'tools/mason-core/runtime-README.md'), resolve(runtimeOutput, 'README.md'));
console.log('Built isolated core runtime prototype (native host artifacts are still required).');
