import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { coreSourceRoot, workspaceRoot } from './sources.mjs';
import { windowsHostFiles, projectWindowsSource } from './windows-sources.mjs';

// Regenerate the core Windows host sources from MasonKit's, build with MSBuild,
// and stage the WinRT component into the package's platforms dir. Runs on
// Windows; the MSBuild + C++/WinRT toolchain comes from VS Build Tools.

const coreMasonDir = resolve(coreSourceRoot, 'src-native/windows/Mason');
const config = process.argv.includes('--debug') ? 'Debug' : 'Release';
const platform = process.argv.includes('--arm64') ? 'ARM64' : 'x64';
const triple = platform === 'ARM64' ? 'aarch64-pc-windows-msvc' : 'x86_64-pc-windows-msvc';

for (const name of windowsHostFiles) {
  writeFileSync(resolve(coreMasonDir, name), projectWindowsSource(name));
}
console.log(`windows-sources: projected ${windowsHostFiles.length} sources into ${coreMasonDir}`);

const libDir = resolve(workspaceRoot, `dist/native/mason-core/desktop/${triple}`);
if (!existsSync(resolve(libDir, 'MasonCore.lib'))) {
  throw new Error(`Pinned core archive missing: ${resolve(libDir, 'MasonCore.lib')} — run the desktop engine build first.`);
}
copyFileSync(resolve(libDir, 'include/mason_native.h'), resolve(coreMasonDir, 'include/mason_native.h'));

function vswhere() {
  const path = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe';
  if (!existsSync(path)) throw new Error('vswhere.exe not found — install VS Build Tools with the VCTools workload.');
  return path;
}

function findTool(query) {
  const out = spawnSync(vswhere(), ['-latest', '-requires', 'Microsoft.Component.MSBuild', '-find', query], { encoding: 'utf8' });
  const found = out.stdout.trim().split(/\r?\n/)[0];
  if (!out.status && found) return found;
  return null;
}

const msbuild = findTool('MSBuild\\**\\Bin\\MSBuild.exe');
if (!msbuild) throw new Error('MSBuild.exe not found via vswhere.');

const project = resolve(coreMasonDir, 'NativeScript.Mason.vcxproj');
const build = spawnSync(msbuild, [project, `/p:Configuration=${config}`, `/p:Platform=${platform}`, '/m', '/nologo', '/verbosity:minimal'], { stdio: 'inherit' });
if (build.status) throw new Error(`MSBuild failed (${build.status}).`);

const outDir = resolve(coreMasonDir, `${platform}/${config}`);
const dll = resolve(outDir, 'NativeScript.Mason.dll');
const winmd = resolve(outDir, 'NativeScript.Mason.winmd');
if (!existsSync(dll) || !existsSync(winmd)) throw new Error(`Build outputs missing in ${outDir}: ${readdirSync(outDir).join(', ')}`);

const staged = resolve(coreSourceRoot, `platforms/windows/${platform === 'ARM64' ? 'arm64' : 'x64'}`);
mkdirSync(staged, { recursive: true });
for (const artifact of [dll, winmd]) {
  copyFileSync(artifact, resolve(staged, artifact.split(/[\\/]/).pop()));
}
console.log(`windows-host: staged NativeScript.Mason.dll + .winmd into ${staged}`);
