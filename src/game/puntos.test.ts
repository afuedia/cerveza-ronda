import { describe, it, expect } from 'vitest';
import { calcularPuntos } from "./puntos";

describe('calcularPuntos', () => {
  it('da 0 puntos sin cartas', () => {
    expect(calcularPuntos([])).toBe(0);
  });

  it('da el número de la carta si solo hay una', () => {
    expect(calcularPuntos([{ palo: 'p1', numero: 7 }])).toBe(7);
  });

  it('con varias cartas del mismo palo, cuenta solo la más baja', () => {
    expect(calcularPuntos([
      { palo: 'p2', numero: 8 },
      { palo: 'p2', numero: 6 },
      { palo: 'p2', numero: 1 },
    ])).toBe(1);
  });

  it('con varias cartas de distintos palos, suma solo la más baja de cada uno', () => {
    expect(calcularPuntos([
      { palo: 'p2', numero: 8 },
      { palo: 'p2', numero: 3 },
      { palo: 'p3', numero: 8 },
      { palo: 'p3', numero: 6},
    ])).toBe(9);
  });
});

