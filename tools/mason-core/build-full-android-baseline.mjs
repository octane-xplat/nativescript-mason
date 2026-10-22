import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';
import { androidProjectRoot } from './android-sources.mjs';
import { run } from './build-native.mjs';

const stage = resolve(workspaceRoot, 'tmp/mason-full-android-baseline');
const output = resolve(workspaceRoot, 'dist/native/mason-core/full-android-baseline');
const moduleRoot = resolve(androidProjectRoot, 'masonkit');
const tests = [
  'InputInstrumentedTest', 'ListInstrumentedTest', 'TextContentAttributesInstrumentedTest',
  'MasonTextNodeTests', 'InlineLayoutInstrumentedTest', 'TextTypeDefaultsInstrumentedTest',
  'ViewportStyleInstrumentedTest',
];
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
function write(name, text) {
  const filename = resolve(stage, name);
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, text);
}
function files(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    assert.ok(!entry.isSymbolicLink(), `Unexpected source link: ${entry.name}`);
    const name = prefix + entry.name;
    return entry.isDirectory() ? files(resolve(directory, entry.name), `${name}/`) : [name];
  }).sort();
}
// Preserve the entire full library's source/resources. Only the isolated build
// wiring substitutes our already-verified JNI artifact for Gradle's Rust task.
rmSync(resolve(stage, 'masonkit/src'), { recursive: true, force: true });
cpSync(resolve(moduleRoot, 'src/main'), resolve(stage, 'masonkit/src/main'), { recursive: true });
const sourceInventory = files(resolve(moduleRoot, 'src/main')).map((name) => ({ name, sha256: hash(resolve(moduleRoot, 'src/main', name)) }));
for (const { name, sha256 } of sourceInventory) assert.equal(hash(resolve(stage, 'masonkit/src/main', name)), sha256);
const testRoot = 'src/androidTest/java/org/nativescript/mason/masonkit';
const testInventory = tests.map((name) => {
  const filename = resolve(moduleRoot, testRoot, `${name}.kt`);
  const source = readFileSync(filename, 'utf8');
  assert.doesNotMatch(source, /@Ignore|takeScreenshot|captureScreen|PixelCopy/);
  write(`masonkit/${testRoot}/${name}.kt`, source);
  return { name, sha256: hash(filename), count: [...source.matchAll(/@Test\b/g)].length };
});
let gradle = readFileSync(resolve(moduleRoot, 'build.gradle'), 'utf8');
const start = gradle.indexOf("apply plugin: 'org.mozilla.rust-android-gradle.rust-android'");
const end = gradle.indexOf('\ndependencies {', start);
assert.ok(start > 0 && end > start);
gradle = gradle.slice(0, start) + gradle.slice(end);
assert.ok(gradle.includes("api 'org.nativescript:fontmanager:[1.0.8,2.0)'"));
gradle = gradle.replace("api 'org.nativescript:fontmanager:[1.0.8,2.0)'", "api 'org.nativescript:fontmanager:1.0.20'");
write('masonkit/build.gradle', gradle);
write('build.gradle', `plugins {
  id 'com.android.library' version '8.11.1' apply false
  id 'org.jetbrains.kotlin.android' version '1.9.20' apply false
}
`);
write('settings.gradle', `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = 'MasonFullBaseline'
include ':masonkit'
`);
for (const name of ['consumer-rules.pro', 'proguard-rules.pro']) copyFileSync(resolve(moduleRoot, name), resolve(stage, 'masonkit', name));
copyFileSync(resolve(androidProjectRoot, 'gradle.properties'), resolve(stage, 'gradle.properties'));
cpSync(resolve(androidProjectRoot, 'gradle'), resolve(stage, 'gradle'), { recursive: true });
copyFileSync(resolve(androidProjectRoot, 'gradlew'), resolve(stage, 'gradlew'));
const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
write('local.properties', `sdk.dir=${sdk.replaceAll('\\', '\\\\')}\n`);
const jni = resolve(workspaceRoot, 'dist/native/mason-core/android-jni/arm64-v8a/libmasonnative.so');
mkdirSync(resolve(stage, 'masonkit/src/main/jniLibs/arm64-v8a'), { recursive: true });
copyFileSync(jni, resolve(stage, 'masonkit/src/main/jniLibs/arm64-v8a/libmasonnative.so'));
const javaHome = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21'], { stdio: 'pipe' }).trim();
run('bash', ['gradlew', '--no-daemon', '--max-workers=2', ':masonkit:assembleRelease', ':masonkit:assembleReleaseAndroidTest'], {
  cwd: stage, env: { ...process.env, JAVA_HOME: javaHome },
});
mkdirSync(output, { recursive: true });
copyFileSync(resolve(stage, 'masonkit/build/outputs/aar/masonkit-release.aar'), resolve(output, 'MasonFull.aar'));
copyFileSync(resolve(stage, 'masonkit/build/outputs/apk/androidTest/release/masonkit-release-androidTest.apk'), resolve(output, 'MasonFull-tests.apk'));
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({
  platform: 'Android', abi: 'arm64-v8a', sourceInventory, tests: testInventory,
  testCount: testInventory.reduce((total, { count }) => total + count, 0),
  jniSha256: hash(jni), aarSha256: hash(resolve(output, 'MasonFull.aar')),
  testApkSha256: hash(resolve(output, 'MasonFull-tests.apk')),
  buildAdaptations: ['Use the same prebuilt unchanged JNI binding as core', 'Pin FontManager to the same 1.0.20 dependency as core', 'Compile selected unchanged instrumentation tests'],
  qualification: 'Full-source native build baseline; instrumentation execution is still required. Not a release app-size measurement.',
}, null, 2) + '\n');
console.log('Built the full Android source baseline and selected unchanged HTML/text/widget tests; execution is still required.');
