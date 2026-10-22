import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fullSourceRoot, coreSourceRoot, relocatedFiles, workspaceRoot } from './sources.mjs';
import { dirname } from 'node:path';

// Keep the same depth as packages/nativescript-masonkit so existing reference
// and tsconfig paths resolve unchanged. Nothing is generated into tracked source.
const destination = resolve(workspaceRoot, 'tmp/nativescript-masonkit');
const excluded = new Set(['src-native', 'platforms', 'angular', 'vue', 'svelte']);

for (const name of relocatedFiles) {
  if (existsSync(resolve(fullSourceRoot, name))) {
    throw new Error(`Relocated source unexpectedly exists in MasonKit: ${name}`);
  }
  if (!existsSync(resolve(coreSourceRoot, name))) {
    throw new Error(`Missing core source: ${name}`);
  }
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(fullSourceRoot, destination, {
  recursive: true,
  filter(source) {
    const path = relative(fullSourceRoot, source);
    return !excluded.has(path.split(sep)[0]) && !/\.(?:spec|test)\.ts$/.test(path);
  },
});
for (const name of relocatedFiles) {
  mkdirSync(dirname(resolve(destination, name)), { recursive: true });
  copyFileSync(resolve(coreSourceRoot, name), resolve(destination, name));
}
console.log(`Prepared MasonKit source overlay with ${relocatedFiles.length} unchanged core modules.`);
