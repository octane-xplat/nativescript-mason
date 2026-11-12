import { expect, it } from 'vitest';
import { createPaintPresentation, recordPaintWrite } from '../../packages/nativescript-mason-core/paint-presentation';

it('corrects native presentation without touching authored style, then restores the base', () => {
  const owner = {};
  const authored = { borderRadius: 20, boxShadow: '0px 4px 12px black' };
  const paint = { borderRadius: '20', boxShadow: authored.boxShadow };
  const handle = createPaintPresentation(owner, () => paint);
  handle.write({ borderRadius: '40', boxShadow: '0px 8px 24px black' });
  expect(paint.borderRadius).toBe('40');
  expect(authored.borderRadius).toBe(20);
  expect(handle.read().borderRadius).toBe('20');
  handle.write({ borderRadius: '80' });
  expect(paint.boxShadow).toBe(authored.boxShadow);
  expect(handle.read().borderRadius).toBe('20');
  handle.clear();
  expect(paint.borderRadius).toBe('20');
  handle.dispose();
  handle.dispose();
  expect(() => handle.write({ borderRadius: '60' })).toThrow(/disposed/);
});

it('retains a concurrent authored paint update and permits reacquisition after disposal', () => {
  const owner = {},
    paint = { borderRadius: '20', boxShadow: 'none' };
  const handle = createPaintPresentation(owner, () => paint);
  expect(() => createPaintPresentation(owner, () => paint)).toThrow(/owner/);
  handle.write({ borderRadius: '40' });
  paint.borderRadius = '30';
  expect(handle.read().borderRadius).toBe('30');
  handle.write({ borderRadius: '60' });
  handle.dispose();
  expect(paint.borderRadius).toBe('30');
  const next = createPaintPresentation(owner, () => paint);
  expect(next.read().borderRadius).toBe('30');
  next.dispose();
});

it('preserves authored writes equal to the displayed correction', () => {
  let radius = '20';
  const paint = {
    get borderRadius() {
      return radius;
    },
    set borderRadius(value: string) {
      recordPaintWrite(paint, 'borderRadius');
      radius = value;
    },
    boxShadow: 'none',
  };
  const handle = createPaintPresentation({}, () => paint);
  handle.write({ borderRadius: '40' });
  paint.borderRadius = '40';
  expect(handle.read().borderRadius).toBe('40');
  handle.clear();
  expect(paint.borderRadius).toBe('40');
  handle.dispose();
});
