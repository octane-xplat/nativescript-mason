import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir, tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { workspaceRoot } from './sources.mjs';
import { androidTools, run } from './build-native.mjs';

const input = resolve(workspaceRoot, 'dist/native/mason-core/android-host');
const temporary = mkdtempSync(resolve(tmpdir(), 'mason-core-android-client-'));
const hash = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
try {
  const aar = resolve(temporary, 'MasonCore.aar');
  copyFileSync(resolve(input, 'MasonCore.aar'), aar);
  const manifest = JSON.parse(readFileSync(resolve(input, 'manifest.json'), 'utf8'));
  assert.equal(hash(aar), manifest.aarSha256);
  const artifact = resolve(temporary, 'artifact');
  run('unzip', ['-q', aar, '-d', artifact], { stdio: 'pipe' });
  const classes = resolve(artifact, 'classes.jar');
  const javaHome = process.env.MASON_CORE_JAVA_HOME ?? run('/usr/libexec/java_home', ['-v', '21'], { stdio: 'pipe' }).trim();
  const names = run(resolve(javaHome, 'bin/jar'), ['tf', classes], { stdio: 'pipe' }).split('\n');
  for (const name of ['HTMLParser', 'TextEngine', 'TextView', 'TextNode', 'TextContainer', 'Document', 'Input', 'TextArea', 'Img', 'Button', 'Br', 'Li', 'ListView', 'Details']) {
    assert.ok(!names.some((file) => new RegExp(`/masonkit/${name}(?:\\$|\\.class$)`).test(file)), `Optional Android class linked into core: ${name}`);
  }
  for (const name of ['Mason', 'View', 'Scroll', 'Node', 'Style', 'InlineSegment']) {
    assert.ok(names.includes(`org/nativescript/mason/masonkit/${name}.class`), `Missing Android core class ${name}`);
  }
  assert.doesNotMatch(readFileSync(resolve(artifact, 'AndroidManifest.xml'), 'utf8'), /<activity\b|PseudoDemoActivity/);
  const native = resolve(artifact, 'jni/arm64-v8a/libmasonnative.so');
  const original = resolve(workspaceRoot, 'dist/native/mason-core/android-jni/arm64-v8a/libmasonnative.so');
  assert.equal(hash(original), manifest.jni.librarySha256);
  // AGP strips release JNI binaries. Prove that its output differs from the
  // recorded input only by the NDK's normal strip operation.
  const stripped = resolve(temporary, 'libmasonnative.so');
  copyFileSync(original, stripped);
  const tools = androidTools();
  run(resolve(tools.bin, 'llvm-strip'), ['--strip-unneeded', stripped], { stdio: 'pipe' });
  assert.equal(hash(native), hash(stripped));
  assert.match(run(tools.nm, ['-D', '--defined-only', native], { stdio: 'pipe' }), /\bJNI_OnLoad$/m);

  // Copy the exact resolved compile artifacts before compiling outside the repo.
  const dependencies = JSON.parse(readFileSync(resolve(workspaceRoot, 'tmp/mason-core-android-host/dependencies.json'), 'utf8'));
  const classpath = [classes];
  for (const [index, dependency] of dependencies.compileArtifacts.entries()) {
    const destination = resolve(temporary, `dependency-${index}`);
    mkdirSync(destination);
    if (dependency.file.endsWith('.aar')) {
      run('unzip', ['-q', dependency.file, 'classes.jar', '-d', destination], { stdio: 'pipe' });
      classpath.push(resolve(destination, 'classes.jar'));
    } else {
      const jar = resolve(destination, 'dependency.jar');
      copyFileSync(dependency.file, jar);
      classpath.push(jar);
    }
  }
  const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT ?? resolve(homedir(), 'Library/Android/sdk');
  classpath.push(resolve(sdk, 'platforms/android-36/android.jar'));
  const declarations = run(resolve(javaHome, 'bin/javap'), ['-public', '-classpath', classpath.join(':'), 'org.nativescript.mason.masonkit.Mason', 'org.nativescript.mason.masonkit.Node', 'org.nativescript.mason.masonkit.Element'], { stdio: 'pipe' });
  assert.doesNotMatch(declarations, /\b(?:createTextView|createTextNode|createImageView|createButton|createInput|getHtmlParser|getInnerHTML|setInnerHTML)\b/);
  const consumer = resolve(temporary, 'CoreConsumer.java');
  writeFileSync(consumer, `import android.content.Context;
import org.nativescript.mason.masonkit.Mason;
import org.nativescript.mason.masonkit.View;
import org.nativescript.mason.masonkit.Scroll;
import org.nativescript.mason.masonkit.enums.Display;
public class CoreConsumer {
  public static View create(Context context) {
    Mason engine = new Mason();
    View container = engine.createView(context);
    container.getStyle().setDisplay(Display.Flex);
    container.appendView(new android.widget.TextView(context));
    Scroll scroll = engine.createScrollView(context);
    container.appendView(scroll);
    return container;
  }
}
`);
  run(resolve(javaHome, 'bin/javac'), ['-proc:none', '-source', '17', '-target', '17', '-classpath', classpath.join(':'), '-d', temporary, consumer], { cwd: temporary, stdio: 'pipe' });
  console.log('An isolated Java Android client compiles against the core AAR and its resolved dependencies.');
  console.log('The core class graph excludes HTML parsing, rich-text rendering and widgets; Android execution remains required.');
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
