import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { workspaceRoot, coreSourceRoot } from './sources.mjs';

const require = createRequire(import.meta.url);
const output = resolve(workspaceRoot, 'dist/prototypes/nativescript-mason-core-helpers');
rmSync(output, { recursive: true, force: true });
const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(coreSourceRoot, 'tsconfig.json')], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
mkdirSync(output, { recursive: true });
const base = JSON.parse(readFileSync(resolve(coreSourceRoot, 'package.json'), 'utf8'));
const manifest = {
  name: base.name, version: base.version, private: true, license: base.license,
  description: 'Portable helper proof; no native runtime or hosts',
  type: 'commonjs', main: './portable-helpers.js', types: './portable-helpers.d.ts',
  repository: base.repository,
};
writeFileSync(resolve(output, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
copyFileSync(resolve(workspaceRoot, 'tools/mason-core/helpers-README.md'), resolve(output, 'README.md'));
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(output, 'LICENSE'));
mkdirSync(resolve(output, 'src-native'), { recursive: true });
copyFileSync(resolve(coreSourceRoot, 'src-native/README.md'), resolve(output, 'src-native/README.md'));
