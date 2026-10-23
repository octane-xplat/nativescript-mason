import assert from 'node:assert/strict';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const plugin = resolve(workspaceRoot, 'dist/packages/nativescript-mason-core');
const isolated = mkdtempSync(resolve(tmpdir(), 'mason-core-plugin-'));
function run(command, args, cwd = isolated) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command}: ${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
try {
  run('pnpm', ['pack', '--pack-destination', isolated], plugin);
  const tarball = readdirSync(isolated).filter((name) => name.endsWith('.tgz'));
  assert.equal(tarball.length, 1);
  run('tar', ['-xzf', resolve(isolated, tarball[0])]);
  const root = resolve(isolated, 'package');
  const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  assert.notEqual(manifest.private, true);
  assert.equal(manifest.name, '@octane-xplat/nativescript-mason-core');
  const sourceManifest = JSON.parse(readFileSync(resolve(workspaceRoot, 'packages/nativescript-mason-core/package.json'), 'utf8'));
  assert.equal(manifest.version, sourceManifest.version);
  assert.equal(manifest.publishConfig.access, 'public');
  assert.deepEqual(manifest.repository, sourceManifest.repository);
  assert.deepEqual(Object.keys(manifest.peerDependencies), ['@nativescript/core']);
  assert.equal(manifest.dependencies, undefined);
  assert.equal(manifest.masonCorePrototype.nativeHosts, true);
  assert.equal(manifest.masonCorePrototype.ios.simulatorOnly, false);
  assert.equal(manifest.masonCorePrototype.nativeTypes, true);
  const inventory = JSON.parse(readFileSync(resolve(root, 'artifact-inventory.json'), 'utf8'));
  function files(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      assert.ok(!entry.isSymbolicLink(), `External artifact link: ${entry.name}`);
      const filename = resolve(directory, entry.name);
      return entry.isDirectory() ? files(filename) : [relative(root, filename)];
    });
  }
  assert.deepEqual(files(root).filter((name) => name !== 'artifact-inventory.json').sort(), inventory.map(({ name }) => name).sort());
  for (const { name, sha256 } of inventory) {
    assert.equal(createHash('sha256').update(readFileSync(resolve(root, name))).digest('hex'), sha256, name);
  }
  for (const name of [
    'platforms/ios/MasonCore.xcframework/ios-arm64/MasonCore.framework/MasonCore',
    'platforms/ios/MasonCore.xcframework/ios-arm64-simulator/MasonCore.framework/MasonCore',
    'platforms/ios/include/module.modulemap',
    'platforms/ios/MasonCore.xcframework/ios-arm64/MasonCore.framework/SDWebImage_SDWebImage.bundle/PrivacyInfo.xcprivacy',
    'platforms/ios/MasonCore.xcframework/ios-arm64-simulator/MasonCore.framework/SDWebImage_SDWebImage.bundle/PrivacyInfo.xcprivacy',
    'platforms/android/MasonCore.aar', 'platforms/android/include.gradle',
  ]) assert.ok(existsSync(resolve(root, name)), `Missing native plugin input: ${name}`);
  const javascript = inventory.filter(({ name }) => name.endsWith('.js'));
  assert.equal(javascript.length, 33);
  for (const { name } of javascript) {
    const source = readFileSync(resolve(root, name), 'utf8');
    for (const dependency of ts.preProcessFile(source).importedFiles) {
      assert.ok(dependency.fileName.startsWith('.') || /^@nativescript\/core(?:\/|$)/.test(dependency.fileName),
        `Undeclared runtime dependency: ${name} -> ${dependency.fileName}`);
    }
  }
  console.log(`Isolated packed plugin: ${inventory.length} files retain their hashes, native resources and independent package boundary.`);
} finally {
  rmSync(isolated, { recursive: true, force: true });
}
