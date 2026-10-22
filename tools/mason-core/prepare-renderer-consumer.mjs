import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const hash = (text) => createHash('sha256').update(text).digest('hex');
const repository = process.env.MASON_CORE_XPLAT_REPOSITORY;
const nativeOnly = process.argv.includes('--native-only');
assert.ok(repository, 'Set MASON_CORE_XPLAT_REPOSITORY to the Xplat checkout whose renderer should be qualified.');
const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
assert.ok(existsSync(resolve(consumer, '.mason-core-consumer')));
const catalog = readFileSync(resolve(repository, 'pnpm-workspace.yaml'), 'utf8');
function version(name) {
  const match = catalog.match(new RegExp(`^  ['"]?${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]?: ([0-9]+\\.[0-9]+\\.[0-9]+)$`, 'm'));
  assert.ok(match, `Read the exact Xplat catalog pin for ${name} before preparing this fixture.`);
  return match[1];
}
const versions = Object.fromEntries(['octane', '@nativescript-community/octane', '@nativescript/core'].map((name) => [name, version(name)]));
assert.equal(versions['@nativescript-community/octane'], '0.2.5', 'Review the renderer import boundary for this version.');
const manifestPath = resolve(consumer, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
assert.equal(manifest.dependencies['@octane-xplat/nativescript-masonkit'], undefined);
Object.assign(manifest.dependencies, versions);
manifest.devDependencies.typescript = version('typescript');
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
writeFileSync(resolve(consumer, 'tsconfig.json'), JSON.stringify({
  compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', allowJs: true, checkJs: false, skipLibCheck: true, noEmit: true, types: [] },
  include: ['app/**/*.js'],
}, null, 2) + '\n');
const patches = resolve(consumer, 'patches');
mkdirSync(patches, { recursive: true });
const provenance = [];
for (const [name, pin] of Object.entries(versions)) {
  const filename = `${name.replace('/', '__')}@${pin}.patch`;
  const source = readFileSync(resolve(repository, 'packages/cli/patches', filename), 'utf8');
  let text = source;
  if (name === '@nativescript-community/octane') {
    assert.equal(source.split('@octane-xplat/nativescript-masonkit').length - 1, 2,
      'Review the renderer: the core prototype expects only root container and style imports.');
    text = source.replaceAll('@octane-xplat/nativescript-masonkit', '@octane-xplat/nativescript-mason-core');
  }
  writeFileSync(resolve(patches, filename), text);
  provenance.push({ specifier: `${name}@${pin}`, file: `patches/${filename}`, sourceSha256: hash(source), fixtureSha256: hash(text) });
}
const policy = readFileSync(resolve(consumer, 'pnpm-workspace.yaml'), 'utf8');
assert.ok(!policy.includes('patchedDependencies:'), 'Prepare the base consumer before adding the renderer scenario.');
writeFileSync(resolve(consumer, 'pnpm-workspace.yaml'), policy + 'patchedDependencies:\n' +
  provenance.map(({ specifier, file }) => `  '${specifier}': ${file}`).join('\n') + '\n');
const git = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' });
assert.equal(git.status, 0, git.stderr);
writeFileSync(resolve(consumer, 'consumer-scenario.json'), JSON.stringify({
  scenario: nativeOnly ? 'nativescript' : 'xplat-renderer', xplatCommit: git.stdout.trim(), versions, patches: provenance,
  coreInventorySha256: hash(readFileSync(resolve(workspaceRoot, 'dist/packages/nativescript-mason-core/artifact-inventory.json'))),
  boundary: 'Canonical Xplat renderer patch with only its two Mason package specifiers retargeted to core; full MasonKit is absent.',
}, null, 2) + '\n');
copyFileSync(resolve(workspaceRoot, 'tools/mason-core/consumer', nativeOnly ? 'app.js' : 'renderer-app.js'), resolve(consumer, 'app/app.js'));
console.log(`Prepared the isolated ${nativeOnly ? 'NativeScript SDK control' : 'Xplat renderer'} scenario. Install with pnpm install --force before building.`);
