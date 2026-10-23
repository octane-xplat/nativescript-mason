import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fullSourceRoot, coreSourceRoot } from './sources.mjs';
import { containerMembers } from './container-members.mjs';

function parse(name) {
  const text = readFileSync(resolve(fullSourceRoot, name), 'utf8');
  return ts.createSourceFile(name, text, ts.ScriptTarget.Latest, true);
}

function nameOf(node, file) {
  if (ts.isConstructorDeclaration(node)) return 'constructor';
  if (node.name) return node.name.getText(file);
  if (ts.isVariableStatement(node)) return node.declarationList.declarations[0].name.getText(file);
  return '';
}

function apply(file, edits) {
  let output = file.text;
  let previous = output.length;
  for (const { node, text = '' } of edits.sort((a, b) => b.node.getFullStart() - a.node.getFullStart())) {
    if (node.getEnd() > previous) throw new Error(`Overlapping core source adaptations in ${file.fileName}`);
    output = output.slice(0, node.getFullStart()) + text + output.slice(node.getEnd());
    previous = node.getFullStart();
  }
  return output;
}

function required(nodes, names, file) {
  return names.map((name) => {
    const found = nodes.filter((node) => nameOf(node, file) === name);
    if (found.length !== 1) throw new Error(`Core extraction requires exactly one ${file.fileName}:${name}; found ${found.length}`);
    return found[0];
  });
}

/** Temporary prototype seam: full ViewBase stays untouched; only core is projected. */
export function coreCommonSource() {
  const file = parse('common.ts');
  const [view] = required(file.statements, ['ViewBase'], file);
  const edits = [];
  const removeTop = required(file.statements, [
    'textContentProperty', 'windowsRunCounts', 'windowsNativeOf', 'windowsBreakRun',
    'windowsMemberKind', 'windowsInnerHTML', 'setWindowsInnerHTML', 'windowsFontSource',
    'TextBase', 'ButtonBase', 'srcProperty', 'ImageBase', 'InputEvent', 'CompositionEvent', 'KeyboardEvent',
  ], file);
  edits.push(...removeTop.map((node) => ({ node })));
  for (const node of file.statements) {
    if (ts.isImportDeclaration(node) && ['./text-node', './text-runs', './framework-registry'].includes(node.moduleSpecifier.text)) edits.push({ node });
    if (ts.isExpressionStatement(node) && /^(?:textProperty|textContentProperty|srcProperty)\.register\(/.test(node.getText(file))) edits.push({ node });
  }
  const [owner, getStyle, wrap] = required(file.statements, ['nativeOwnerFor', 'getViewStyle', 'wrapNativeEvent'], file);
  edits.push({ node: owner, text: `\nfunction nativeOwnerFor(nativeView: any): ViewBase | NSViewBase | null {\n  return getWeakRefValue<ViewBase | NSViewBase>(nativeView?.__masonOwner);\n}\n` });
  edits.push({ node: getStyle, text: '\n' + getStyle.getText(file).replace('WeakRef<NSViewBase> | WeakRef<TextBase>', 'WeakRef<NSViewBase>') });
  edits.push({ node: wrap, text: '\nfunction wrapNativeEvent(_type: string): Event { return new Event(); }\n' });

  const replace = required(view.members, [
    '_children', 'addChild', 'insertBefore', 'insertChild', 'replaceChild', 'removeChild', 'removeChildren', '_nativeIndexFor',
  ], file);
  edits.push(...replace.map((node, index) => ({ node, text: index === 0 ? '\n' + containerMembers : '' })));
  // Contiguous native text/run reconciliation block, including its Windows path.
  const [first, last] = required(view.members, ['_createOrUpdateNativeTextNode', '[textProperty.setNative]'], file);
  const textMembers = view.members.filter((node) => node.getStart(file) >= first.getStart(file) && node.getEnd() <= last.getEnd());
  if (textMembers.length !== 34) throw new Error(`ViewBase text boundary changed (${textMembers.length} members); review the projection.`);
  edits.push(...textMembers.map((node) => ({ node })));
  for (const name of ['innerHTML', '_windowsNativeIndexOf', '_nativeRemoveChildNode', '_windowsAttachPlaceholder', '_windowsDetachPlaceholder']) {
    const found = view.members.filter((node) => nameOf(node, file) === name);
    if (found.length !== (name === 'innerHTML' ? 2 : 1)) throw new Error(`ViewBase boundary changed: ${name}`);
    edits.push(...found.map((node) => ({ node })));
  }
  let output = apply(file, edits);
  const before = 'return isCssLength(value) ? value.css : value;';
  if (output.split(before).length !== 2) throw new Error('Review core environment shorthand forwarding.');
  output = "import { isCssEnvironmentShorthand } from './css-environment';\n" +
    output.replace(before, 'return isCssLength(value) && !isCssEnvironmentShorthand(value) ? value.css : value;');
  if (/\b(?:TextNode|TextBase|ButtonBase|ImageBase|frameworkRegistry|reconcileTextRuns|MasonTextNode|innerHTML)\b/.test(output)) {
    throw new Error('The core ViewBase projection still references optional text/HTML implementation.');
  }
  return output;
}

export function coreTreeSource(platform) {
  const file = parse(platform === 'types' ? 'tree/index.d.ts' : `tree/index.${platform}.ts`);
  const [tree] = required(file.statements, ['Tree'], file);
  const keep = new Set(['_base', '_tree', 'constructor', 'instance', 'native', 'createView', 'createScrollView', 'preflight']);
  const edits = tree.members.filter((node) => !keep.has(nameOf(node, file))).map((node) => ({ node }));
  for (const node of file.statements) {
    if ((ts.isEnumDeclaration(node) && nameOf(node, file) === 'TextType') ||
      (ts.isImportDeclaration(node) && node.moduleSpecifier.text === '..')) edits.push({ node });
  }
  return apply(file, edits);
}

export function coreLayoutTypes() {
  const file = parse('index.d.ts');
  // The existing layout aliases have no widget dependencies. Keep their text unchanged.
  const aliases = file.statements.filter((node) =>
    (ts.isTypeAliasDeclaration(node) && node.name.text !== 'InputType') || ts.isModuleDeclaration(node));
  return "import type { Color, CoreTypes } from '@nativescript/core';\nimport type { LengthPercentage } from '@nativescript/core/css/parser';\n" + aliases.map((node) => node.getFullText(file)).join('\n');
}

export function corePropertiesSource() {
  let text = readFileSync(resolve(coreSourceRoot, 'properties.ts'), 'utf8');
  for (const [before, after] of [
    ["import type { TextBase, ViewBase } from './common';", "import type { ViewBase } from './common';"],
    ['WeakRef<NSViewBase> | WeakRef<TextBase>', 'WeakRef<NSViewBase> | WeakRef<ViewBase>'],
  ]) {
    if (text.split(before).length !== 2) throw new Error('Core property type adaptation needs review.');
    text = text.replace(before, after);
  }
  return coreEnvironmentPropertiesSource(text);
}

/** Keep this adaptation separate so packed shared-source verification can apply it to emitted JS. */
export function coreEnvironmentPropertiesSource(text) {
  const before = '          set.call(this, masonLengthDeclaration(value));';
  // tsc uses four spaces fewer than the original source.
  const source = text.includes(before) ? before : before.trimStart();
  if (text.split(source).length !== 2) throw new Error('Review core environment size adapter.');
  let output = text.replace(source, source.replace('masonLengthDeclaration(value)', 'masonLengthDeclaration(environmentStyleValue(this, key, value))'));
  const sizes = '[widthProperty, heightProperty].flatMap';
  if (output.split(sizes).length !== 2) throw new Error('Review environment size accessor boundary.');
  output = output.replace(sizes, '[widthProperty, heightProperty, minWidthProperty, minHeightProperty, maxWidthProperty, maxHeightProperty].flatMap');
  const parts = 'const parts = split(trimmed);';
  if (output.split(parts).length !== 2) throw new Error('Review environment shorthand converter boundary.');
  output = output.replace(parts, `const parts = (['padding', 'margin', 'border-width'].includes(cssName) &&
      cssEnvironmentShorthand(trimmed, split, longhands.length)) || split(trimmed);`);
  // The converter destructures its entry; make its CSS name available too.
  output = output.replace('function shorthandConverter({ longhands, split }', 'function shorthandConverter({ cssName, longhands, split }');
  return "import { environmentStyleValue, cssEnvironmentShorthand } from './css-environment';\n" + output;
}

/** Windows rich-text run copying belongs to full MasonKit, not mobile containers. */
export function coreStyleSource(source = readFileSync(resolve(coreSourceRoot, 'style.ts'), 'utf8')) {
  const file = ts.createSourceFile('style.ts', source, ts.ScriptTarget.Latest, true);
  const [style] = required(file.statements, ['Style'], file);
  const [method] = required(style.members, ['copyTextStyleTo'], file);
  const guard = method.body?.statements[0];
  const condition = guard && ts.isIfStatement(guard) ? guard.expression : undefined;
  if (!condition || !ts.isBinaryExpression(condition) || condition.operatorToken.kind !== ts.SyntaxKind.BarBarToken ||
    !ts.isPrefixUnaryExpression(condition.left) || condition.left.operator !== ts.SyntaxKind.ExclamationToken ||
    !ts.isIdentifier(condition.left.operand) || condition.left.operand.text !== '__WINDOWS__' ||
    !ts.isReturnStatement(guard.thenStatement)) {
    throw new Error('Review the rich-text style boundary: copyTextStyleTo is no longer Windows-only.');
  }
  let output = apply(file, [{ node: method }]);
  // Shorthands/aliases delegate to leaf setters. Resolve there so later longhand
  // overrides replace only that edge, rather than replaying a stale shorthand.
  const setterName = (node) => ts.isStringLiteral(node.name) ? node.name.text : nameOf(node, file);
  const setters = new Set(style.members.filter(ts.isSetAccessorDeclaration).map(setterName));
  const delegates = ['paddingCss', 'marginCss', 'insetCss'];
  for (const member of style.members.filter(ts.isSetAccessorDeclaration)) {
    let delegatesToSetter = false;
    function visit(node) {
      if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
          ts.isPropertyAccessExpression(node.left) && node.left.expression.kind === ts.SyntaxKind.ThisKeyword &&
          setters.has(node.left.name.text)) delegatesToSetter = true;
      ts.forEachChild(node, visit);
    }
    visit(member);
    if (delegatesToSetter) delegates.push(setterName(member));
  }
  const before = '          set.call(this, value);';
  if (output.split(before).length !== 2) throw new Error('Review core environment style adapter.');
  output = output.replace(before,
    `          const resolved = environmentDelegates.has(name) ? value :
            environmentStyleValue(this, name, value);
          set.call(this, resolved);`);
  output = output.replace('  const proto = Style.prototype',
    `  const environmentDelegates = new Set(${JSON.stringify(delegates)});\n  const proto = Style.prototype`);
  for (const name of ['padding', 'margin', 'inset']) {
    const signature = `set ${name}Css(value`;
    const node = style.members.find((member) => ts.isSetAccessorDeclaration(member) && nameOf(member, file) === `${name}Css`);
    if (!node) throw new Error(`Review core environment ${name}Css boundary.`);
    // This adaptation works for both original TS and emitted JS.
    const opening = output.indexOf('{', output.indexOf(signature));
    if (opening < 0) throw new Error(`Missing ${signature}`);
    const indent = source.includes('private view_:') ? '    ' : '        ';
    output = output.slice(0, opening + 1) + `
${indent}if (typeof value === 'string' && /\\benv\\(/i.test(value)) {
${indent}    Reflect.set(this, '${name}', value);
${indent}    return;
${indent}}` + output.slice(opening + 1);
  }
  const sides = 'const sides = expandSidesShorthand(value);';
  if (output.split(sides).length !== 4) throw new Error('Review core environment box setters.');
  output = output.replaceAll(sides, 'const sides = cssEnvironmentSides(value) || expandSidesShorthand(value);');
  return "import { environmentStyleValue, cssEnvironmentSides } from './css-environment';\n" + output;
}

/** A released foreign helper must not flush against a detached native view. */
export function coreForeignLayoutSource(source = readFileSync(resolve(coreSourceRoot, 'foreign-layout.ts'), 'utf8')) {
  const file = ts.createSourceFile('foreign-layout.ts', source, ts.ScriptTarget.Latest, true);
  const [release] = required(file.statements, ['releaseForeignLayout'], file);
  const statements = release.body?.statements ?? [];
  const clear = statements.filter((node) => node.getText(file).replace(/\s/g, '') === 'view[foreignStyle_]=undefined;');
  if (clear.length !== 1) throw new Error('Review the foreign helper release boundary.');
  const guard = statements[statements.indexOf(clear[0]) - 1];
  if (guard?.getText(file).replace(/\s/g, '') !== 'if(!view?.[foreignStyle_])return;') {
    throw new Error('Review the foreign helper release guard.');
  }
  const prefix = file.text.slice(clear[0].getFullStart(), clear[0].getStart(file));
  if (!/^\s+$/.test(prefix)) throw new Error('Review comments at the foreign helper release boundary.');
  return "import { releaseCssEnvironmentStyle } from './css-environment';\n" + apply(file, [{ node: clear[0], text: `${prefix}releaseCssEnvironmentStyle(view[foreignStyle_]);${prefix}view[foreignStyle_].resetState();${clear[0].getFullText(file)}` }]);
}
