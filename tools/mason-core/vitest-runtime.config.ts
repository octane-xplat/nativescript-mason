import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import base from '../testing/vitest.config';
import { workspaceRoot } from './sources.mjs';

const sourceRoot = resolve(workspaceRoot, 'tmp/nativescript-mason-core');

export default defineConfig({
  define: base.define,
  resolve: base.resolve,
  plugins: [
    {
      name: 'core-runtime-test-utils',
      enforce: 'pre',
      resolveId(source, importer) {
        if (importer?.startsWith(sourceRoot) && source.startsWith('.') && resolve(dirname(importer), source) === resolve(sourceRoot, 'utils')) {
          return resolve(workspaceRoot, 'tools/testing/mason-test-kit/utils-stub.ts');
        }
        return null;
      },
    },
    ...(base.plugins ?? []),
  ],
  test: {
    root: workspaceRoot,
    environment: 'node',
    setupFiles: [resolve(workspaceRoot, 'tools/testing/mason-test-kit/setup.ts')],
    include: ['tools/mason-core/runtime.spec.ts', 'tools/mason-core/css-environment.spec.ts', 'tools/mason-core/native-environment.spec.ts'],
    server: { deps: { inline: [/@nativescript[\\/]core/] } },
  },
});
