import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { chmodSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';
import { iosSourceRoot } from './ios-sources.mjs';
import { copyRelocatedNativeSources, nativeFiles, nativeSource, restoreStagedIosReferences } from './native-sources.mjs';
import { SwiftSource } from './swift-source.mjs';
import { run } from './build-native.mjs';

const original = resolve(iosSourceRoot, '..');
const stage = resolve(workspaceRoot, 'tmp/mason-full-ios-baseline');
const derived = resolve(workspaceRoot, 'tmp/mason-full-ios-derived');
const engine = resolve(workspaceRoot, 'dist/native/mason-core/ios/aarch64-apple-ios-sim/libMasonCore.a');
const selected = ['CoreLayoutInteropTests', 'HTMLParserTests', 'MasonTextNodeTests', 'InputAppearanceTests', 'AuthorChildrenTests', 'AnonymousContainerRemovalTests'];
const testFiles = ['CoreLayoutInteropTests.swift', 'MasonTests.swift', 'MasonTextNodeTests.swift', 'InputAppearanceTests.swift', 'AuthorChildrenTests.swift', 'AnonymousContainerRemovalTests.swift'];
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
function write(name, text) {
  const filename = resolve(stage, name);
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, text);
}
rmSync(resolve(stage, 'Mason'), { recursive: true, force: true });
rmSync(resolve(stage, 'MasonTests'), { recursive: true, force: true });
cpSync(iosSourceRoot, resolve(stage, 'Mason'), { recursive: true });
copyRelocatedNativeSources('ios', resolve(stage, 'Mason'));
// The Xcode header phase resolves this include folder from SRCROOT.
cpSync(resolve(iosSourceRoot, 'include'), resolve(stage, 'include'), { recursive: true });
const sources = nativeFiles('ios').map((name) => ({ name, sha256: hash(nativeSource('ios', name)) }));
for (const { name, sha256 } of sources) assert.equal(hash(resolve(stage, 'Mason', name)), sha256);
const tests = [];
for (const name of testFiles) {
  const filename = resolve(original, 'MasonTests', name);
  const source = new SwiftSource(filename);
  write(`MasonTests/${name}`, source.text);
  for (const test of selected) {
    const classes = source.declarations(test).filter(({ kind }) => kind === 'class_decl');
    for (const node of classes) {
      const body = source.lines.slice(node.first, node.last + 1).join('\n');
      assert.doesNotMatch(body, /XCTAttachment|screenshot|drawHierarchy|UIGraphics|captureScreen/);
      const methods = source.nodes.filter((method) => method.kind === 'func_decl' && method.first > node.first && method.last < node.last && method.name?.startsWith('test'));
      tests.push({ name: test, file: name, sourceSha256: hash(filename), count: methods.length });
    }
  }
}
assert.deepEqual(tests.map(({ name }) => name).sort(), [...selected].sort());
assert.ok(tests.every(({ count }) => count > 0));
const keep = new Set([...sources.filter(({ name }) => name.endsWith('.swift')).map(({ name }) => basename(name)), ...testFiles]);
const project = resolve(original, 'Mason.xcodeproj');
let pbx = restoreStagedIosReferences(readFileSync(resolve(project, 'project.pbxproj'), 'utf8'));
pbx = pbx.split('\n').filter((line) => {
  const source = line.match(/^\s+[A-F0-9]+ \/\* (\S+) in Sources \*\/,\s*$/);
  return !source || keep.has(source[1]);
}).join('\n');
// Two existing test files are absent from the original Xcode target. Wire
// selected missing files into this temporary project rather than reducing the
// expected count or editing the preserved upstream project.
const addedTestFiles = [];
for (const name of testFiles) {
  const phase = pbx.match(/[A-F0-9]+ \/\* Sources \*\/ = \{[\s\S]*?files = \([\s\S]*?\);[\s\S]*?\n\s*\};/g)
    ?.find((text) => text.includes('CoreLayoutInteropTests.swift in Sources'));
  assert.ok(phase, 'Missing the preserved native test source phase.');
  if (phase.includes(`${name} in Sources`)) continue;
  const id = (kind) => createHash('sha256').update(`mason-full-baseline:${kind}:${name}`).digest('hex').slice(0, 24).toUpperCase();
  const file = id('file');
  const build = id('build');
  assert.ok(!pbx.includes(file) && !pbx.includes(build));
  pbx = pbx.replace('/* Begin PBXBuildFile section */', `/* Begin PBXBuildFile section */\n\t\t${build} /* ${name} in Sources */ = {isa = PBXBuildFile; fileRef = ${file}; };`);
  pbx = pbx.replace('/* Begin PBXFileReference section */', `/* Begin PBXFileReference section */\n\t\t${file} /* ${name} */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; name = ${name}; path = "MasonTests/${name}"; sourceTree = SOURCE_ROOT; };`);
  pbx = pbx.replace(phase, phase.replace('files = (', `files = (\n\t\t\t\t${build} /* ${name} in Sources */,`));
  addedTestFiles.push(name);
}
pbx = pbx.replace(/\s*"OTHER_LDFLAGS\[[^\n]+\]" = \([\s\S]*?\);/g, '');
pbx = pbx.replaceAll('MODULEMAP_FILE = "";', `MODULEMAP_FILE = "";\n                OTHER_LDFLAGS = ("$(inherited)", "${engine}", "-ObjC", "-liconv", "-lresolv");`);
write('Mason.xcodeproj/project.pbxproj', pbx);
for (const name of ['xcshareddata/xcschemes/Mason.xcscheme', 'project.xcworkspace/contents.xcworkspacedata', 'project.xcworkspace/xcshareddata/swiftpm/Package.resolved']) write(`Mason.xcodeproj/${name}`, readFileSync(resolve(project, name), 'utf8'));
write('pre-build.sh', '#!/bin/sh\nset -eu\n# The qualified unchanged C engine archive is provided by the baseline builder.\n');
chmodSync(resolve(stage, 'pre-build.sh'), 0o755);
run('xcodebuild', ['-project', resolve(stage, 'Mason.xcodeproj'), '-scheme', 'Mason', '-configuration', 'Debug',
  '-sdk', 'iphonesimulator', '-destination', 'generic/platform=iOS Simulator', '-derivedDataPath', derived,
  '-clonedSourcePackagesDirPath', resolve(workspaceRoot, 'tmp/mason-core-ios-packages'),
  '-disableAutomaticPackageResolution', '-onlyUsePackageVersionsFromResolvedFile',
  'ARCHS=arm64', 'ONLY_ACTIVE_ARCH=YES', 'CODE_SIGNING_ALLOWED=NO', 'build-for-testing']);
writeFileSync(resolve(stage, 'manifest.json'), JSON.stringify({
  platform: 'iOS Simulator', architecture: 'arm64', sources, tests, addedTestFiles,
  testCount: tests.reduce((count, test) => count + test.count, 0), engineSha256: hash(engine),
  qualification: 'Byte-identical full Swift sources and selected test files; isolated build wiring substitutes the qualified unchanged C engine archive. Execution is still required.',
}, null, 2) + '\n');
console.log(`Built full iOS source baseline with ${tests.reduce((count, test) => count + test.count, 0)} selected native tests; execution is still required.`);
