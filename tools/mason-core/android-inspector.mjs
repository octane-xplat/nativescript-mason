import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/** Check the real inspector of the already owned, running consumer app. */
export async function qualifyAndroidInspector(device, output, applicationId) {
  const port = device(['forward', 'tcp:0', `localabstract:${applicationId}-inspectorServer`]).trim();
  assert.match(port, /^\d+$/);
  const socket = new WebSocket(`ws://127.0.0.1:${port}/`);
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data));
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Inspector timed out: ${method}`)); }, 10000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('The owned Android inspector did not connect.')), 10000);
      socket.addEventListener('open', () => { clearTimeout(timer); resolve(); }, { once: true });
      socket.addEventListener('error', (event) => {
        clearTimeout(timer);
        reject(new Error(`The owned Android inspector connection failed: ${event.error?.message ?? event.message ?? 'WebSocket error'}`));
      }, { once: true });
    });
    await command('Runtime.enable');
    await command('Runtime.runIfWaitingForDebugger');
    const evaluation = await command('Runtime.evaluate', {
      expression: '({ dispatcher: typeof globalThis.__registerDomainDispatcher, inspector: typeof globalThis.__inspector })',
      returnByValue: true,
    });
    assert.equal(evaluation.exceptionDetails, undefined);
    assert.deepEqual(evaluation.result.value, { dispatcher: 'function', inspector: 'object' });
    const document = await command('DOM.getDocument');
    assert.ok(document.root, 'Core inspector modules did not register their DOM dispatcher.');
    writeFileSync(resolve(output, 'inspector.json'), JSON.stringify({
      passed: true, globals: evaluation.result.value,
      documentRootType: typeof document.root,
      evidence: 'Real Android inspector WebSocket; Runtime evaluation and the NativeScript DOM dispatcher respond after attachment.',
    }, null, 2) + '\n');
  } finally {
    for (const request of pending.values()) clearTimeout(request.timer);
    socket.close();
    device(['forward', '--remove', `tcp:${port}`]);
  }
}
