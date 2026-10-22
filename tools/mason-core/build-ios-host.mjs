import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';
import { iosSourceRoot, iosHostFiles, projectIosSource, backgroundGlyphProtocol } from './ios-sources.mjs';

const stage = resolve(workspaceRoot, 'tmp/mason-core-ios-host');
const project = resolve(stage, 'Mason.xcodeproj');
const originalProject = resolve(iosSourceRoot, '../Mason.xcodeproj');
const artifactRoot = resolve(workspaceRoot, 'dist/native/mason-core/ios');
const engine = resolve(artifactRoot, 'aarch64-apple-ios-sim/libMasonCore.a');
const tests = process.argv.includes('--tests');
if (!existsSync(engine)) throw new Error('Build nativescript-mason-core:build.native.ios first.');
rmSync(stage, { recursive: true, force: true });
mkdirSync(resolve(stage, 'include'), { recursive: true });

function write(name, text) {
  const filename = resolve(stage, name);
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, text);
}

for (const name of iosHostFiles) {
  let source = projectIosSource(name);
  if (name === 'Background.swift') source += '\n' + backgroundGlyphProtocol;
  write(`Mason/${name}`, source);
}
write('Mason/Mason.h', readFileSync(resolve(iosSourceRoot, 'Mason.h'), 'utf8').replaceAll('MasonVersion', 'MasonCoreVersion'));
copyFileSync(resolve(artifactRoot, 'include/mason_native.h'), resolve(stage, 'include/mason_native.h'));
write('Mason/module.modulemap', 'framework module MasonCore {\n  umbrella header "Mason.h"\n  export *\n  module * { export * }\n}\n');
write('pre-build.sh', '#!/bin/sh\nset -eu\n# Core engine archives and headers are provided by the independent engine build.\n');

let pbx = readFileSync(resolve(originalProject, 'project.pbxproj'), 'utf8');
// Remove optional sources from the generated project only. File references may
// remain for provenance; none participates in a build phase.
const keep = new Set(iosHostFiles);
if (tests) {
  keep.add('CoreLayoutInteropTests.swift');
  const originalTests = readFileSync(resolve(iosSourceRoot, '../MasonTests/CoreLayoutInteropTests.swift'), 'utf8').replace('@testable import Mason', '@testable import MasonCore');
  write('MasonTests/CoreLayoutInteropTests.swift', originalTests + '\n' + readFileSync(resolve(workspaceRoot, 'tools/mason-core/ios-host-tests.swift'), 'utf8'));
}
pbx = pbx.split('\n').filter((line) => {
  const source = line.match(/^\s+[A-F0-9]+ \/\* (\S+) in Sources \*\/,\s*$/);
  return !source || keep.has(source[1]);
}).join('\n');
pbx = pbx.replace(/\s*"OTHER_LDFLAGS\[[^\n]+\]" = \([\s\S]*?\);/g, '');
pbx = pbx.replaceAll('MODULEMAP_FILE = "";', `MODULEMAP_FILE = "${resolve(stage, 'Mason/module.modulemap')}";
                PRODUCT_MODULE_NAME = MasonCore;
                BUILD_LIBRARY_FOR_DISTRIBUTION = YES;
                OTHER_LDFLAGS = ("$(inherited)", "${engine}", "-ObjC", "-liconv", "-lresolv");`);
pbx = pbx.replaceAll('PRODUCT_NAME = "$(TARGET_NAME:c99extidentifier)";', 'PRODUCT_NAME = MasonCore;');
pbx = pbx.replaceAll('PRODUCT_BUNDLE_IDENTIFIER = org.nativescript.mason.Mason;', 'PRODUCT_BUNDLE_IDENTIFIER = org.nativescript.mason.MasonCore;');
pbx = pbx.replaceAll('Mason.framework', 'MasonCore.framework');
write('Mason.xcodeproj/project.pbxproj', pbx);
for (const name of ['xcshareddata/xcschemes/Mason.xcscheme', 'project.xcworkspace/contents.xcworkspacedata', 'project.xcworkspace/xcshareddata/swiftpm/Package.resolved']) {
  const filename = resolve(project, name);
  mkdirSync(dirname(filename), { recursive: true });
  const original = readFileSync(resolve(originalProject, name), 'utf8');
  writeFileSync(filename, original.replaceAll('Mason.framework', 'MasonCore.framework'));
}

// The original shell phase invokes this script as an executable.
const chmod = spawnSync('chmod', ['+x', resolve(stage, 'pre-build.sh')], { stdio: 'inherit' });
if (chmod.error) throw chmod.error;
if (chmod.status !== 0) process.exit(chmod.status ?? 1);
const args = [
  '-project', project, '-scheme', 'Mason', '-configuration', tests ? 'Debug' : 'Release',
  '-sdk', 'iphonesimulator', '-destination', 'generic/platform=iOS Simulator',
  '-derivedDataPath', resolve(workspaceRoot, 'tmp/mason-core-ios-derived'),
  '-clonedSourcePackagesDirPath', resolve(workspaceRoot, 'tmp/mason-core-ios-packages'),
  '-disableAutomaticPackageResolution', '-onlyUsePackageVersionsFromResolvedFile',
  'ARCHS=arm64', 'ONLY_ACTIVE_ARCH=YES', 'CODE_SIGNING_ALLOWED=NO',
  tests ? 'build-for-testing' : 'build',
];
const result = spawnSync('xcodebuild', args, { cwd: workspaceRoot, stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
const configuration = tests ? 'Debug' : 'Release';
const products = resolve(workspaceRoot, 'tmp/mason-core-ios-derived/Build/Products', `${configuration}-iphonesimulator`);
const output = resolve(workspaceRoot, 'dist/native/mason-core/ios-host', configuration.toLowerCase());
rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(resolve(products, 'MasonCore.framework'), resolve(output, 'MasonCore.framework'), { recursive: true });
const include = resolve(output, 'include');
mkdirSync(include, { recursive: true });
const headerFilter = (filename) => statSync(filename).isDirectory() || filename.endsWith('.h');
cpSync(resolve(products, 'include'), resolve(include, 'FontManager'), { recursive: true, dereference: true, filter: headerFilter });
cpSync(resolve(workspaceRoot, 'tmp/mason-core-ios-packages/checkouts/SDWebImage/SDWebImage/include/SDWebImage'), resolve(include, 'SDWebImage'), { recursive: true, dereference: true, filter: headerFilter });
writeFileSync(resolve(include, 'module.modulemap'), `module FontManager { umbrella "FontManager" export * module * { export * } }
module SDWebImage { umbrella "SDWebImage" export * module * { export * } }
`);
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(output, 'LICENSE'));
for (const [checkout, name] of [['font-manager', 'FontManager'], ['SDWebImage', 'SDWebImage']]) {
  copyFileSync(resolve(workspaceRoot, 'tmp/mason-core-ios-packages/checkouts', checkout, 'LICENSE'), resolve(output, `${name}.LICENSE`));
}
copyFileSync(resolve(originalProject, 'project.xcworkspace/xcshareddata/swiftpm/Package.resolved'), resolve(output, 'Package.resolved'));
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
const sources = iosHostFiles.map((name) => ({
  name, originalSha256: hash(resolve(iosSourceRoot, name)), projectedSha256: hash(resolve(stage, 'Mason', name)),
}));
const manifest = {
  platform: 'iOS Simulator', architecture: 'arm64', configuration,
  qualification: 'Core-only native framework; NativeScript metadata, app packaging, device build and OS input are not yet qualified.',
  nativeFrameworkSha256: hash(resolve(output, 'MasonCore.framework/MasonCore')),
  engineSha256: hash(engine), dependencyLockSha256: hash(resolve(output, 'Package.resolved')),
  retainedDependencies: ['FontManager', 'SDWebImage'],
  sources,
};
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(tests ? 'Built the core-only iOS foreign-view test bundle; execution is still required.' : 'Compiled core-only iOS simulator host; NativeScript metadata and runtime qualification are still required.');
