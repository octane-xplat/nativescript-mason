import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tarball = process.argv[2];
assert(tarball, 'Usage: node tools/scripts/verify-release.mjs <tarball>');
const files = new Set(execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' }).trim().split('\n'));
const read = (path) => execFileSync('tar', ['-xOf', tarball, `package/${path}`], { encoding: 'utf8' });
const source = JSON.parse(readFileSync('packages/nativescript-masonkit/package.json', 'utf8'));
const manifest = JSON.parse(read('package.json'));
assert.equal(manifest.name, '@octane-xplat/nativescript-masonkit');
assert.equal(manifest.version, source.version);
assert.equal(manifest.publishConfig.access, 'public');
assert.equal(manifest.repository.url, 'https://github.com/octane-xplat/nativescript-mason');
assert.equal(manifest.repository.directory, 'packages/nativescript-masonkit');

for (const path of [
  'index.android.js', 'index.ios.js', 'index.windows.js', 'index.d.ts', 'nativescript.webpack.js', 'postcss-guard.js',
  'platforms/android/masonkit-release.aar',
  'platforms/ios/Mason.xcframework/ios-arm64/Mason.framework/Mason',
  'platforms/ios/Mason.xcframework/ios-arm64_x86_64-simulator/Mason.framework/Mason',
  ...['x64', 'arm64'].flatMap((arch) => ['dll', 'winmd'].map((ext) => `platforms/windows/${arch}/NativeScript.Mason.${ext}`)),
]) {
  assert(files.has(`package/${path}`), `Missing package file: ${path}`);
}

for (const adapter of ['angular', 'vue', 'svelte']) {
  const metadata = JSON.parse(read(`${adapter}/package.json`));
  assert.equal(metadata.name, `${manifest.name}-${adapter}`);
  for (const entry of [metadata.main, metadata.module, metadata.typings].filter(Boolean)) {
    assert(files.has(`package/${adapter}/${entry.replace(/^\.\//, '')}`), `Missing ${adapter} entry: ${entry}`);
  }
}
assert(!read('nativescript.webpack.js').includes('@triniwiz/'), 'Webpack entry uses the upstream package name');
console.log(`Verified ${manifest.name}@${manifest.version}, adapters and native artifacts.`);
