import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { nativeRoot, run } from './build-native.mjs';
import { workspaceRoot } from './sources.mjs';

const framework = resolve(nativeRoot, 'ios/MasonCore.xcframework');
const info = JSON.parse(run('plutil', ['-convert', 'json', '-o', '-', resolve(framework, 'Info.plist')], { stdio: 'pipe' }));
const library = info.AvailableLibraries.find((entry) => entry.SupportedPlatform === 'ios' && entry.SupportedPlatformVariant === 'simulator');
assert.ok(library, 'Expected an iOS simulator slice.');
const slice = resolve(framework, library.LibraryIdentifier);
const consumer = mkdtempSync(resolve(tmpdir(), 'mason-core-ios-link-'));
try {
  copyFileSync(resolve(workspaceRoot, 'packages/nativescript-mason-core/src-native/tests/ios-consumer.swift'), resolve(consumer, 'consumer.swift'));
  const sdk = run('xcrun', ['--sdk', 'iphonesimulator', '--show-sdk-path'], { stdio: 'pipe' }).trim();
  const output = resolve(consumer, 'consumer');
  run('xcrun', ['--sdk', 'iphonesimulator', 'swiftc', '-target', 'arm64-apple-ios13.0-simulator', '-sdk', sdk,
    '-I', resolve(slice, library.HeadersPath), resolve(consumer, 'consumer.swift'), resolve(slice, library.LibraryPath),
    '-framework', 'Foundation', '-framework', 'CoreFoundation', '-lobjc', '-liconv', '-lresolv', '-o', output],
    { env: { ...process.env, SDKROOT: sdk } });
  const linked = run('otool', ['-L', output], { stdio: 'pipe' });
  assert.doesNotMatch(linked, /Mason\.framework|FontManager|SDWebImage/);
  assert.ok(readFileSync(output).length > 0);
  assert.match(run('xcrun', ['vtool', '-show-build', output], { stdio: 'pipe' }), /platform\s+IOSSIMULATOR/);
  console.log('Swift consumer imported and linked the simulator XCFramework without full MasonKit. This is link evidence, not iOS runtime execution.');
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
