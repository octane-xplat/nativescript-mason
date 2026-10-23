import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';

const repository = process.env.MASON_CORE_XPLAT_REPOSITORY;
assert.ok(repository, 'Set MASON_CORE_XPLAT_REPOSITORY to the Xplat checkout to qualify.');
const consumer = resolve(workspaceRoot, 'tmp/mason-core-nativescript-consumer');
assert.ok(existsSync(resolve(consumer, '.mason-core-consumer')));
const json = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const hash = (value) => createHash('sha256').update(value).digest('hex');
const scenarioPath = resolve(consumer, 'consumer-scenario.json');
const scenario = json(scenarioPath);
assert.equal(scenario.scenario, 'xplat-compiled');
assert.equal(scenario.bundler, undefined, 'Prepare the compiled consumer before applying the Vite scenario.');
const compatibility = json(resolve(repository, 'packages/create/compatibility.json'));
const manifestPath = resolve(consumer, 'package.json');
const manifest = json(manifestPath);
const pins = {
  '@nativescript/vite': '8.0.20',
  '@nativescript-community/vite-octane': '0.2.1',
  '@octanejs/vite-plugin': '0.1.61',
  vite: '8.3.0',
};
for (const [name, version] of Object.entries(pins)) {
  assert.equal(compatibility.packages[name]?.version, version, `Review the Vite consumer toolchain pin for ${name}.`);
}
Object.assign(manifest.devDependencies, pins, {
  '@octane-xplat/cli': `link:${resolve(repository, 'packages/cli')}`,
});
delete manifest.devDependencies['@nativescript/webpack'];
writeJson(manifestPath, manifest);

// Restore the canonical renderer patch. Xplat's opt-in alias owns engine
// selection; this scenario must not rely on an edited renderer patch.
const patchManifest = json(resolve(repository, 'packages/cli/patches/manifest.json'));
const entries = Array.isArray(patchManifest) ? patchManifest : patchManifest.patches;
assert.ok(Array.isArray(entries));
const specifiers = new Set([
  ...scenario.patches.map(({ specifier }) => specifier),
  ...Object.entries(pins).map(([name, version]) => `${name}@${version}`),
]);
scenario.patches = entries.filter(({ specifier }) => specifiers.has(specifier)).map(({ specifier, file }) => {
  const source = readFileSync(resolve(repository, 'packages/cli/patches', file));
  writeFileSync(resolve(consumer, 'patches', file), source);
  return { specifier, file: `patches/${file}`, sourceSha256: hash(source), fixtureSha256: hash(source) };
});
writeFileSync(resolve(consumer, 'pnpm-workspace.yaml'), 'packages: []\nautoInstallPeers: false\n' +
  'allowBuilds:\n  "@nativescript/core": true\n  "@parcel/watcher": true\n  core-js-pure: true\n  nativescript: true\n' +
  'overrides:\n' + Object.entries(compatibility.overrides).map(([name, value]) => `  ${JSON.stringify(name)}: ${JSON.stringify(value)}`).join('\n') + '\n' +
  'patchedDependencies:\n' + scenario.patches.map(({ specifier, file }) => `  ${JSON.stringify(specifier)}: ${file}`).join('\n') + '\n');
const original = readFileSync(resolve(workspaceRoot, 'tools/mason-core/consumer/compiled-app.js'), 'utf8');
const bootstrap = original.replace(/^const \{([^\n]+)\} = require\('(@[^']+)'\);$/gm, "import {$1} from '$2';")
  .replace("const { Counter } = require('./hook-component');", "import { Counter } from '../src/hook-component.tsrx';")
  .replace("scenario: 'xplat-compiled', phase", "scenario: 'xplat-compiled', bundler: 'vite', phase");
assert.doesNotMatch(bootstrap, /require\(/);
assert.match(bootstrap, /bundler: 'vite'/);
writeFileSync(resolve(consumer, 'app/app.js'), bootstrap);
rmSync(resolve(consumer, 'nativescript.config.js'), { force: true });
writeFileSync(resolve(consumer, 'nativescript.config.ts'), `export default {
  id: 'org.octane.masoncoreprobe', appPath: 'app', appResourcesPath: 'App_Resources',
  cli: { packageManager: 'pnpm' }, bundler: 'vite', bundlerConfigPath: 'vite.config.mts',
};\n`);
writeFileSync(resolve(consumer, 'vite.config.mts'), `import { defineConfig } from 'vite';
import { xplatNative } from '@octane-xplat/cli/vite';
export default defineConfig(({ mode }) => xplatNative(mode, {
  rules: [{ include: '**/*.{tsx,tsrx}', renderer: 'nativescript' }],
}));\n`);
scenario.bundler = 'vite';
scenario.bundlerVersions = pins;
scenario.boundary = 'Canonical Xplat renderer and Vite patches; app-declared core selects Xplat preset aliases. Authored TSRX is compiled by the actual Vite pipeline.';
scenario.bootstrapSha256 = hash(bootstrap);
writeJson(scenarioPath, scenario);
console.log('Prepared actual Xplat Vite consumer; install with pnpm install --force before building.');
