import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const fullSourceRoot = resolve(workspaceRoot, 'packages/nativescript-masonkit');
export const coreSourceRoot = resolve(workspaceRoot, 'packages/nativescript-mason-core');

// Preserve MasonKit's published relative imports while these sources move to core.
// This is build/test source wiring, not a runtime package dependency.
export const relocatedModules = Object.freeze(['box-shadow', 'css-colors', 'css-filter', 'css-math', 'css-transform']);

export function relocatedSource(source, importer) {
  if (!importer || !source.startsWith('.')) return null;
  const candidate = resolve(dirname(importer), source.replace(/\.(?:ts|js)$/, ''));
  for (const name of relocatedModules) {
    if (candidate === resolve(fullSourceRoot, name)) return resolve(coreSourceRoot, `${name}.ts`);
  }
  return null;
}
