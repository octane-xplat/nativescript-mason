import { readFileSync } from 'node:fs';
import { relocatedFile, relocatedSource } from './sources.mjs';

/** Resolve the same source relocations used by the full package build. */
export function masonCoreSourceResolver() {
  return {
    name: 'mason-core-source-relocations',
    enforce: 'pre' as const,
    async resolveId(source: string, importer?: string) {
      const logical = relocatedSource(source, importer);
      if (!logical) return null;
      // Let the project's platform resolver choose an override first.
      return (await this.resolve(source, importer, { skipSelf: true })) ?? logical;
    },
    load(id: string) {
      const physical = relocatedFile(id);
      return physical ? readFileSync(physical, 'utf8') : null;
    },
  };
}
