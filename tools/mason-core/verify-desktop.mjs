import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { appleOnlySymbols, declaredFunctions, desktopTargets, nativeRoot, run } from './build-native.mjs';
import { workspaceRoot } from './sources.mjs';

// The C surface the downstream desktop facades call (octane-xplat
// packages/*/native/xplatmason). Every entry must be declared by each
// target's generated header and exported by its pinned archive, so the
// facades can drop their hand-declared externs.
const desktopSurface = [
  'mason_init', 'mason_release', 'mason_clear', 'mason_debug_stats', 'mason_set_device_scale',
  'mason_node_new_node', 'mason_node_new_node_with_context', 'mason_node_destroy',
  'mason_node_set_children', 'mason_node_add_child', 'mason_node_remove_child',
  'mason_node_mark_dirty', 'mason_node_compute_wh', 'mason_node_layout', 'mason_node_layout_shallow',
  'mason_node_compute_wh_and_layout', 'mason_node_compute_max_content_and_layout',
  'mason_style_set_with_values', 'mason_style_set_box_size',
];

const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const artifact = resolve(nativeRoot, 'desktop');
const manifest = JSON.parse(readFileSync(resolve(artifact, 'manifest.json'), 'utf8'));
assert.equal(manifest.mode, 'desktop');
assert.equal(manifest.crate, 'mason-c');
assert.deepEqual(manifest.targets, desktopTargets.map((spec) => spec.triple));
assert.equal(manifest.artifacts.length, desktopTargets.length);

const host = /^host: (.+)$/m.exec(run('rustup', ['run', manifest.toolchain ?? 'stable', 'rustc', '-vV'], { stdio: 'pipe' }))?.[1];

for (const entry of manifest.artifacts) {
  const archive = resolve(artifact, entry.path);
  const headerPath = resolve(artifact, entry.header);
  assert.equal(hash(archive), entry.sha256, `Archive hash drifted for ${entry.target}`);
  assert.equal(hash(headerPath), entry.headerSha256, `Header hash drifted for ${entry.target}`);
  const header = readFileSync(headerPath, 'utf8');
  assert.doesNotMatch(header, /^\s*#(if|elif|ifdef)\b/m, `${entry.target} header must be a flattened, target-ready header`);
  assert.match(header, /^#ifndef MASON_C_H\n#define MASON_C_H\n/m, `${entry.target} header must keep its include guard`);
  assert.equal((header.match(/^#ifndef/gm) ?? []).length, 1, `${entry.target} header must not retain conditional declarations`);
  const declared = declaredFunctions(header);
  const symbols = run('xcrun', ['nm', '--no-llvm-bc', '-gU', archive], { stdio: 'pipe' });
  for (const name of declared) {
    assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `${entry.target} header declares missing symbol: ${name}`);
  }
  for (const name of desktopSurface) {
    assert.ok(declared.has(name), `${entry.target} header must declare facade entry ${name}`);
    assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `${entry.target} archive must export facade entry ${name}`);
  }
  const apple = entry.target.endsWith('-apple-darwin');
  for (const name of appleOnlySymbols) {
    if (apple) {
      assert.ok(declared.has(name), `${entry.target} header must declare ${name}`);
      assert.match(symbols, new RegExp(`\\b_?${name}$`, 'm'), `${entry.target} archive must export ${name}`);
    } else {
      assert.ok(!declared.has(name), `${entry.target} header must not declare Apple-only ${name}`);
      assert.doesNotMatch(symbols, new RegExp(`\\b_?${name}$`, 'm'), `${entry.target} archive must not export Apple-only ${name}`);
    }
  }
  console.log(`Verified ${declared.size} declared symbols against the ${entry.target} archive; facade surface and platform gating hold.`);
}

const runnable = manifest.artifacts.find((entry) => entry.target === host);
if (!runnable) {
  console.log(`No desktop artifact matches host triple ${host}; skipping consumer execution.`);
} else {
  const consumer = mkdtempSync(resolve(tmpdir(), 'mason-core-desktop-'));
  try {
    copyFileSync(resolve(artifact, runnable.path), resolve(consumer, 'libMasonCore.a'));
    copyFileSync(resolve(artifact, runnable.header), resolve(consumer, 'mason_native.h'));
    copyFileSync(resolve(workspaceRoot, 'tools/mason-core/desktop/engine-consumer.c'), resolve(consumer, 'consumer.c'));
    const executable = resolve(consumer, 'consumer');
    run('xcrun', ['clang', '-std=c11', '-Wall', '-Wextra', '-Werror', '-I', consumer,
      resolve(consumer, 'consumer.c'), resolve(consumer, 'libMasonCore.a'),
      '-framework', 'Foundation', '-framework', 'CoreFoundation', '-lobjc', '-liconv', '-lresolv', '-o', executable]);
    run(executable, [], { cwd: consumer });
    const linked = run('otool', ['-L', executable], { stdio: 'pipe' });
    assert.doesNotMatch(linked, /Mason\.framework|FontManager|SDWebImage/, 'Consumer must not load full MasonKit dependencies.');
    console.log(`Desktop consumer for ${runnable.target} linked and ran using only the pinned archive, its generated header, and system libraries.`);
  } finally {
    rmSync(consumer, { recursive: true, force: true });
  }
}
