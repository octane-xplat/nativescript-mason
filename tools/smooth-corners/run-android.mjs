// Run under a goddard resource reservation for android:elegant-fir-probe + resident_devices:1.
// No device creation, cloning, erasure, or image installation.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, openSync, closeSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';
const sdk=process.env.ANDROID_HOME ?? resolve(homedir(),'Library/Android/sdk');
const adb=resolve(sdk,'platform-tools/adb'), emulator=resolve(sdk,'emulator/emulator');
const avd='elegant-fir-probe';
const all=process.argv.includes('--all');
const consumer=process.argv.includes('--consumer');
const expected=all?27:3;
function run(cmd,args,timeout=30000) {
  const r=spawnSync(cmd,args,{encoding:'utf8',timeout,maxBuffer:16*1024*1024});
  if(r.error) throw r.error;
  assert.equal(r.status,0,`${cmd}: ${r.stdout}\n${r.stderr}`);return r.stdout;
}
assert.ok(run(emulator,['-list-avds']).trim().split(/\r?\n/).includes(avd),'Required AVD missing; refusing to create or substitute');
const output=resolve('tmp/smooth-corners/android-run',String(Date.now()));mkdirSync(output,{recursive:true});
const active=run(adb,['devices']).split(/\r?\n/).filter(s=>s.startsWith('emulator-')).map(s=>s.split(/\s/)[0]);
assert.ok(active.length<=1,'More than one emulator is running');
let serial=active[0] ?? 'emulator-5554', child,fd;
if(active.length) assert.ok(run(adb,['-s',serial,'emu','avd','name']).split(/\r?\n/).includes(avd),'Another AVD is running; refusing a second emulator');
try {
  if(!active.length) {
    fd=openSync(resolve(output,'emulator.log'),'w');
    child=spawn(emulator,['-avd',avd,'-port','5554','-no-window','-no-audio','-no-boot-anim','-no-snapshot-load','-no-snapshot-save','-gpu','swiftshader_indirect'],{stdio:['ignore',fd,fd]});
    let failure;child.on('error',e=>failure=e);
    const deadline=Date.now()+180000;
    while(Date.now()<deadline) {
      if(failure) throw failure;
      if(child.exitCode!==null) throw Error(`Emulator exited: ${child.exitCode}`);
      const r=spawnSync(adb,['-s',serial,'shell','getprop','sys.boot_completed'],{encoding:'utf8',timeout:10000});
      if(r.status===0 && r.stdout.trim()==='1') break;
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
  }
  assert.equal(run(adb,['-s',serial,'shell','getprop','sys.boot_completed']).trim(),'1');
  if(consumer) {
    const result=spawnSync(process.execPath,[resolve('tools/mason-core/run-android-consumer.mjs')],{encoding:'utf8',timeout:180000,maxBuffer:16*1024*1024,env:{...process.env,MASON_CORE_ANDROID_AVD:avd,MASON_CORE_ANDROID_EMULATOR_SERIAL:serial}});
    writeFileSync(resolve(output,'consumer.log'),`${result.stdout ?? ''}\n${result.stderr ?? ''}`);
    if(result.error) throw result.error;
    assert.equal(result.status,0,`${result.stdout}\n${result.stderr}`);
    console.log(result.stdout.trim());
  } else {
  run(adb,['-s',serial,'install','-r','-t',resolve('dist/native/mason-core/android-host/tests/MasonCore-tests.apk')],120000);
  const text=run(adb,['-s',serial,'shell','am','instrument','-w',...(all?[]:['-e','class','org.nativescript.mason.masonkit.MasonCoreHostInstrumentedTest#smoothCornersUpdateResizeResetAndOwnership,org.nativescript.mason.masonkit.MasonCoreHostInstrumentedTest#smoothCornersOverflowHitRegionsAndClipOwnership,org.nativescript.mason.masonkit.MasonCoreHostInstrumentedTest#smoothCornersRepeatedUpdates']),'org.nativescript.mason.masonkit.test/androidx.test.runner.AndroidJUnitRunner'],240000);
  writeFileSync(resolve(output,'instrumentation.log'),text);console.log(text);
  writeFileSync(resolve(output,'timing.log'),run(adb,['-s',serial,'logcat','-d','-s','SmoothCorners:I','*:S']));
  assert.ok(text.includes(`OK (${expected} tests)`));assert.doesNotMatch(text,/FAILURES!!!|INSTRUMENTATION_FAILED/);
  writeFileSync(resolve(output,'summary.json'),JSON.stringify({avd,serial,passed:expected,evidence:'Native instrumentation and synthetic MotionEvent checks; no OS input or pixel qualification'},null,2));
  console.log(output);
  }
} finally {
  if(child) {spawnSync(adb,['-s',serial,'emu','kill'],{timeout:10000});await new Promise(resolve=>{if(child.exitCode!==null)return resolve();const timer=setTimeout(()=>{child.kill('SIGKILL');resolve();},10000);child.once('exit',()=>{clearTimeout(timer);resolve();});});}
  if(fd!==undefined)closeSync(fd);
}
