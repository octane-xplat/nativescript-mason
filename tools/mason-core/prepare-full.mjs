import { cpSync, copyFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, relative, sep } from 'node:path';
import { fullSourceRoot, coreSourceRoot, relocatedModules, workspaceRoot } from './sources.mjs';

// Keep the same depth as packages/nativescript-masonkit so existing reference
// and tsconfig paths resolve unchanged. Nothing is generated into tracked source.
const destination = resolve(workspaceRoot, 'tmp/nativescript-masonkit');
const excluded = new Set(['src-native', 'platforms', 'angular', 'vue', 'svelte']);

for (const name of relocatedModules) {
  if (existsSync(resolve(fullSourceRoot, `${name}.ts`))) {
    throw new Error(`Relocated source unexpectedly exists in MasonKit: ${name}.ts`);
  }
  if (!existsSync(resolve(coreSourceRoot, `${name}.ts`))) {
    throw new Error(`Missing core source: ${name}.ts`);
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
for (const name of relocatedModules) {
  copyFileSync(resolve(coreSourceRoot, `${name}.ts`), resolve(destination, `${name}.ts`));
}
console.log(`Prepared MasonKit source overlay with ${relocatedModules.length} unchanged core modules.`);
