import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';

/** Logical full-package filenames continue to resolve to a single tracked source. */
export const nativeRelocations = JSON.parse(readFileSync(new URL('./native-relocations.json', import.meta.url), 'utf8'));
export function nativeSource(platform, name) {
  assert.ok(Object.hasOwn(nativeRelocations.roots, platform));
  const moved = nativeRelocations.files[platform].some((file) => file.name === name);
  const root = nativeRelocations.roots[platform][moved ? 'relocated' : 'original'];
  const filename = resolve(workspaceRoot, root, name);
  assert.ok(!relative(resolve(workspaceRoot, root), filename).startsWith('..'), 'Native filename escapes its source root.');
  return filename;
}
export function nativeFiles(platform) {
  function files(directory, prefix = '') {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      assert.ok(!entry.isSymbolicLink(), `Unexpected native source link: ${entry.name}`);
      const name = prefix + entry.name;
      return entry.isDirectory() ? files(resolve(directory, entry.name), `${name}/`) : [name];
    });
  }
  const names = files(resolve(workspaceRoot, nativeRelocations.roots[platform].original));
  for (const { name } of nativeRelocations.files[platform]) {
    assert.ok(!names.includes(name), `Duplicate native source retained after move: ${name}`);
    assert.ok(existsSync(nativeSource(platform, name)), `Missing relocated native source: ${name}`);
    names.push(name);
  }
  return names.sort();
}
export function copyRelocatedNativeSources(platform, destination) {
  for (const { name } of nativeRelocations.files[platform]) {
    const target = resolve(destination, name);
    mkdirSync(dirname(target), { recursive: true });
    copyFileSync(nativeSource(platform, name), target);
  }
}

/** Generated projects reconstruct the old logical tree in their staging directory. */
export function restoreStagedIosReferences(project) {
  const original = resolve(workspaceRoot, nativeRelocations.roots.ios.original, '..');
  for (const { name } of nativeRelocations.files.ios) {
    const path = relative(original, nativeSource('ios', name));
    const reference = `name = ${name}; path = "${path}"; sourceTree = SOURCE_ROOT;`;
    assert.equal(project.split(reference).length, 2, `Relocated Xcode source reference changed: ${name}`);
    project = project.replace(reference, `path = ${name}; sourceTree = "<group>";`);
  }
  return project;
}
