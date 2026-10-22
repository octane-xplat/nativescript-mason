import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { workspaceRoot } from './sources.mjs';
import { fileURLToPath } from 'node:url';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} failed:\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}

export function bootstrapKotlinCompiler(javaHome) {
  const directory = resolve(workspaceRoot, 'tmp/mason-core-kotlin-parser/gradle');
  mkdirSync(directory, { recursive: true });
  writeFileSync(resolve(directory, 'settings.gradle'), "rootProject.name = 'MasonCoreKotlinParser'\n");
  copyFileSync(resolve(workspaceRoot, 'tools/mason-core/kotlin-parser.gradle'), resolve(directory, 'build.gradle'));
  const wrapper = resolve(workspaceRoot, 'packages/nativescript-masonkit/src-native/mason-android/gradlew');
  run('bash', [wrapper, '-p', directory, '--no-daemon', '--max-workers=2', 'resolveMasonCoreParser'], { env: { ...process.env, JAVA_HOME: javaHome } });
}

export function parseKotlinSources(filenames) {
  const cache = resolve(process.env.GRADLE_USER_HOME ?? resolve(homedir(), '.gradle'), 'caches/modules-2/files-2.1');
  const artifacts = [
    ['org.jetbrains.kotlin', 'kotlin-compiler-embeddable', '1.9.20'],
    ['org.jetbrains.kotlin', 'kotlin-stdlib', '1.9.20'],
    ['org.jetbrains.kotlin', 'kotlin-script-runtime', '1.9.20'],
    ['org.jetbrains.intellij.deps', 'trove4j', '1.0.20200330'],
    ['org.jetbrains', 'annotations', '13.0'],
  ];
  const javaHome = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21']).trim();
  function locate([group, name, version]) {
    const root = resolve(cache, group, name, version);
    return existsSync(root) ? readdirSync(root).filter((hash) => statSync(resolve(root, hash)).isDirectory()).flatMap((hash) => readdirSync(resolve(root, hash)).filter((file) => file === `${name}-${version}.jar`).map((file) => resolve(root, hash, file))) : [];
  }
  if (artifacts.some((artifact) => locate(artifact).length !== 1)) bootstrapKotlinCompiler(javaHome);
  const jars = artifacts.map((artifact) => {
    const [, name, version] = artifact;
    const matches = locate(artifact);
    if (matches.length !== 1) throw new Error(`Expected one cached ${name}:${version} jar, found ${matches.length}.`);
    return matches[0];
  });
  const output = resolve(workspaceRoot, 'tmp/mason-core-kotlin-parser');
  mkdirSync(output, { recursive: true });
  const source = resolve(workspaceRoot, 'tools/mason-core/KotlinSpans.java');
  const compiled = resolve(output, 'KotlinSpans.class');
  if (!existsSync(compiled) || statSync(compiled).mtimeMs < statSync(source).mtimeMs) {
    run(resolve(javaHome, 'bin/javac'), ['-cp', jars.join(':'), '-d', output, source]);
  }
  return JSON.parse(run(resolve(javaHome, 'bin/java'), ['-Djava.awt.headless=true', '-cp', [output, ...jars].join(':'), 'KotlinSpans', ...filenames]));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--bootstrap')) {
  bootstrapKotlinCompiler(process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21']).trim());
  console.log('Resolved the Kotlin compiler used by the Android source projection.');
}

export class KotlinSource {
  constructor(filename, nodes) {
    this.filename = filename;
    this.text = readFileSync(filename, 'utf8');
    this.nodes = nodes;
    this.edits = [];
  }

  declarations(name, owner) {
    return this.nodes.filter((node) => node.name === name && node.kind !== 'KtIfExpression' && (owner === undefined || node.owner === owner));
  }

  edit(node, replacement = '') {
    this.edits.push({ start: node.start, end: node.end, replacement });
  }

  remove(name, owner, count = 1) {
    const nodes = this.declarations(name, owner);
    if (nodes.length !== count) throw new Error(`${this.filename}: expected ${count} ${owner ?? ''}.${name}, found ${nodes.length}.`);
    nodes.forEach((node) => this.edit(node));
  }

  replace(name, owner, replacement) {
    const nodes = this.declarations(name, owner);
    if (nodes.length !== 1) throw new Error(`${this.filename}: expected one ${owner}.${name}, found ${nodes.length}.`);
    this.edit(nodes[0], replacement);
  }

  branch(condition, { otherwise = false, expression = false, count = 1, owner } = {}) {
    const nodes = this.nodes.filter((node) => node.kind === 'KtIfExpression' && node.name === condition && (owner === undefined || node.owner === owner));
    if (nodes.length !== count) throw new Error(`${this.filename}: expected ${count} if (${condition}), found ${nodes.length}.`);
    for (const node of nodes) {
      if (!otherwise) { this.edit(node); continue; }
      this.keepElse(node, expression);
    }
  }

  keepElse(node, expression = false) {
    if (node.otherwise === null) throw new Error(`Missing else branch for ${node.name}.`);
    const block = node.otherwise.startsWith('{') && node.otherwise.endsWith('}');
    this.edits.push({ start: node.start, end: node.otherwiseStart + (block && !expression ? 1 : 0), replacement: expression && block ? 'run ' : '' });
    if (block && !expression) this.edits.push({ start: node.end - 1, end: node.end, replacement: '' });
  }

  result() {
    let text = this.text;
    const edits = this.edits.sort((a, b) => b.start - a.start);
    let boundary = text.length;
    for (const edit of edits) {
      if (edit.end > boundary) throw new Error(`${this.filename}: overlapping Kotlin source edits.`);
      text = text.slice(0, edit.start) + edit.replacement + text.slice(edit.end);
      boundary = edit.start;
    }
    return text;
  }
}
