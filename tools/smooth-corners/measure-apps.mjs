// Matched minimal native release apps. No publishing, signing identities, consumer
// dependency changes, installation, or device execution. Run under native_builds:1.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, copyFileSync, cpSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';
const root=process.cwd(),out=resolve('tmp/smooth-corners/size-apps');mkdirSync(out,{recursive:true});
function run(cmd,args,options={}) {const r=spawnSync(cmd,args,{encoding:'utf8',maxBuffer:32*1024*1024,...options});if(r.error)throw r.error;if(r.status!==0)throw Error(`${cmd}: ${r.stdout}\n${r.stderr}`);return r.stdout;}
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const result={settings:{ios:'arm64 iOS Simulator 15.6; Objective-C -Os; Swift link -O; dead_strip; ObjC; unsigned',android:'AGP 8.11.1; arm64-v8a; compile/target 36, min 21; Java 17; release, minifyEnabled false; unsigned'},artifacts:[]};
const ios=resolve('dist/native/mason-core/ios-host/release');
const sdk=run('xcrun',['--sdk','iphonesimulator','--show-sdk-path']).trim();
const triple='arm64-apple-ios15.6-simulator';
const source=resolve(out,'main.m');
writeFileSync(source,`@import UIKit;
@import MasonCore;
@import MasonCore.Swift;
@interface CornerAppDelegate : UIResponder <UIApplicationDelegate>
@property(nonatomic,strong) UIWindow *window;
@property(nonatomic,strong) NSCMason *mason;
@end
@implementation CornerAppDelegate
- (BOOL)application:(UIApplication *)app didFinishLaunchingWithOptions:(NSDictionary *)opts {
 self.mason=[NSCMason new];
 MasonUIView *view=[self.mason createView];
 [view mason_computeWithSize:240 :120];
 UIViewController *controller=[UIViewController new];controller.view=view;
 self.window=[[UIWindow alloc] initWithFrame:UIScreen.mainScreen.bounds];
 self.window.rootViewController=controller;[self.window makeKeyAndVisible];return YES;
}
@end
int main(int argc,char **argv) { @autoreleasepool {return UIApplicationMain(argc,argv,nil,NSStringFromClass(CornerAppDelegate.class));} }
`);
const object=resolve(out,'main.o');
run('xcrun',['clang','-isysroot',sdk,'-target',triple,'-F',ios,'-I',resolve(ios,'include'),'-fmodules','-fno-autolink','-fobjc-arc','-Os','-c',source,'-o',object]);
for(const variant of ['baseline','smooth']) {
 const folder=resolve(out,variant);mkdirSync(folder,{recursive:true});
 const app=resolve(folder,'Corner.app');mkdirSync(app,{recursive:true});
 writeFileSync(resolve(app,'Info.plist'),`<?xml version="1.0"?><plist version="1.0"><dict><key>CFBundleIdentifier</key><string>org.nativescript.mason.cornersize</string><key>CFBundleExecutable</key><string>Corner</string><key>CFBundleName</key><string>Corner</string><key>CFBundlePackageType</key><string>APPL</string><key>CFBundleVersion</key><string>1</string><key>CFBundleShortVersionString</key><string>1.0</string><key>MinimumOSVersion</key><string>15.6</string></dict></plist>`);
 const engine=variant==='baseline'?resolve('tmp/smooth-corners/baseline/ios-host.a'):resolve(ios,'MasonCore.framework/MasonCore');
 run('xcrun',['swiftc','-sdk',sdk,'-target',triple,'-O',object,engine,resolve(ios,'dependencies/FontManager/libFontManager.a'),'-framework','UIKit','-framework','CoreText','-framework','CoreGraphics','-framework','QuartzCore','-framework','CoreImage','-liconv','-lresolv','-Xlinker','-dead_strip','-Xlinker','-ObjC','-o',resolve(app,'Corner')]);
 run('xcrun',['strip','-S',resolve(app,'Corner')]);
 const binary=resolve(app,'Corner');result.artifacts.push({platform:'ios-simulator',variant,bytes:statSync(binary).size,sha256:hash(binary),engineSha256:hash(engine)});
}
const stage=resolve(out,'android');mkdirSync(resolve(stage,'app/src/main/java/org/nativescript/cornersize'),{recursive:true});
const write=(path,text)=>writeFileSync(resolve(stage,path),text);
write('settings.gradle',`pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { google(); mavenCentral() } }
rootProject.name='CornerSize';include ':app'`);
write('build.gradle',`plugins { id 'com.android.application' version '8.11.1' apply false }`);
write('gradle.properties','android.useAndroidX=true\norg.gradle.jvmargs=-Xmx2048m\n');
write('local.properties',`sdk.dir=${process.env.ANDROID_HOME??resolve(homedir(),'Library/Android/sdk')}\n`);
write('app/build.gradle',`plugins { id 'com.android.application' }
android { namespace 'org.nativescript.cornersize'; compileSdk 36
 defaultConfig { applicationId 'org.nativescript.cornersize'; minSdk 21; targetSdk 36; versionCode 1; versionName '1.0'; ndk { abiFilters 'arm64-v8a' } }
 buildTypes { release { minifyEnabled false } }
 compileOptions { sourceCompatibility JavaVersion.VERSION_17; targetCompatibility JavaVersion.VERSION_17 }
}
dependencies { implementation files('MasonCore.aar'); implementation 'androidx.core:core-ktx:1.12.0'; implementation 'com.google.code.gson:gson:2.13.2'; implementation 'com.github.bumptech.glide:glide:4.16.0'; implementation 'org.nativescript:fontmanager:1.0.20' }
`);
write('app/src/main/AndroidManifest.xml','<manifest xmlns:android="http://schemas.android.com/apk/res/android"><application android:label="Corner size"><activity android:name=".MainActivity" android:exported="true"><intent-filter><action android:name="android.intent.action.MAIN"/><category android:name="android.intent.category.LAUNCHER"/></intent-filter></activity></application></manifest>');
write('app/src/main/java/org/nativescript/cornersize/MainActivity.java',`package org.nativescript.cornersize;
public class MainActivity extends android.app.Activity {
 private org.nativescript.mason.masonkit.Mason mason;
 @Override public void onCreate(android.os.Bundle state) {super.onCreate(state);mason=new org.nativescript.mason.masonkit.Mason();setContentView(mason.createView(this));}
}`);
const gradle=resolve('packages/nativescript-masonkit/src-native/mason-android');cpSync(resolve(gradle,'gradle'),resolve(stage,'gradle'),{recursive:true});copyFileSync(resolve(gradle,'gradlew'),resolve(stage,'gradlew'));
const javaHome=run('/usr/libexec/java_home',['-v','21']).trim();
for(const variant of ['baseline','smooth']) {
 const aar=variant==='baseline'?resolve('tmp/smooth-corners/baseline/MasonCore.aar'):resolve('dist/native/mason-core/android-host/MasonCore.aar');
 copyFileSync(aar,resolve(stage,'app/MasonCore.aar'));
 run('bash',['gradlew','--no-daemon','--max-workers=2',':app:clean',':app:assembleRelease'],{cwd:stage,env:{...process.env,JAVA_HOME:javaHome}});
 const apk=resolve(out,variant,'Corner-unsigned.apk');copyFileSync(resolve(stage,'app/build/outputs/apk/release/app-release-unsigned.apk'),apk);
 result.artifacts.push({platform:'android',variant,bytes:statSync(apk).size,sha256:hash(apk),aarSha256:hash(aar)});
}
writeFileSync(resolve(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
