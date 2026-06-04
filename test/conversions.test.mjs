import { describe, it, expect } from 'vitest';
import conv, { convertIngredient } from '../src/utils/conversions.js';

describe('conversion utilities', () => {
  it('converts 1 cup all-purpose flour to ~120 g', () => {
    const flour = { item: 'all-purpose flour', qty: 1, unit: 'cup' };
    const r1 = convertIngredient(flour, 1);
    expect(r1.unit).toBe('g');
    expect(String(r1.qty)).toBe('120');
  });

  it('converts 1 cup milk to 240 g', () => {
    const milk = { item: 'milk', qty: 1, unit: 'cup' };
    const r2 = convertIngredient(milk, 1);
    expect(r2.unit).toBe('g');
    expect(String(r2.qty)).toBe('240');
  });

  it('converts 2 tbsp sugar to 30 g', () => {
    const sugar = { item: 'granulated sugar', qty: 2, unit: 'tbsp' };
    const r3 = convertIngredient(sugar, 2);
    expect(r3.unit).toBe('g');
    expect(String(r3.qty)).toBe('30');
  });

  it('handles eggs as each', () => {
    const eggs = { item: 'egg', qty: 2, unit: 'unit' };
    const r4 = convertIngredient(eggs, 2);
    expect(r4.unit).toBe('each');
    expect(String(r4.qty)).toBe('2');
  });

  it('handles large scales', () => {
    const flour = { item: 'all-purpose flour', qty: 1, unit: 'cup' };
    const r5 = convertIngredient(flour, 1000);
    expect(r5.unit).toBe('g');
    expect(String(r5.qty)).toBe('120000');
  });
});
