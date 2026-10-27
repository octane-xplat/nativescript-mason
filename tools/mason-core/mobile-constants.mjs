import ts from 'typescript';

// The emitted runtime keeps __ANDROID__/__APPLE__/__WINDOWS__ as bundler-defined
// platform constants — the app's bundler resolves them per target. This pass no
// longer folds __WINDOWS__; it only guards against local bindings shadowing the
// platform constant, which would flip branch meaning under the bundler's define.
export function resolveMobileConstants(source, filename) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  let foundLocalBinding = false;
  const check = ts.transform(file, [(context) => {
    function visit(node) {
      if (ts.isIdentifier(node) && node.text === '__WINDOWS__') {
        const parent = node.parent;
        if (ts.isVariableDeclaration(parent) || ts.isParameter(parent) || ts.isImportSpecifier(parent)) {
          foundLocalBinding = true;
        }
      }
      return ts.visitEachChild(node, visit, context);
    }
    return (root) => ts.visitNode(root, visit);
  }]);
  try {
    check.dispose();
    if (foundLocalBinding) throw new Error(`A local Windows binding needs review: ${filename}`);
    return source;
  } finally {
    check.transformed?.[0] && void 0;
  }
}
