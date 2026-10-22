import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { delimiter, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { workspaceRoot, coreSourceRoot } from './sources.mjs';

const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
const sdk = resolve(consumer, 'node_modules/@nativescript/android');
const iosSdk = resolve(consumer, 'node_modules/@nativescript/ios');
const jar = resolve(sdk, 'framework/build-tools/dts-generator.jar');
const generatorCommit = '5fcf611330bd9eb60d9bb45d5b37251980b127ab';
const sourceSha256 = 'e310fb9b7dc122bff9ae2b2ad06dfbc446f3b38099702a6107d1881b06cd9678';
const jarSha256 = '93d6ed1a4a09f2a33c09f41a323f1a36e14cbf18842211565083db71ad84ab44';
const patch = resolve(workspaceRoot, 'tools/mason-core/patches/android-dts-generator.patch');
const stage = resolve(workspaceRoot, 'tmp/mason-core-native-typegen');
const output = resolve(coreSourceRoot, 'typings');
const hash = (filename) => createHash('sha256').update(readFileSync(filename)).digest('hex');
const json = (filename) => JSON.parse(readFileSync(filename, 'utf8'));
function run(command, args, cwd = workspaceRoot) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

assert.equal(json(resolve(sdk, 'package.json')).version, '9.1.1');
assert.equal(json(resolve(iosSdk, 'package.json')).version, '9.1.0');
assert.equal(hash(jar), jarSha256, 'Review the generator adaptation when adopting another SDK build.');
const android = resolve(workspaceRoot, 'dist/native/mason-core/android-host');
const ios = resolve(workspaceRoot, 'dist/native/mason-core/ios-host/release');
const androidManifest = json(resolve(android, 'manifest.json'));
const iosManifest = json(resolve(ios, 'manifest.json'));
assert.equal(hash(resolve(android, 'MasonCore.aar')), androidManifest.aarSha256);
assert.equal(hash(resolve(ios, 'MasonCore.framework/MasonCore')), iosManifest.nativeFrameworkSha256);

mkdirSync(stage, { recursive: true });
const cached = resolve(stage, 'DtsApi.original.java');
const sourceUrl = `https://raw.githubusercontent.com/NativeScript/android-dts-generator/${generatorCommit}/dts-generator/src/main/java/com/telerik/dts/DtsApi.java`;
if (!existsSync(cached)) {
  const response = await fetch(sourceUrl);
  assert.ok(response.ok, `Generator source download failed: ${response.status}`);
  writeFileSync(cached, await response.text());
}
assert.equal(hash(cached), sourceSha256);
const sourceDirectory = resolve(stage, 'source');
mkdirSync(sourceDirectory, { recursive: true });
copyFileSync(cached, resolve(sourceDirectory, 'DtsApi.java'));
const apply = ['apply', '--no-index', `--directory=${relative(workspaceRoot, sourceDirectory)}`];
run('git', [...apply, '--check', patch]);
run('git', [...apply, patch]);
const java = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21']).trim();
const classes = resolve(stage, 'classes');
mkdirSync(classes, { recursive: true });
run(resolve(java, 'bin/javac'), ['-cp', jar, '-d', classes, resolve(sourceDirectory, 'DtsApi.java')]);
const generatedAndroid = resolve(stage, 'android');
run(resolve(java, 'bin/java'), ['-Xmx512m', '-cp', [classes, jar].join(delimiter), 'com.telerik.Main',
  '--input', resolve(android, 'MasonCore.aar'), '--output', generatedAndroid]);

// Read the exported framework directly: type regeneration must not depend on
// assembling/installing a plugin that already has matching declarations.
const generatedIos = resolve(stage, 'ios');
rmSync(generatedIos, { recursive: true, force: true });
mkdirSync(generatedIos, { recursive: true });
const iosGeneratorDirectory = resolve(iosSdk, 'framework/internal/metadata-generator-arm64/bin');
const iosGenerator = resolve(iosGeneratorDirectory, 'objc-metadata-generator');
const appleSdk = run('xcrun', ['--sdk', 'iphonesimulator', '--show-sdk-path']).trim();
const appleSdkVersion = run('xcrun', ['--sdk', 'iphonesimulator', '--show-sdk-version']).trim();
// Keep SDK header discovery enabled: an umbrella containing only Mason imports
// omits inherited UIKit/QuartzCore members from the generated bridge types.
run(iosGenerator, ['-output-typescript', generatedIos, 'Xclang', '-isysroot', appleSdk,
  '-std=gnu17', '-target', `arm64-apple-ios${appleSdkVersion}-simulator`,
  `-F${ios}`, `-I${resolve(ios, 'include')}`], iosGeneratorDirectory);

mkdirSync(output, { recursive: true });
const files = [];
function copyTypes(source, name, requiredClasses = [], excludedClasses = []) {
  const text = readFileSync(source, 'utf8');
  const file = ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true);
  assert.equal(file.parseDiagnostics.length, 0, `Invalid generated declarations: ${name}`);
  const names = new Set();
  function visit(node, scope = []) {
    if (ts.isModuleDeclaration(node)) {
      if (node.body) visit(node.body, [...scope, node.name.text]);
      return;
    }
    if (ts.isClassDeclaration(node) && node.name) names.add([...scope, node.name.text].join('.'));
    ts.forEachChild(node, (child) => visit(child, scope));
  }
  visit(file);
  const prefix = name === 'android.d.ts' ? 'org.nativescript.mason.masonkit.' : '';
  for (const name of requiredClasses) assert.ok(names.has(prefix + name), `Generated bridge omits ${name}.`);
  for (const name of excludedClasses) assert.ok(!names.has(prefix + name), `Optional native class leaked into core: ${name}.`);
  const target = resolve(output, name);
  copyFileSync(source, target);
  files.push({ name, sha256: hash(target) });
}
copyTypes(resolve(generatedAndroid, 'android.d.ts'), 'android.d.ts', ['Mason', 'Node', 'Style', 'View', 'Scroll', 'NodeHelper'],
  ['HTMLParser', 'TextView', 'TextNode', 'Button', 'Input', 'Image', 'ListView', 'TextArea']);
copyTypes(resolve(generatedAndroid, 'android-declarations.d.ts'), 'android-declarations.d.ts');
for (const name of ['MasonCore', 'FontManager', 'SDWebImage']) {
  const filename = `objc!${name}.d.ts`;
  copyTypes(resolve(generatedIos, filename), filename,
    name === 'MasonCore' ? ['NSCMason', 'MasonUIView', 'MasonNode', 'MasonStyle'] : [],
    name === 'MasonCore' ? ['HTMLParser', 'MasonText', 'MasonTextNode', 'MasonDocument', 'MasonInput', 'MasonTextArea'] : []);
}
writeFileSync(resolve(output, 'native.d.ts'), files.map(({ name }) => `/// <reference path="./${name}" />`).join('\n') + '\n');
files.push({ name: 'native.d.ts', sha256: hash(resolve(output, 'native.d.ts')) });
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({
  androidHostSha256: androidManifest.aarSha256,
  iosHostSha256: iosManifest.nativeFrameworkSha256,
  androidGenerator: { sdk: '9.1.1', jarSha256, sourceUrl, sourceSha256, patchSha256: hash(patch) },
  iosGenerator: { sdk: '9.1.0', sha256: hash(iosGenerator), appleSdkVersion, architecture: 'arm64', simulator: true },
  files,
  qualification: 'Generated from independent core artifacts. NativeScript SDK ambient platform types and skipLibCheck remain required; wrapper compilation and consumer verification are separate checks.',
}, null, 2) + '\n');
console.log('Generated independent core Android/iOS bridge declarations with native artifact and tool provenance.');
