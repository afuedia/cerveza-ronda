import { describe, it, expect } from 'vitest';
import { crearPartida } from './partida';
import { determinarCaso, jugarCarta } from './turno';

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

describe('jugarCarta', () => {
  it('quita la carta de la mano del jugador', () => {
    const estado = crearPartida();
    const nuevo = jugarCarta(estado, 0, 0);
    expect(nuevo.jugadores[estado.turno].mano).toHaveLength(6);
  });
    it('pone la carta jugada arriba de la pila', () => {
    const estado = crearPartida();
    const cartaJugada = estado.jugadores[estado.turno].mano[0];
    //    ↑
    //    └ la guardamos ANTES de jugar, para saber cuál era

    const nuevo = jugarCarta(estado, 0, 0);
    const pila = nuevo.pilas[0];

    expect(pila[pila.length - 1]).toEqual(cartaJugada);
    //     ↑                      ↑
    //     │                      └ mismo contenido: toEqual, porque es un objeto
    //     └ la última carta de la pila, la de arriba
  });

  it('la pila tiene una carta más', () => {
    const estado = crearPartida();
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.pilas[0]).toHaveLength(2);
  });

  it('no modifica el estado original', () => {
    const estado = crearPartida();
    jugarCarta(estado, 0, 0);
    //↑
    //└ la llamamos, pero no guardamos el resultado: solo miramos el original

    expect(estado.jugadores[estado.turno].mano).toHaveLength(7);
    expect(estado.pilas[0]).toHaveLength(1);
  });
});