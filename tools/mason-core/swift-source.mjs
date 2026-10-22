import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/** Compiler-derived declaration spans for the temporary iOS source projection. */
export class SwiftSource {
  constructor(filename) {
    this.filename = filename;
    this.text = readFileSync(filename, 'utf8');
    this.lines = this.text.split('\n');
    this.edits = [];
    const parsed = spawnSync('xcrun', ['swiftc', '-frontend', '-dump-parse', filename], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    if (parsed.error) throw parsed.error;
    if (parsed.status !== 0) throw new Error(`Swift parsing failed for ${filename}: ${parsed.stderr}`);
    this.nodes = [];
    for (const line of (parsed.stdout + parsed.stderr).split('\n')) {
      const match = line.match(/^(\s*)\((\w+)[^\n]*?range=\[.*?:(\d+):\d+ - line:(\d+):\d+\](.*)$/);
      if (!match) continue;
      const [, indent, kind, first, last, suffix] = match;
      this.nodes.push({ kind, indent: indent.length, first: Number(first) - 1, last: Number(last) - 1, name: suffix.match(/"([^"]+)"/)?.[1] });
    }
    for (const node of this.nodes.filter((node) => node.kind === 'var_decl')) {
      const binding = this.nodes.find((candidate) => candidate.kind === 'pattern_binding_decl' && candidate.indent === node.indent && candidate.first === node.first);
      if (binding) binding.name = node.name;
    }
  }

  declarations(name) {
    return this.nodes.filter((node) => node.indent <= 4 && node.name === name && ['func_decl', 'constructor_decl', 'class_decl', 'enum_decl', 'struct_decl', 'protocol', 'pattern_binding_decl'].includes(node.kind));
  }

  edit(node, replacement = '') {
    let first = node.first;
    while (first > 0 && this.lines[first - 1].trimStart().startsWith('@')) first--;
    this.edits.push({ first, last: node.last, replacement });
  }

  remove(name, count = 1) {
    const nodes = this.declarations(name);
    if (nodes.length !== count) throw new Error(`${this.filename}: expected ${count} declarations of ${name}, found ${nodes.length}`);
    nodes.forEach((node) => this.edit(node));
  }

  replace(name, replacement) {
    const nodes = this.declarations(name);
    if (nodes.length !== 1) throw new Error(`${this.filename}: expected one declaration of ${name}, found ${nodes.length}`);
    this.edit(nodes[0], replacement);
  }

  statement(marker, replacement = '', kind = 'if_stmt') {
    const matches = this.lines.flatMap((line, index) => line.includes(marker) ? [index] : []);
    if (matches.length !== 1) throw new Error(`${this.filename}: ambiguous statement ${marker}`);
    const nodes = this.nodes.filter((node) => node.kind === kind && node.first === matches[0]);
    if (nodes.length !== 1) throw new Error(`${this.filename}: compiler span missing for ${marker}`);
    this.edit(nodes[0], replacement);
  }

  result() {
    const lines = [...this.lines];
    let previous = lines.length;
    for (const edit of this.edits.sort((a, b) => b.first - a.first)) {
      if (edit.last >= previous) throw new Error(`${this.filename}: overlapping source adaptations at line ${edit.first + 1}`);
      lines.splice(edit.first, edit.last - edit.first + 1, edit.replacement);
      previous = edit.first;
    }
    return lines.join('\n');
  }
}

export function replaceOnce(text, before, after) {
  if (text.split(before).length !== 2) throw new Error(`Swift source adaptation needs review: ${before.slice(0, 100)}`);
  return text.replace(before, after);
}
