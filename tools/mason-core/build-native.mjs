import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { homedir, tmpdir } from 'node:os';
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

// Rust `target_vendor = "apple"` exports. crates/mason-c/cbindgen.toml maps
// that cfg to `__APPLE__`, so the generated header declares them only on
// Apple targets. Guard here so a stale regenerated header fails loudly.
export const appleOnlySymbols = ['mason_get_buffer', 'mason_node_get_pseudo_style_buffer_apple',
  'mason_node_prepare_pseudo_style_buffer_apple', 'mason_node_set_apple_node', 'mason_style_get_style_buffer_apple'];

export function prepareHeaders(destination) {
  mkdirSync(destination, { recursive: true });
  // This checked-in generated C header is shared build input only. No Swift,
  // Kotlin, widget, font-loader, or HTML-parser implementation is copied.
  let header = readFileSync(sharedHeader, 'utf8');
  for (const name of appleOnlySymbols) {
    const guarded = new RegExp(`#if defined\\(__APPLE__\\)\\n[^\\n;{}]*\\b${name}\\(`);
    assert.match(header, guarded, `Generated header lost the __APPLE__ guard for ${name}; regenerate it with the checked-in crates/mason-c/cbindgen.toml.`);
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
  const produced = target.endsWith('-msvc') ? 'mason_c.lib' : 'libmason_c.a';
  copyFileSync(resolve(cargoTargetRoot, target, `release/${produced}`), destination);
}

export function androidTools() {
  let ndk = process.env.ANDROID_NDK_HOME;
  if (!ndk) {
    const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
    const root = resolve(sdk, 'ndk');
    const versions = readdirSync(root).filter((name) => /^\d+\.\d+\.\d+$/.test(name)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    assert.ok(versions.length, 'Install an Android NDK or set ANDROID_NDK_HOME.');
    ndk = resolve(root, versions.at(-1));
  }
  const bin = resolve(ndk, 'toolchains/llvm/prebuilt/darwin-x86_64/bin');
  return { ndk, bin, clang: resolve(bin, 'aarch64-linux-android21-clang'), nm: resolve(bin, 'llvm-nm') };
}

export function declaredFunctions(headerText) {
  return new Set([...headerText.matchAll(/\b(mason_\w+)\s*\(/g)].map((match) => match[1]));
}

function exportedSymbols(target, archive) {
  if (target.endsWith('-android')) {
    const tools = androidTools();
    return run(tools.nm, ['--defined-only', '--extern-only', archive], { stdio: 'pipe' });
  }
  // Rust std archives can also contain newer LLVM IR. Inspect native exports;
  // consumer link checks separately prove the archives are usable.
  return run('xcrun', ['nm', '--no-llvm-bc', '-gU', archive], { stdio: 'pipe' });
}

function checkDeclaredSymbols(target, declared, symbols) {
  assert.ok(declared.size > 50, 'Expected the existing Mason C surface.');
  for (const name of declared) {
    assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `Header declares missing ${target} symbol: ${name}`);
  }
  console.log(`Verified ${declared.size} C declarations against ${target} archive symbols.`);
}

function verifyHeader(target, archive, include) {
  let preprocessed;
  const header = resolve(include, 'mason_native.h');
  if (target.endsWith('-android')) {
    const tools = androidTools();
    preprocessed = run(tools.clang, ['-E', '-P', '-x', 'c', header], { stdio: 'pipe' });
  } else {
    const sdk = target.endsWith('-darwin') ? 'macosx' : target.endsWith('-sim') ? 'iphonesimulator' : 'iphoneos';
    const triple = sdk === 'macosx' ? [] : ['-target', sdk === 'iphoneos' ? 'arm64-apple-ios13.0' : 'arm64-apple-ios13.0-simulator'];
    preprocessed = run('xcrun', ['--sdk', sdk, 'clang', ...triple, '-isysroot', run('xcrun', ['--sdk', sdk, '--show-sdk-path'], { stdio: 'pipe' }).trim(), '-E', '-P', '-x', 'c', header], { stdio: 'pipe' });
  }
  checkDeclaredSymbols(target, declaredFunctions(preprocessed), exportedSymbols(target, archive));
}

const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');

// Desktop engine contract: a pinned mason-c archive plus a generated C header
// flattened to each target's preprocessor state — the artifact desktop host
// adapters consume instead of compiling the crate from a checkout.
export const desktopTargets = [
  { triple: 'aarch64-apple-darwin', archive: 'libMasonCore.a' },
  { triple: 'x86_64-unknown-linux-gnu', archive: 'libMasonCore.a' },
  { triple: 'x86_64-pc-windows-msvc', archive: 'MasonCore.lib' },
];

function flattenHeader(triple, master, include, tempDir) {
  mkdirSync(include, { recursive: true });
  // Flatten only the cbindgen body: the include guard and system includes are
  // re-emitted untouched so the per-target header stays freestanding instead
  // of embedding this build host's SDK declarations. Apple triples get the
  // real target toolchain (it predefines __APPLE__); other desktop triples
  // have no toolchain on this build host, so evaluate the identical
  // preprocessor state with the host compiler. The generated header only
  // branches on __APPLE__ and TARGET_OS_ANDROID.
  const source = readFileSync(master, 'utf8');
  const guard = /^#ifndef (\w+)\n#define \1\n/m.exec(source);
  assert.ok(guard, 'Expected the generated header include guard.');
  const includes = source.match(/^#include [^\n]*$/gm);
  assert.ok(includes?.length, 'Expected the generated header system includes.');
  const body = source
    .slice(source.indexOf(guard[0]) + guard[0].length)
    .replace(/#endif\b[^\n]*\s*$/, '')
    .replace(/^#include [^\n]*\n/gm, '');
  const bodyPath = resolve(tempDir, `${triple}.h`);
  writeFileSync(bodyPath, body);
  const args = triple.endsWith('-apple-darwin')
    ? ['--sdk', 'macosx', 'clang', '-E', '-P', '-x', 'c', bodyPath]
    : ['clang', '-E', '-P', '-x', 'c', '-U__APPLE__', '-U__ANDROID__', bodyPath];
  const flattened = run('xcrun', args, { stdio: 'pipe' });
  const header = `${guard[0]}\n/* Generated for ${triple} from the checked-in cbindgen header; do not edit. */\n\n${includes.join('\n')}\n\n${flattened}\n#endif\n`;
  writeFileSync(resolve(include, 'mason_native.h'), header);
  if (triple.endsWith('-apple-darwin')) {
    writeFileSync(resolve(include, 'module.modulemap'), 'module MasonCore {\n  header "mason_native.h"\n  export *\n}\n');
  }
  return header;
}

function buildDesktop(destination) {
  rmSync(destination, { recursive: true, force: true });
  prepareHeaders(resolve(destination, 'include'));
  const master = resolve(destination, 'include/mason_native.h');
  const tempDir = mkdtempSync(resolve(tmpdir(), 'mason-core-desktop-headers-'));
  const artifacts = [];
  try {
    for (const spec of desktopTargets) {
      const targetDir = resolve(destination, spec.triple);
      const archive = resolve(targetDir, spec.archive);
      buildArchive(spec.triple, archive);
      const flattened = flattenHeader(spec.triple, master, resolve(targetDir, 'include'), tempDir);
      const declared = declaredFunctions(flattened);
      const symbols = exportedSymbols(spec.triple, archive);
      checkDeclaredSymbols(spec.triple, declared, symbols);
      const apple = spec.triple.endsWith('-apple-darwin');
      for (const name of appleOnlySymbols) {
        if (apple) {
          assert.ok(declared.has(name), `Expected ${spec.triple} header to declare ${name}.`);
          assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `Expected ${spec.triple} archive to export ${name}.`);
        } else {
          assert.ok(!declared.has(name), `${spec.triple} header must not declare Apple-only ${name}.`);
          assert.doesNotMatch(symbols, new RegExp(`\\b_?${name}$`, 'm'), `${spec.triple} archive must not export Apple-only ${name}.`);
        }
      }
      writeFileSync(resolve(targetDir, 'dependencies.txt'), cargo(['tree', '-p', 'mason-c', '--locked', '--target', spec.triple, '--edges', 'normal', '--prefix', 'none'], { stdio: 'pipe' }));
      artifacts.push({
        target: spec.triple, path: `${spec.triple}/${spec.archive}`, sha256: hash(archive),
        header: `${spec.triple}/include/mason_native.h`, headerSha256: hash(resolve(targetDir, 'include/mason_native.h')),
        declaredSymbols: declared.size,
      });
    }
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
  copyFileSync(resolve(workspaceRoot, 'Cargo.lock'), resolve(destination, 'Cargo.lock'));
  const revision = run('git', ['rev-parse', 'HEAD'], { stdio: 'pipe' }).trim();
  writeFileSync(resolve(destination, 'manifest.json'), JSON.stringify({
    mode: 'desktop', targets: desktopTargets.map((spec) => spec.triple), revision, crate: 'mason-c', toolchain,
    rustc: run('rustup', ['run', toolchain, 'rustc', '-vV'], { stdio: 'pipe' }).trim(),
    headerSource: 'packages/nativescript-masonkit/src-native/mason-ios/Mason/Mason/include/mason_native.h',
    headerSourceSha256: hash(sharedHeader), headerSha256: hash(resolve(destination, 'include/mason_native.h')), cargoLockSha256: hash(resolve(workspaceRoot, 'Cargo.lock')),
    artifacts,
    qualification: 'engine archive plus per-target generated C header; no host adapter, view host, or UI runtime; the target matching the build host additionally links and runs the consumer fixture',
  }, null, 2) + '\n');
  console.log(`Built independent desktop engine artifacts in ${destination}`);
  return destination;
}

export function buildNative(mode) {
  if (process.platform !== 'darwin') throw new Error('Native prototype commands currently require an Apple build host.');
  if (!['host', 'ios', 'android', 'desktop'].includes(mode)) throw new Error('Expected native build mode: host, ios, android, or desktop.');
  if (!existsSync(resolve(workspaceRoot, 'Cargo.lock'))) {
    throw new Error('Resolve the workspace Cargo.lock first with rustup run stable cargo generate-lockfile; native builds use --locked.');
  }
  const destination = resolve(nativeRoot, mode);
  if (mode === 'desktop') return buildDesktop(destination);
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
