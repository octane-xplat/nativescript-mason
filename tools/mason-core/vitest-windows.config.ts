import { defineConfig } from 'vitest/config';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import base from '../testing/vitest.config';
import { workspaceRoot } from './sources.mjs';

const generated = resolve(workspaceRoot, 'tmp/nativescript-mason-core');
export default defineConfig({
  define: { ...base.define, __WINDOWS__: 'true' },
  resolve: base.resolve,
  plugins: [{
    name: 'core-windows-leaves', enforce: 'pre',
    resolveId(source, importer) {
      if (!importer?.startsWith(generated) || !source.startsWith('.') || /\.(ts|js)$/.test(source)) return null;
      const path = resolve(dirname(importer), source);
      if (path === resolve(generated, 'utils')) return resolve(workspaceRoot, 'tools/testing/mason-test-kit/utils-stub.ts');
      return [`${path}.windows.ts`, `${path}/index.windows.ts`].find(existsSync) ?? null;
    },
  }, ...(base.plugins ?? [])],
  test: {
    root: workspaceRoot, environment: 'node',
    setupFiles: [resolve(workspaceRoot, 'tools/testing/mason-test-kit/setup.ts')],
    include: ['tools/mason-core/windows-style.spec.ts', 'tools/mason-core/windows-foreign.spec.ts'],
    server: { deps: { inline: [/@nativescript[\\/]core/] } },
  },
});
