import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { relative } from 'node:path';

export const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const fullSourceRoot = resolve(workspaceRoot, 'packages/nativescript-masonkit');
export const coreSourceRoot = resolve(workspaceRoot, 'packages/nativescript-mason-core');

// Preserve MasonKit's published relative imports while these sources move to core.
// This is build/test source wiring, not a runtime package dependency.
export const relocatedModules = Object.freeze(['box-shadow', 'css-colors', 'css-filter', 'css-math', 'css-transform']);

export const relocatedFiles = Object.freeze([
  ...relocatedModules.map((name) => `${name}.ts`),
  'css-keyframes.ts', 'css-shorthands.ts', 'diagnostics.ts', 'display-density.ts',
  'fonts.ts', 'foreign-layout.ts', 'gradient-stops.ts', 'logical-boxes.ts', 'mask.ts', 'mask.windows.ts',
  'panel-helpers.ts', 'panel-helpers.windows.ts', 'properties.ts', 'pseudo.ts',
  'style.ts', 'svg-path.d.ts', 'svg-path.windows.ts', 'symbols.ts', 'units.ts',
  'utils/index.android.ts', 'utils/index.d.ts', 'utils/index.ios.ts',
  'view/index.android.ts', 'view/index.d.ts', 'view/index.ios.ts',
  'scroll/index.android.ts', 'scroll/index.d.ts', 'scroll/index.ios.ts',
]);

/** Physical source for an original MasonKit filename, preserving its logical import context. */
export function relocatedFile(filename) {
  const name = relative(fullSourceRoot, filename);
  return relocatedFiles.includes(name) ? resolve(coreSourceRoot, name) : null;
}

export function sourceExists(filename) {
  return existsSync(filename) || !!relocatedFile(filename);
}

export function relocatedSource(source, importer) {
  if (!importer || !source.startsWith('.')) return null;
  const base = resolve(dirname(importer), source.replace(/\.(?:ts|js)$/, ''));
  for (const candidate of [`${base}.ts`, `${base}/index.ts`]) {
    if (relocatedFile(candidate)) return candidate;
  }
  return null;
}
