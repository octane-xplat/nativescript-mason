import assert from 'node:assert/strict';
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative } from 'node:path';
import { workspaceRoot } from './sources.mjs';

const runtime = resolve(workspaceRoot, 'dist/prototypes/nativescript-mason-core');
const ios = resolve(workspaceRoot, 'dist/native/mason-core/ios-host/universal');
const android = resolve(workspaceRoot, 'dist/native/mason-core/android-host');
const output = resolve(workspaceRoot, 'dist/packages/nativescript-mason-core');
const json = (filename) => JSON.parse(readFileSync(filename, 'utf8'));
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
for (const filename of [resolve(ios, 'simulator-manifest.json'), resolve(ios, 'manifest.json'), resolve(android, 'manifest.json')]) {
  assert.ok(existsSync(filename), 'Build both native hosts and the iOS XCFramework first; see packages/nativescript-mason-core/README.md.');
}
const iosManifest = json(resolve(ios, 'simulator-manifest.json'));
const xcManifest = json(resolve(ios, 'manifest.json'));
assert.deepEqual(xcManifest.platforms, ['iOS', 'iOS Simulator']);
for (const { name, sha256 } of xcManifest.files) assert.equal(hash(resolve(ios, 'MasonCore.xcframework', name)), sha256, `XCFramework changed: ${name}`);
const androidManifest = json(resolve(android, 'manifest.json'));
assert.equal(hash(resolve(ios, 'MasonCore.xcframework/ios-arm64-simulator/MasonCore.framework/MasonCore')), iosManifest.nativeFrameworkSha256);
assert.equal(hash(resolve(android, 'MasonCore.aar')), androidManifest.aarSha256);
assert.deepEqual(iosManifest.resourceBundles, ['SDWebImage_SDWebImage.bundle']);
assert.equal(androidManifest.abi, 'arm64-v8a');
const nativeTypes = json(resolve(runtime, 'typings/manifest.json'));
assert.equal(nativeTypes.iosHostSha256, iosManifest.nativeFrameworkSha256, 'Regenerate iOS core declarations after rebuilding the native host.');
assert.equal(nativeTypes.androidHostSha256, androidManifest.aarSha256, 'Regenerate Android core declarations after rebuilding the native host.');
for (const { name, sha256 } of nativeTypes.files) {
  assert.equal(hash(resolve(runtime, 'typings', name)), sha256, `Generated core declaration changed: ${name}`);
}

rmSync(output, { recursive: true, force: true });
cpSync(runtime, output, { recursive: true });
const iosOutput = resolve(output, 'platforms/ios');
const androidOutput = resolve(output, 'platforms/android');
mkdirSync(iosOutput, { recursive: true });
mkdirSync(androidOutput, { recursive: true });
cpSync(resolve(ios, 'MasonCore.xcframework'), resolve(iosOutput, 'MasonCore.xcframework'), { recursive: true });
cpSync(resolve(ios, 'Resources'), resolve(iosOutput, 'Resources'), { recursive: true });
mkdirSync(resolve(iosOutput, 'include'), { recursive: true });
cpSync(resolve(ios, 'include/SDWebImage'), resolve(iosOutput, 'include/SDWebImage'), { recursive: true });
writeFileSync(resolve(iosOutput, 'include/module.modulemap'), 'module SDWebImage { umbrella "SDWebImage" export * module * { export * } }\n');
// Keep dependency licenses and native build provenance with the package.
for (const name of ['FontManager.LICENSE', 'SDWebImage.LICENSE', 'Package.resolved', 'manifest.json', 'simulator-manifest.json', 'device-manifest.json']) {
  copyFileSync(resolve(ios, name), resolve(iosOutput, name));
}
copyFileSync(resolve(android, 'MasonCore.aar'), resolve(androidOutput, 'MasonCore.aar'));
copyFileSync(resolve(android, 'manifest.json'), resolve(androidOutput, 'manifest.json'));
writeFileSync(resolve(androidOutput, 'include.gradle'), `dependencies {
  implementation 'androidx.core:core-ktx:1.12.0'
  implementation 'com.google.code.gson:gson:2.13.2'
  implementation 'com.github.bumptech.glide:glide:4.16.0'
  implementation 'org.nativescript:fontmanager:1.0.20'
}
`);
writeFileSync(resolve(iosOutput, 'build.xcconfig'), `// Core is static; the FontManager plugin supplies its shared native library.
// SDWebImage remains embedded and exposes its retained headers here.
FRAMEWORK_SEARCH_PATHS = $(inherited) "$(SRCROOT)/../../node_modules/@octane-xplat/nativescript-mason-core/platforms/ios"
HEADER_SEARCH_PATHS = $(inherited) "$(SRCROOT)/../../node_modules/@octane-xplat/nativescript-mason-core/platforms/ios/include"
SWIFT_INCLUDE_PATHS = $(inherited) "$(SRCROOT)/../../node_modules/@octane-xplat/nativescript-mason-core/platforms/ios/include"
OTHER_LDFLAGS = $(inherited) -ObjC -liconv -lresolv
`);
const manifest = json(resolve(runtime, 'package.json'));
const sourceManifest = json(resolve(workspaceRoot, 'packages/nativescript-mason-core/package.json'));
delete manifest.private;
manifest.publishConfig = sourceManifest.publishConfig;
manifest.description = sourceManifest.description;
manifest.nativescript = sourceManifest.nativescript;
manifest.masonCorePrototype = {
  nativeHosts: true,
  ios: { architectures: ['arm64'], simulatorOnly: false, linkage: 'static', sharedNativeDependencies: ['FontManager'] },
  android: { abis: ['arm64-v8a'] },
  nativeTypes: true,
  coinstallationWithFullMasonKit: false,
  qualification: 'Qualified targets and remaining limits are recorded in README; coinstallation with full MasonKit is unsupported.',
};
// Match pnpm pack's manifest serialization so the inventory survives packing.
writeFileSync(resolve(output, 'package.json'), JSON.stringify(manifest, null, 2));
copyFileSync(resolve(workspaceRoot, 'packages/nativescript-mason-core/README.md'), resolve(output, 'README.md'));
// Hash every shipped file, including resource/privacy bundles and dependency headers.
function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = resolve(directory, entry.name);
    return entry.isDirectory() ? files(filename) : [filename];
  });
}
const inventory = files(output).sort().map((filename) => ({ name: relative(output, filename), sha256: hash(filename) }));
writeFileSync(resolve(output, 'artifact-inventory.json'), JSON.stringify(inventory, null, 2) + '\n');
console.log('Built the core-only NativeScript package; target qualification is documented in its README.');
