import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { workspaceRoot, coreSourceRoot } from './sources.mjs';

const require = createRequire(import.meta.url);
const output = resolve(workspaceRoot, 'dist/packages/nativescript-mason-core');
rmSync(output, { recursive: true, force: true });
const result = spawnSync(process.execPath, [require.resolve('typescript/bin/tsc'), '-p', resolve(coreSourceRoot, 'tsconfig.json')], {
  cwd: workspaceRoot,
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
mkdirSync(output, { recursive: true });
for (const name of ['package.json', 'README.md']) copyFileSync(resolve(coreSourceRoot, name), resolve(output, name));
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(output, 'LICENSE'));
mkdirSync(resolve(output, 'src-native'), { recursive: true });
copyFileSync(resolve(coreSourceRoot, 'src-native/README.md'), resolve(output, 'src-native/README.md'));
