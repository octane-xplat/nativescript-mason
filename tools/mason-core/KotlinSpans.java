import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import org.jetbrains.kotlin.cli.jvm.compiler.EnvironmentConfigFiles;
import org.jetbrains.kotlin.cli.jvm.compiler.KotlinCoreEnvironment;
import org.jetbrains.kotlin.config.CompilerConfiguration;
import org.jetbrains.kotlin.com.intellij.openapi.util.Disposer;
import org.jetbrains.kotlin.com.intellij.psi.PsiElement;
import org.jetbrains.kotlin.com.intellij.psi.PsiErrorElement;
import org.jetbrains.kotlin.psi.*;

/** Parse source only, using the same Kotlin compiler version as the Android build. */
public final class KotlinSpans {
  private static String quoted(String value) {
    if (value == null) return "null";
    return "\"" + value.replace("\\", "\\\\").replace("\"", "\\\"")
      .replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t") + "\"";
  }

  private static String owner(PsiElement element) {
    List<String> names = new ArrayList<>();
    for (PsiElement parent = element.getParent(); parent != null; parent = parent.getParent()) {
      if (parent instanceof KtNamedDeclaration declaration && declaration.getName() != null) {
        names.add(0, declaration.getName());
      }
    }
    return String.join(".", names);
  }

  private static void visit(PsiElement element, List<String> nodes) {
    if (element instanceof PsiErrorElement error) throw new IllegalArgumentException(element.getContainingFile().getName() + ":" + element.getTextOffset() + ": " + error.getErrorDescription());
    if (element instanceof KtNamedDeclaration || element instanceof KtIfExpression || element instanceof KtSecondaryConstructor) {
      String name = element instanceof KtNamedDeclaration declaration ? declaration.getName() : null;
      if (element instanceof KtSecondaryConstructor) name = "<init>";
      String extra = "";
      if (element instanceof KtIfExpression branch) {
        name = branch.getCondition() == null ? null : branch.getCondition().getText();
        extra = ",\"otherwise\":" + quoted(branch.getElse() == null ? null : branch.getElse().getText())
          + ",\"otherwiseStart\":" + (branch.getElse() == null ? -1 : branch.getElse().getTextRange().getStartOffset());
      }
      if (element instanceof KtNamedFunction function) {
        extra = ",\"parameters\":[" + String.join(",", function.getValueParameters().stream()
          .map(parameter -> quoted(parameter.getTypeReference() == null ? null : parameter.getTypeReference().getText())).toList()) + "]";
      }
      nodes.add("{\"kind\":" + quoted(element.getClass().getSimpleName()) + ",\"name\":" + quoted(name)
        + ",\"owner\":" + quoted(owner(element)) + ",\"start\":" + element.getTextRange().getStartOffset()
        + ",\"end\":" + element.getTextRange().getEndOffset() + extra + "}");
    }
    for (PsiElement child : element.getChildren()) visit(child, nodes);
  }

  public static void main(String[] args) throws Exception {
    var disposable = Disposer.newDisposable();
    try {
      var environment = KotlinCoreEnvironment.createForProduction(disposable, new CompilerConfiguration(), EnvironmentConfigFiles.JVM_CONFIG_FILES);
      var factory = new KtPsiFactory(environment.getProject(), false);
      List<String> files = new ArrayList<>();
      for (String filename : args) {
        var file = factory.createFile(Path.of(filename).getFileName().toString(), Files.readString(Path.of(filename)));
        List<String> nodes = new ArrayList<>();
        visit(file, nodes);
        files.add(quoted(filename) + ":[" + String.join(",", nodes) + "]");
      }
      System.out.println("{" + String.join(",", files) + "}");
    } finally {
      Disposer.dispose(disposable);
    }
  }
}
