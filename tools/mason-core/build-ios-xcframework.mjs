import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const root = resolve(workspaceRoot, 'dist/native/mason-core/ios-host');
const output = resolve(root, 'universal');
const temporary = mkdtempSync(resolve(tmpdir(), 'mason-core-xcframework-'));
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
const json = (filename) => JSON.parse(readFileSync(filename, 'utf8'));
function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command}: ${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
function files(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    assert.ok(!entry.isSymbolicLink(), `Unexpected external link: ${entry.name}`);
    const name = prefix + entry.name;
    return entry.isDirectory() ? files(resolve(directory, entry.name), `${name}/`) : [name];
  }).sort();
}
try {
  const slices = [
    { name: 'device', input: resolve(root, 'device/release'), platform: 'iOS', identifier: 'ios-arm64' },
    { name: 'simulator', input: resolve(root, 'release'), platform: 'iOS Simulator', identifier: 'ios-arm64-simulator' },
  ];
  const args = ['-create-xcframework'];
  for (const slice of slices) {
    slice.manifest = json(resolve(slice.input, 'manifest.json'));
    assert.equal(slice.manifest.platform, slice.platform);
    assert.equal(slice.manifest.architecture, 'arm64');
    assert.equal(slice.manifest.configuration, 'Release');
    assert.equal(slice.manifest.linkage, 'static');
    assert.deepEqual(slice.manifest.sharedNativeDependencies, ['FontManager']);
    assert.equal(hash(resolve(slice.input, 'MasonCore.framework/MasonCore')), slice.manifest.nativeFrameworkSha256);
    assert.deepEqual(slice.manifest.resourceBundles, ['SDWebImage_SDWebImage.bundle']);
    const framework = resolve(temporary, slice.name, 'MasonCore.framework');
    cpSync(resolve(slice.input, 'MasonCore.framework'), framework, { recursive: true });
    // Each framework carries resources built for its own platform. No
    // simulator-only bundle is copied into a device application's resources.
    cpSync(resolve(slice.input, 'resources/SDWebImage_SDWebImage.bundle'), resolve(framework, 'SDWebImage_SDWebImage.bundle'), { recursive: true });
    const bundle = jsonFromPlist(resolve(framework, 'SDWebImage_SDWebImage.bundle/Info.plist'));
    assert.equal(bundle.CFBundlePackageType, 'BNDL');
    assert.equal(bundle.CFBundleExecutable, undefined);
    assert.deepEqual(bundle.CFBundleSupportedPlatforms, [slice.name === 'device' ? 'iPhoneOS' : 'iPhoneSimulator']);
    args.push('-framework', framework);
  }
  const [device, simulator] = slices;
  assert.deepEqual(device.manifest.sources, simulator.manifest.sources, 'Rebuild both slices from the same source projection.');
  assert.equal(device.manifest.dependencyLockSha256, simulator.manifest.dependencyLockSha256);
  for (const directory of ['include', 'MasonCore.framework/Headers']) {
    const names = files(resolve(device.input, directory));
    assert.deepEqual(names, files(resolve(simulator.input, directory)));
    for (const name of names) assert.equal(hash(resolve(device.input, directory, name)), hash(resolve(simulator.input, directory, name)), `Platform public header differs: ${name}`);
  }
  rmSync(output, { recursive: true, force: true });
  mkdirSync(output, { recursive: true });
  const xcframework = resolve(output, 'MasonCore.xcframework');
  run('xcodebuild', [...args, '-output', xcframework]);
  const info = jsonFromPlist(resolve(xcframework, 'Info.plist'));
  assert.equal(info.AvailableLibraries.length, 2);
  for (const slice of slices) {
    const library = info.AvailableLibraries.find(({ LibraryIdentifier }) => LibraryIdentifier === slice.identifier);
    assert.ok(library, `Missing XCFramework slice: ${slice.identifier}`);
    assert.equal(library.SupportedPlatform, 'ios');
    assert.equal(library.SupportedPlatformVariant, slice.name === 'simulator' ? 'simulator' : undefined);
    assert.deepEqual(library.SupportedArchitectures, ['arm64']);
    assert.equal(hash(resolve(xcframework, slice.identifier, 'MasonCore.framework/MasonCore')), slice.manifest.nativeFrameworkSha256);
    copyFileSync(resolve(slice.input, 'manifest.json'), resolve(output, `${slice.name}-manifest.json`));
  }
  cpSync(resolve(simulator.input, 'include'), resolve(output, 'include'), { recursive: true });
  // A static framework is linked into the app, so its resources must also be
  // installed separately. This bundle contains no executable/platform code.
  const resource = resolve(output, 'Resources/SDWebImage_SDWebImage.bundle');
  cpSync(resolve(simulator.input, 'resources/SDWebImage_SDWebImage.bundle'), resource, { recursive: true });
  const resourceInfo = jsonFromPlist(resolve(resource, 'Info.plist'));
  delete resourceInfo.CFBundleSupportedPlatforms;
  writeFileSync(resolve(resource, 'Info.plist'), JSON.stringify(resourceInfo));
  run('plutil', ['-convert', 'xml1', resolve(resource, 'Info.plist')]);
  for (const name of ['LICENSE', 'FontManager.LICENSE', 'SDWebImage.LICENSE', 'Package.resolved']) copyFileSync(resolve(simulator.input, name), resolve(output, name));
  writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({
    architectures: ['arm64'], platforms: ['iOS', 'iOS Simulator'],
    linkage: 'static', sharedNativeDependencies: ['FontManager'],
    slices: slices.map(({ name, identifier, manifest }) => ({ name, identifier, nativeFrameworkSha256: manifest.nativeFrameworkSha256 })),
    files: files(xcframework).map((name) => ({ name, sha256: hash(resolve(xcframework, name)) })),
    qualification: 'Two native framework slices and platform-specific privacy bundles; NativeScript device application packaging and runtime require separate qualification.',
  }, null, 2) + '\n');
  console.log('Assembled and verified arm64 device/simulator XCFramework with matching source/API and platform-specific resource bundles.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
function jsonFromPlist(filename) {
  return JSON.parse(run('plutil', ['-convert', 'json', '-o', '-', filename]));
}
