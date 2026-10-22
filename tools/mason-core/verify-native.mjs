import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { parseSchema } from '../scripts/style-keys/generate.mjs';
import { nativeRoot, run } from './build-native.mjs';
import { workspaceRoot } from './sources.mjs';

const artifact = resolve(nativeRoot, 'host');
const manifest = JSON.parse(readFileSync(resolve(artifact, 'manifest.json'), 'utf8'));
const consumer = mkdtempSync(resolve(tmpdir(), 'mason-core-native-'));
try {
  copyFileSync(resolve(artifact, manifest.artifacts[0].path), resolve(consumer, 'libMasonCore.a'));
  copyFileSync(resolve(artifact, 'include/mason_native.h'), resolve(consumer, 'mason_native.h'));
  copyFileSync(resolve(workspaceRoot, 'packages/nativescript-mason-core/src-native/tests/engine-consumer.c'), resolve(consumer, 'consumer.c'));
  const schema = parseSchema(readFileSync(resolve(workspaceRoot, 'tools/scripts/style-keys/style-keys.schema'), 'utf8'));
  const names = ['DISPLAY', 'FLEX_DIRECTION', 'ALIGN_ITEMS'];
  writeFileSync(resolve(consumer, 'style-offsets.h'), names.map((name) => {
    const field = schema.style.find((entry) => entry.kind === 'field' && entry.name === name);
    assert.ok(field, `Missing style field ${name}`);
    return `#define CORE_${name} ${field.offset}`;
  }).join('\n') + '\n');
  const executable = resolve(consumer, 'consumer');
  run('xcrun', ['clang', '-std=c11', '-Wall', '-Wextra', '-Werror', '-I', consumer,
    resolve(consumer, 'consumer.c'), resolve(consumer, 'libMasonCore.a'),
    '-framework', 'Foundation', '-framework', 'CoreFoundation', '-lobjc', '-liconv', '-lresolv', '-o', executable]);
  run(executable, [], { cwd: consumer });
  const linked = run('otool', ['-L', executable], { stdio: 'pipe' });
  assert.doesNotMatch(linked, /Mason\.framework|FontManager|SDWebImage/, 'Consumer must not load full MasonKit dependencies.');
  console.log('Independent engine consumer linked and ran using only the archive, C header, and system libraries.');
} finally {
  rmSync(consumer, { recursive: true, force: true });
}
