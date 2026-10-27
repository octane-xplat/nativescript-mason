import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';
import { verifyWindowsPackage } from './verify-windows-package.mjs';

// Accept a relocated tarball, never a source link or registry beta lacking Windows.
const tarball = resolve(process.argv[2] ?? `dist/packages/octane-xplat-nativescript-mason-core-${JSON.parse(readFileSync(resolve(workspaceRoot, 'packages/nativescript-mason-core/package.json'), 'utf8')).version}.tgz`);
const output = resolve(process.argv[3] ?? 'tmp/mason-core-windows-consumer');
assert.ok(existsSync(tarball), `Missing package: ${tarball}`);
const artifact = verifyWindowsPackage(tarball);
if (existsSync(output)) assert.ok(existsSync(resolve(output, '.mason-core-windows-consumer')), 'Refusing to reuse an unowned directory.');
mkdirSync(output, { recursive: true });
writeFileSync(resolve(output, '.mason-core-windows-consumer'), 'Owned maintained Windows qualification consumer\n');
cpSync(tarball, resolve(output, basename(tarball)));
const json = (name, value) => writeFileSync(resolve(output, name), JSON.stringify(value, null, 2) + '\n');
json('package-artifact.json', artifact);
json('package.json', {
  name: 'masoncorequalification', version: '0.0.0', private: true, main: 'app/app.js',
  dependencies: { '@nativescript/core': 'https://pkg.pr.new/@nativescript/core@abae298', '@octane-xplat/nativescript-mason-core': `file:./${basename(tarball)}` },
  devDependencies: { '@nativescript/vite': 'https://pkg.pr.new/@nativescript/vite@abae298', '@nativescript/windows': '0.1.0-alpha.144', nativescript: '9.1.2-dev.2026-09-24-36031892256', typescript: '5.9.3', vite: '8.3.0' },
});
writeFileSync(resolve(output, 'pnpm-workspace.yaml'), 'packages: []\nautoInstallPeers: false\nminimumReleaseAge: 0\n');
writeFileSync(resolve(output, 'nativescript.config.ts'), `export default { id: 'org.octane.masoncorequalification', appPath: 'app', appResourcesPath: 'App_Resources', cli: { packageManager: 'pnpm' }, bundler: 'vite', bundlerConfigPath: 'vite.config.mts' };\n`);
writeFileSync(resolve(output, 'vite.config.mts'), `import { defineConfig } from 'vite';\nimport { javascriptConfig } from '@nativescript/vite';\nexport default defineConfig(({ mode }) => javascriptConfig({ mode }));\n`);
mkdirSync(resolve(output, 'app'), { recursive: true });
cpSync(resolve(workspaceRoot, 'tools/mason-core/consumer/windows/app.js'), resolve(output, 'app/app.js'));
json('app/fixture-config.json', { resultPath: resolve(output, 'result.json').replaceAll('\\', '/') });
cpSync(resolve(workspaceRoot, 'tools/mason-core/consumer/windows'), resolve(output, 'App_Resources/Windows'), { recursive: true, filter: (path) => !/\.(js|ps1)$/.test(path) });
console.log(`Prepared relocated Windows consumer: ${output}`);
