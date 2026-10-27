import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

export function verifyWindowsPackage(tarball) {
  const temp = mkdtempSync(resolve(tmpdir(), 'mason-windows-package-'));
  try {
    const unpack = spawnSync('tar', ['-xzf', resolve(tarball), '-C', temp], { encoding: 'utf8' });
    assert.equal(unpack.status, 0, unpack.stderr);
    const root = resolve(temp, 'package');
    const manifest = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    assert.equal(manifest.name, '@octane-xplat/nativescript-mason-core');
    assert.equal(manifest.nativescript?.platforms?.windows, '0.1.0', 'Package does not advertise a Windows host. Registry betas .4/.5 omit it.');
    const inventory = JSON.parse(readFileSync(resolve(root, 'artifact-inventory.json'), 'utf8'));
    function files(path) {
      return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
        assert.ok(!entry.isSymbolicLink(), `Package contains an external link: ${entry.name}`);
        const file = resolve(path, entry.name);
        return entry.isDirectory() ? files(file) : [relative(root, file).replaceAll('\\', '/')];
      });
    }
    assert.deepEqual(files(root).filter((name) => name !== 'artifact-inventory.json').sort(), inventory.map(({ name }) => name).sort());
    for (const { name, sha256 } of inventory) {
      assert.equal(createHash('sha256').update(readFileSync(resolve(root, name))).digest('hex'), sha256, name);
    }
    for (const name of ['index.windows.js', 'mask.windows.js', 'native-environment.windows.js', 'panel-helpers.windows.js', 'scroll/index.windows.js', 'svg-path.windows.js', 'tree/index.windows.js', 'utils/index.windows.js', 'view/index.windows.js', 'platforms/windows/plugin.props', 'platforms/windows/plugin.targets', 'platforms/windows/patch-winrt-projection.ps1', 'platforms/windows/StyleTransport.cs', 'platforms/windows/x64/NativeScript.Mason.dll', 'platforms/windows/x64/NativeScript.Mason.winmd']) {
      assert.ok(inventory.some((entry) => entry.name === name), `Windows package missing ${name}`);
    }
    return { version: manifest.version, files: inventory.length, sha256: createHash('sha256').update(readFileSync(tarball)).digest('hex') };
  } finally { rmSync(temp, { recursive: true, force: true }); }
}
