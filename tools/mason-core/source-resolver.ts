import { relocatedSource } from './sources.mjs';

/** Resolve the same source relocations used by the full package build. */
export function masonCoreSourceResolver() {
  return {
    name: 'mason-core-source-relocations',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      return relocatedSource(source, importer);
    },
  };
}
