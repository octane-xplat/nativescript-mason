import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';

const configuration = process.argv[2] ?? 'release';
assert.ok(['debug', 'release'].includes(configuration));
const input = resolve(workspaceRoot, 'dist/native/mason-core/ios-host', configuration);
const temporary = mkdtempSync(resolve(tmpdir(), 'mason-core-ios-client-'));

function run(command, args, env = {}) {
  const result = spawnSync(command, args, { cwd: temporary, encoding: 'utf8', env: { ...process.env, ...env } });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

try {
  const artifact = resolve(temporary, 'artifact');
  cpSync(input, artifact, { recursive: true });
  const manifest = JSON.parse(readFileSync(resolve(artifact, 'manifest.json'), 'utf8'));
  const binary = resolve(artifact, 'MasonCore.framework/MasonCore');
  assert.equal(createHash('sha256').update(readFileSync(binary)).digest('hex'), manifest.nativeFrameworkSha256);
  const symbols = run('xcrun', ['nm', '-gU', binary]);
  const header = readFileSync(resolve(artifact, 'MasonCore.framework/Headers/MasonCore-Swift.h'), 'utf8');
  const declarations = header.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
  for (const name of ['HTMLParser', 'TextEngine', 'MasonText', 'MasonTextNode', 'MasonDocument', 'MasonInput', 'MasonTextArea', 'MasonLi', 'MasonList', 'MasonBr', 'MasonDetails', 'Button', 'Img']) {
    assert.ok(!new RegExp(`_OBJC_CLASS_\\$_${name}(?:\\s|$)`).test(symbols), `Optional class linked into core: ${name}`);
    assert.ok(!new RegExp(`\\b${name}\\b`).test(declarations), `Optional type exposed by core: ${name}`);
  }
  for (const name of ['NSCMason', 'MasonUIView', 'MasonNode', 'MasonStyle']) assert.ok(symbols.includes(`_OBJC_CLASS_$_${name}`));
  assert.doesNotMatch(run('otool', ['-L', binary]), /(?:^|\/)Mason\.framework\//m);
  assert.match(run('xcrun', ['vtool', '-show-build', binary]), /IOSSIMULATOR/);
  const sdk = run('xcrun', ['--sdk', 'iphonesimulator', '--show-sdk-path']).trim();
  const cHeader = run('xcrun', ['clang', '-isysroot', sdk, '-target', 'arm64-apple-ios15.6-simulator', '-E', '-P', '-x', 'c', resolve(artifact, 'MasonCore.framework/Headers/mason_native.h')]);
  const functions = [...cHeader.matchAll(/\b(mason_\w+)\s*\([^;{}]*\)\s*;/g)].map((match) => match[1]);
  assert.equal(new Set(functions).size, 99);
  for (const name of functions) assert.ok(new RegExp(`\\b_${name}\\b`).test(symbols), `Missing exported C function: ${name}`);
  for (const name of ['MasonCoreVersionNumber', 'MasonCoreVersionString']) {
    assert.ok(header.includes(name) || readFileSync(resolve(artifact, 'MasonCore.framework/Headers/Mason.h'), 'utf8').includes(name));
    assert.ok(symbols.includes(`_${name}`));
  }
  const shared = ['-sdk', sdk, '-target', 'arm64-apple-ios15.6-simulator', '-F', artifact, '-I', resolve(artifact, 'include')];
  writeFileSync(resolve(temporary, 'consumer.swift'), `import UIKit
import MasonCore
let engine = NSCMason()
let view = engine.createView()
view.display = .Flex
view.addView(UILabel())
view.computeWithSize(300, 100)
`);
  run('xcrun', ['swiftc', ...shared, '-module-cache-path', resolve(temporary, 'swift-cache'),
    resolve(temporary, 'consumer.swift'), '-framework', 'MasonCore', '-o', resolve(temporary, 'consumer')], { SDKROOT: sdk });
  writeFileSync(resolve(temporary, 'consumer.m'), `@import UIKit;
@import MasonCore;
@import MasonCore.Swift;
void checkCore(void) {
  NSCMason *engine = [NSCMason new];
  MasonUIView *view = [engine createView];
  [view addView:[UILabel new]];
}
int main(void) { checkCore(); return MasonCoreVersionNumber >= 0 ? 0 : 1; }
`);
  run('xcrun', ['clang', '-isysroot', sdk, '-target', 'arm64-apple-ios15.6-simulator', '-F', artifact, '-I', resolve(artifact, 'include'),
    '-fmodules', `-fmodules-cache-path=${resolve(temporary, 'clang-cache')}`, '-fobjc-arc', '-Werror', resolve(temporary, 'consumer.m'), '-framework', 'MasonCore', '-o', resolve(temporary, 'objc-consumer')]);
  console.log('Isolated Swift and Objective-C clients link against core plus its retained dependency headers; all 99 C declarations are exported.');
  console.log('Core native symbols and public headers exclude HTML, rich-text rendering and widget classes.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
