import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { workspaceRoot } from './sources.mjs';

const toolchain = process.env.MASON_RUST_TOOLCHAIN ?? 'stable';

export const nativeRoot = resolve(workspaceRoot, 'dist/native/mason-core');
export const cargoTargetRoot = resolve(workspaceRoot, 'target/mason-core-prototype');
export const sharedHeader = resolve(workspaceRoot, 'packages/nativescript-masonkit/src-native/mason-ios/Mason/Mason/include/mason_native.h');

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: workspaceRoot, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status ?? result.signal}${result.stderr ? `\n${result.stderr}` : ''}`);
  return result.stdout;
}

export function prepareHeaders(destination) {
  mkdirSync(destination, { recursive: true });
  // This checked-in generated C header is shared build input only. No Swift,
  // Kotlin, widget, font-loader, or HTML-parser implementation is copied.
  let header = readFileSync(sharedHeader, 'utf8');
  // The existing generated header omits guards for target_vendor=apple. Keep
  // source untouched; make those declarations honest in this staged artifact.
  const appleOnly = ['mason_get_buffer', 'mason_node_get_pseudo_style_buffer_apple',
    'mason_node_prepare_pseudo_style_buffer_apple', 'mason_node_set_apple_node', 'mason_style_get_style_buffer_apple'];
  for (const name of appleOnly) {
    const declaration = new RegExp(`(^[^\\n;{}]*\\b${name}\\([^;]*\\);)`, 'm');
    assert.match(header, declaration, `Missing expected Apple C declaration: ${name}`);
    header = header.replace(declaration, '#if defined(__APPLE__)\n$1\n#endif');
  }
  header = '#if defined(__ANDROID__) && !defined(TARGET_OS_ANDROID)\n#define TARGET_OS_ANDROID 1\n#endif\n' + header;
  writeFileSync(resolve(destination, 'mason_native.h'), header);
  writeFileSync(resolve(destination, 'module.modulemap'), 'module MasonCore {\n  header "mason_native.h"\n  export *\n}\n');
}

function cargo(args, options) {
  const compiler = run('rustup', ['which', '--toolchain', toolchain, 'rustc'], { stdio: 'pipe' }).trim();
  return run('rustup', ['run', toolchain, 'cargo', ...args], { ...options, env: { ...process.env, RUSTC: compiler } });
}

function buildArchive(target, destination) {
  cargo(['rustc', '-p', 'mason-c', '--lib', '--release', '--locked', '--target', target,
    '--target-dir', cargoTargetRoot, '--crate-type', 'staticlib']);
  mkdirSync(dirname(destination), { recursive: true });
  copyFileSync(resolve(cargoTargetRoot, target, 'release/libmason_c.a'), destination);
}

function androidTools() {
  let ndk = process.env.ANDROID_NDK_HOME;
  if (!ndk) {
    const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
    const root = resolve(sdk, 'ndk');
    const versions = readdirSync(root).filter((name) => /^\d+\.\d+\.\d+$/.test(name)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    assert.ok(versions.length, 'Install an Android NDK or set ANDROID_NDK_HOME.');
    ndk = resolve(root, versions.at(-1));
  }
  const bin = resolve(ndk, 'toolchains/llvm/prebuilt/darwin-x86_64/bin');
  return { clang: resolve(bin, 'aarch64-linux-android21-clang'), nm: resolve(bin, 'llvm-nm') };
}

function verifyHeader(target, archive, include) {
  let preprocessed;
  let symbols;
  const header = resolve(include, 'mason_native.h');
  if (target.endsWith('-android')) {
    const tools = androidTools();
    preprocessed = run(tools.clang, ['-E', '-P', '-x', 'c', header], { stdio: 'pipe' });
    symbols = run(tools.nm, ['--defined-only', '--extern-only', archive], { stdio: 'pipe' });
  } else {
    const sdk = target.endsWith('-darwin') ? 'macosx' : target.endsWith('-sim') ? 'iphonesimulator' : 'iphoneos';
    const triple = sdk === 'macosx' ? [] : ['-target', sdk === 'iphoneos' ? 'arm64-apple-ios13.0' : 'arm64-apple-ios13.0-simulator'];
    preprocessed = run('xcrun', ['--sdk', sdk, 'clang', ...triple, '-isysroot', run('xcrun', ['--sdk', sdk, '--show-sdk-path'], { stdio: 'pipe' }).trim(), '-E', '-P', '-x', 'c', header], { stdio: 'pipe' });
    // Rust std archives can also contain newer LLVM IR. Inspect native exports;
    // consumer link checks separately prove the archives are usable.
    symbols = run('xcrun', ['nm', '--no-llvm-bc', '-gU', archive], { stdio: 'pipe' });
  }
  const declared = new Set([...preprocessed.matchAll(/\b(mason_\w+)\s*\(/g)].map((match) => match[1]));
  assert.ok(declared.size > 50, 'Expected the existing Mason C surface.');
  for (const name of declared) {
    assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `Header declares missing ${target} symbol: ${name}`);
  }
  console.log(`Verified ${declared.size} C declarations against ${target} archive symbols.`);
}

export function buildNative(mode) {
  if (process.platform !== 'darwin') throw new Error('Native prototype commands currently require an Apple build host.');
  if (!['host', 'ios', 'android'].includes(mode)) throw new Error('Expected native build mode: host, ios, or android.');
  if (!existsSync(resolve(workspaceRoot, 'Cargo.lock'))) {
    throw new Error('Resolve the workspace Cargo.lock first with rustup run stable cargo generate-lockfile; native builds use --locked.');
  }
  const destination = resolve(nativeRoot, mode);
  rmSync(destination, { recursive: true, force: true });
  prepareHeaders(resolve(destination, 'include'));
  let targets;
  if (mode === 'host') {
    const version = run('rustup', ['run', toolchain, 'rustc', '-vV'], { stdio: 'pipe' });
    const host = /^host: (.+)$/m.exec(version)?.[1];
    if (!host?.endsWith('-apple-darwin')) throw new Error('Expected a macOS Rust host target.');
    targets = [host];
  } else if (mode === 'ios') {
    targets = ['aarch64-apple-ios', 'aarch64-apple-ios-sim'];
  } else {
    // Compilation proof only. Android's C API currently excludes the foreign
    // measure callback; it will need a qualified JNI/measurement boundary.
    targets = ['aarch64-linux-android'];
  }
  for (const target of targets) {
    const archive = resolve(destination, target, 'libMasonCore.a');
    buildArchive(target, archive);
    verifyHeader(target, archive, resolve(destination, 'include'));
    writeFileSync(resolve(destination, target, 'dependencies.txt'), cargo(['tree', '-p', 'mason-c', '--locked', '--target', target, '--edges', 'normal', '--prefix', 'none'], { stdio: 'pipe' }));
  }
  if (mode === 'ios') {
    const args = ['-create-xcframework'];
    for (const target of targets) args.push('-library', resolve(destination, target, 'libMasonCore.a'), '-headers', resolve(destination, 'include'));
    args.push('-output', resolve(destination, 'MasonCore.xcframework'));
    run('xcodebuild', args);
  }
  copyFileSync(resolve(workspaceRoot, 'Cargo.lock'), resolve(destination, 'Cargo.lock'));
  const revision = run('git', ['rev-parse', 'HEAD'], { stdio: 'pipe' }).trim();
  const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
  writeFileSync(resolve(destination, 'manifest.json'), JSON.stringify({
    mode, targets, revision, crate: 'mason-c', toolchain,
    rustc: run('rustup', ['run', toolchain, 'rustc', '-vV'], { stdio: 'pipe' }).trim(),
    headerSource: 'packages/nativescript-masonkit/src-native/mason-ios/Mason/Mason/include/mason_native.h',
    headerSourceSha256: hash(sharedHeader), headerSha256: hash(resolve(destination, 'include/mason_native.h')), cargoLockSha256: hash(resolve(workspaceRoot, 'Cargo.lock')),
    artifacts: targets.map((target) => ({ path: `${target}/libMasonCore.a`, sha256: hash(resolve(destination, target, 'libMasonCore.a')) })),
    qualification: mode === 'android' ? 'cross-compilation only; no Android measurement callback or runtime qualification' : 'engine archive only; no NativeScript view host or scrolling implementation',
  }, null, 2) + '\n');
  console.log(`Built independent ${mode} engine artifacts in ${destination}`);
  return destination;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) buildNative(process.argv[2]);
