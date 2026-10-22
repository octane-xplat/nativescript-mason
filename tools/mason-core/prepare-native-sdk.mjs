import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const directory = resolve(workspaceRoot, 'tmp/mason-core-native-sdk');
const marker = resolve(directory, '.mason-core-native-sdk');
if (existsSync(directory)) assert.ok(existsSync(marker), 'Refusing to overwrite an unowned native SDK fixture.');
mkdirSync(directory, { recursive: true });
writeFileSync(marker, 'Independent SDK tooling for core bridge declaration generation.\n');
writeFileSync(resolve(directory, 'package.json'), JSON.stringify({
  name: 'mason-core-native-sdk', version: '0.0.0', private: true,
  packageManager: JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf8')).packageManager,
  devDependencies: { '@nativescript/android': '9.1.1', '@nativescript/ios': '9.1.0' },
}, null, 2) + '\n');
writeFileSync(resolve(directory, 'pnpm-workspace.yaml'), 'packages: []\nautoInstallPeers: false\n');
const installed = spawnSync('pnpm', ['install', '--ignore-scripts'], { cwd: directory, stdio: 'inherit' });
if (installed.error) throw installed.error;
assert.equal(installed.status, 0, 'The independent native SDK tooling failed to install.');
console.log('Pinned native SDK generators are installed independently of the consumer or core plugin build.');
