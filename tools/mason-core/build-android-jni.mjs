import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';
import { androidTools, nativeRoot, run } from './build-native.mjs';

const tools = androidTools();
const toolchain = process.env.MASON_RUST_TOOLCHAIN ?? 'stable';
const target = 'aarch64-linux-android';
const compiler = run('rustup', ['which', '--toolchain', toolchain, 'rustc'], { stdio: 'pipe' }).trim();
const targetRoot = resolve(workspaceRoot, 'target/mason-core-jni-prototype');
const env = {
  ...process.env, RUSTC: compiler,
  CARGO_TARGET_AARCH64_LINUX_ANDROID_LINKER: tools.clang,
  CC_aarch64_linux_android: tools.clang,
  AR_aarch64_linux_android: resolve(tools.bin, 'llvm-ar'),
  RUSTFLAGS: '-C link-arg=-Wl,--hash-style=sysv -C link-arg=-Wl,-z,max-page-size=16384',
};
run('rustup', ['run', toolchain, 'cargo', 'build', '-p', 'mason-android', '--lib', '--release', '--locked',
  '--target', target, '--target-dir', targetRoot], { env });
const output = resolve(nativeRoot, 'android-jni');
mkdirSync(resolve(output, 'arm64-v8a'), { recursive: true });
const library = resolve(output, 'arm64-v8a/libmasonnative.so');
copyFileSync(resolve(targetRoot, target, 'release/libmasonnative.so'), library);
const symbols = run(tools.nm, ['-D', '--defined-only', library], { stdio: 'pipe' });
assert.match(symbols, /\bJNI_OnLoad$/m);
assert.match(symbols, /Java_org_nativescript_mason_masonkit_Mason_nativeSetPreflight/);
const headers = run(resolve(tools.bin, 'llvm-readelf'), ['-h', library], { stdio: 'pipe' });
assert.match(headers, /Machine:\s+AArch64/);
const segments = run(resolve(tools.bin, 'llvm-readelf'), ['-l', '--wide', library], { stdio: 'pipe' });
const loads = segments.split('\n').filter((line) => /^\s*LOAD\s/.test(line));
assert.ok(loads.length > 0);
for (const line of loads) assert.ok(Number.parseInt(line.trim().split(/\s+/).at(-1), 16) >= 16384, `JNI LOAD segment is not aligned for 16KB pages: ${line}`);
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
copyFileSync(resolve(workspaceRoot, 'Cargo.lock'), resolve(output, 'Cargo.lock'));
copyFileSync(resolve(workspaceRoot, 'LICENSE'), resolve(output, 'LICENSE'));
writeFileSync(resolve(output, 'dependencies.txt'), run('rustup', ['run', toolchain, 'cargo', 'tree', '-p', 'mason-android', '--locked', '--target', target, '--edges', 'normal'], { stdio: 'pipe', env }));
writeFileSync(resolve(output, 'manifest.json'), JSON.stringify({
  crate: 'mason-android', target, abi: 'arm64-v8a', toolchain,
  revision: run('git', ['rev-parse', 'HEAD'], { stdio: 'pipe' }).trim(),
  rustc: run('rustup', ['run', toolchain, 'rustc', '-vV'], { stdio: 'pipe' }).trim(),
  ndk: readFileSync(resolve(tools.ndk, 'source.properties'), 'utf8'),
  cargoLockSha256: hash(resolve(output, 'Cargo.lock')), librarySha256: hash(library),
  qualification: 'Unchanged JNI binding and shared Rust engine; core Kotlin hosts and Android runtime qualification are separate.',
}, null, 2) + '\n');
console.log('Built independent arm64-v8a JNI binding with 16KB-aligned load segments; Android execution is still required.');
