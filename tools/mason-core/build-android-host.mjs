import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { workspaceRoot } from './sources.mjs';
import { androidProjectRoot, androidSourceRoot, projectAndroidSources, backgroundGlyphProvider } from './android-sources.mjs';
import { run } from './build-native.mjs';

const stage = resolve(workspaceRoot, 'tmp/mason-core-android-host');
const tests = process.argv.includes('--tests');
const output = resolve(workspaceRoot, 'dist/native/mason-core/android-host');
// Clear generated source, keeping Gradle's incremental outputs. Deleted source
// cannot survive this whitelist; the artifact verifier checks the class graph.
for (const directory of ['masoncore/src/main', 'masoncore/src/androidTest']) rmSync(resolve(stage, directory), { recursive: true, force: true });
function write(name, text) {
  const filename = resolve(stage, name);
  mkdirSync(dirname(filename), { recursive: true });
  writeFileSync(filename, text);
}
const sources = projectAndroidSources();
for (const { name, text } of sources) write(`masoncore/src/main/java/org/nativescript/mason/masonkit/${name}`, text);
write('masoncore/src/main/java/org/nativescript/mason/masonkit/MasonBackgroundGlyphProvider.kt', backgroundGlyphProvider);
if (tests) {
  const testRoot = 'masoncore/src/androidTest/java/org/nativescript/mason/masonkit';
  for (const name of ['ReactiveForeignMeasureInstrumentedTest.kt', 'ForeignStyleSyncInstrumentedTest.kt', 'ForeignFlexFrameInstrumentedTest.kt']) {
    write(`${testRoot}/${name}`, readFileSync(resolve(androidProjectRoot, 'masonkit/src/androidTest/java/org/nativescript/mason/masonkit', name), 'utf8'));
  }
  write(`${testRoot}/MasonCoreHostInstrumentedTest.kt`, readFileSync(resolve(workspaceRoot, 'tools/mason-core/android-host-tests.kt'), 'utf8'));
}
for (const name of ['attr.xml', 'ids.xml']) {
  write(`masoncore/src/main/res/values/${name}`, readFileSync(resolve(androidProjectRoot, 'masonkit/src/main/res/values', name), 'utf8'));
}
write('masoncore/src/main/AndroidManifest.xml', '<manifest xmlns:android="http://schemas.android.com/apk/res/android" />\n');
write('settings.gradle', `pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name = 'MasonCorePrototype'
include ':masoncore'
`);
write('build.gradle', `plugins {
  id 'com.android.library' version '8.11.1' apply false
  id 'org.jetbrains.kotlin.android' version '1.9.20' apply false
}
`);
write('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`);
write('masoncore/build.gradle', `plugins { id 'com.android.library'; id 'org.jetbrains.kotlin.android' }
android {
  namespace 'org.nativescript.mason.masonkit'
  compileSdk 36
  defaultConfig {
    minSdk 21
    targetSdk 36
    testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'
    consumerProguardFiles 'consumer-rules.pro'
    ndk { abiFilters 'arm64-v8a' }
  }
  buildTypes { release { minifyEnabled false } }
  compileOptions { sourceCompatibility JavaVersion.VERSION_17; targetCompatibility JavaVersion.VERSION_17 }
  kotlinOptions { jvmTarget = '17' }
}
dependencies {
  implementation 'androidx.core:core-ktx:1.12.0'
  implementation 'com.google.code.gson:gson:2.13.2'
  implementation 'com.github.bumptech.glide:glide:4.16.0'
  api 'org.nativescript:fontmanager:1.0.20'
  androidTestImplementation 'androidx.test.ext:junit:1.2.1'
  androidTestImplementation 'androidx.test:runner:1.6.2'
}
tasks.register('writeCoreDependencies') {
  doLast {
    def artifacts = configurations.releaseCompileClasspath.resolvedConfiguration.resolvedArtifacts.collect {
      [coordinate: it.moduleVersion.id.toString(), file: it.file.absolutePath]
    }.sort { it.coordinate }
    def runtime = configurations.releaseRuntimeClasspath.resolvedConfiguration.resolvedArtifacts.collect {
      it.moduleVersion.id.toString()
    }.unique().sort()
    rootProject.file('dependencies.json').text = groovy.json.JsonOutput.prettyPrint(groovy.json.JsonOutput.toJson([compileArtifacts: artifacts, runtime: runtime]))
  }
}
`);
write('masoncore/consumer-rules.pro', '-keep class org.nativescript.mason.masonkit.** { *; }\n');
const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
write('local.properties', `sdk.dir=${sdk.replaceAll('\\', '\\\\')}\n`);
cpSync(resolve(androidProjectRoot, 'gradle'), resolve(stage, 'gradle'), { recursive: true });
copyFileSync(resolve(androidProjectRoot, 'gradlew'), resolve(stage, 'gradlew'));
mkdirSync(resolve(stage, 'masoncore/src/main/jniLibs/arm64-v8a'), { recursive: true });
copyFileSync(resolve(workspaceRoot, 'dist/native/mason-core/android-jni/arm64-v8a/libmasonnative.so'), resolve(stage, 'masoncore/src/main/jniLibs/arm64-v8a/libmasonnative.so'));
const javaHome = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21'], { stdio: 'pipe' }).trim();
run('bash', ['gradlew', '--no-daemon', '--max-workers=2', tests ? ':masoncore:assembleDebugAndroidTest' : ':masoncore:assembleRelease', ':masoncore:writeCoreDependencies'], { cwd: stage, env: { ...process.env, JAVA_HOME: javaHome } });
mkdirSync(output, { recursive: true });
if (!tests) copyFileSync(resolve(stage, 'masoncore/build/outputs/aar/masoncore-release.aar'), resolve(output, 'MasonCore.aar'));
else {
  mkdirSync(resolve(output, 'tests'), { recursive: true });
  copyFileSync(resolve(stage, 'masoncore/build/outputs/apk/androidTest/debug/masoncore-debug-androidTest.apk'), resolve(output, 'tests/MasonCore-tests.apk'));
}
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(output, 'LICENSE'));
const hash = (value) => createHash('sha256').update(value).digest('hex');
writeFileSync(resolve(output, 'sources.json'), JSON.stringify(sources.map(({ name, originalName = name, text }) => ({
  name, originalName, originalSha256: hash(readFileSync(resolve(androidSourceRoot, originalName))), projectedSha256: hash(text),
})), null, 2) + '\n');
if (!tests) {
  const dependencies = JSON.parse(readFileSync(resolve(stage, 'dependencies.json'), 'utf8'));
  writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({
    platform: 'Android', abi: 'arm64-v8a', minSdk: 21, compileSdk: 36,
    aarSha256: hash(readFileSync(resolve(output, 'MasonCore.aar'))),
    sourcesSha256: hash(readFileSync(resolve(output, 'sources.json'))),
    jni: JSON.parse(readFileSync(resolve(workspaceRoot, 'dist/native/mason-core/android-jni/manifest.json'), 'utf8')),
    retainedDependencies: dependencies.runtime,
    qualification: 'Core-only Android AAR; device execution, NativeScript bridge metadata/types and plugin packaging are still required.',
  }, null, 2) + '\n');
}
console.log('Compiled the core-only Android host; NativeScript packaging and Android execution are still required.');
