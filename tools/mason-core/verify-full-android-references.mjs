import { resolve } from 'node:path';
import { androidProjectRoot } from './android-sources.mjs';
import { workspaceRoot } from './sources.mjs';
import { run } from './build-native.mjs';

const javaHome = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21'], { stdio: 'pipe' }).trim();
// Compile the actual full Gradle project, including its relocated Java/Kotlin
// source set. The unchanged Rust build is qualified separately; excluding that
// task prevents this reference check from rebuilding unrelated native outputs.
run('bash', ['gradlew', '--no-daemon', '--max-workers=2',
  '--project-cache-dir', resolve(workspaceRoot, 'tmp/mason-full-android-reference-cache'),
  ':masonkit:compileReleaseKotlin', ':masonkit:compileReleaseJavaWithJavac', '-x', ':masonkit:cargoBuild'],
{ cwd: androidProjectRoot, env: { ...process.env, JAVA_HOME: javaHome } });
console.log('The original full Gradle project compiles relocated shared native sources without a core runtime dependency.');
