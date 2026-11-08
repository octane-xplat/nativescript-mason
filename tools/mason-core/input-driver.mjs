import assert from 'node:assert/strict';

/** Deliver each app-reported phase once; backend adapters own the OS input API. */
export function driveInputStep(ready, platform, actions, deliver) {
  assert.equal(ready.version, 1);
  assert.equal(ready.platform, platform);
  assert.ok(Number.isFinite(ready.density) && ready.density > 0);
  // 'blocked' and 'dismiss' are the iOS-only keyboard-dismissal drags: the
  // first must be refused by the scroll gate, the second must track the
  // keyboard. Phases arrive in this order and each is delivered exactly once.
  const order = ['tap', 'scroll', 'blocked', 'dismiss'];
  assert.ok(order.includes(ready.phase));
  if (actions.some(({ phase }) => phase === ready.phase)) return;
  assert.equal(ready.phase, order[actions.length]);
  const point = (value) => {
    assert.ok(value && Number.isFinite(value.x) && Number.isFinite(value.y));
    assert.ok(value.x >= 0 && value.y >= 0, 'The owned app reported an offscreen input target.');
    return platform === 'android'
      ? { x: Math.round(value.x * ready.density), y: Math.round(value.y * ready.density) }
      : value;
  };
  const action = ready.phase === 'tap'
    ? { phase: 'tap', point: point(ready.point) }
    : { phase: ready.phase, from: point(ready.from), to: point(ready.to) };
  deliver(action);
  actions.push(action);
}
