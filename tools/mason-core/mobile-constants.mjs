import ts from 'typescript';

// The runtime prototype ships iOS/Android wrappers only. Resolve its unsupported
// Windows branch at build time rather than requiring a nonstandard app define.
export function resolveMobileConstants(source, filename) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let changed = false;
  const transformed = ts.transform(file, [(context) => {
    function visit(node) {
      if (ts.isIdentifier(node) && node.text === '__WINDOWS__') {
        const parent = node.parent;
        if (ts.isPropertyAccessExpression(parent) && parent.name === node) return node;
        if (ts.isVariableDeclaration(parent) || ts.isParameter(parent) || ts.isImportSpecifier(parent)) {
          throw new Error(`A local Windows binding needs review: ${filename}`);
        }
        changed = true;
        return context.factory.createFalse();
      }
      return ts.visitEachChild(node, visit, context);
    }
    return (root) => ts.visitNode(root, visit);
  }]);
  try {
    return changed ? ts.createPrinter().printFile(transformed.transformed[0]) : source;
  } finally {
    transformed.dispose();
  }
}
