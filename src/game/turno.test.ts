import { describe, it, expect } from 'vitest';
import { determinarCaso } from './turno';

describe('determinarCaso', () => {
  it('coincide si son del mismo palo, aunque el número sea mayor', () => {
    expect(determinarCaso(
      { palo: 'p3', numero: 9 },   // la jugada
      { palo: 'p3', numero: 1 },   // la cima
    )).toBe('coincide');
  });

  it('coincide si tienen el mismo número y distinto palo', () => {
    expect(determinarCaso(
      { palo: 'p4', numero: 9 },   // la jugada
      { palo: 'p3', numero: 9 },   // la cima
    )).toBe('coincide');
  });

  it('da mayor si es de distinto palo y número mayor', () => {
    expect(determinarCaso(
      { palo: 'p4', numero: 9 },   // la jugada
      { palo: 'p3', numero: 8 },   // la cima
    )).toBe('mayor');
  });

  it('da menor si es de distinto palo y número menor', () => {
    expect(determinarCaso(
      { palo: 'p4', numero: 7 },   // la jugada
      { palo: 'p5', numero: 8 },   // la cima
    )).toBe('menor');
  });
});