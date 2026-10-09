import { describe, it, expect } from 'vitest';
import { crearPartida, nuevaRonda } from './partida';
import { estadoDePrueba } from './estadoPrueba';
import { crearBaraja, barajarBaraja, rebarajarPilas } from "./baraja";
import type { EstadoPartida } from './types';

describe('crearPartida', () => {
  it('reparte 7 cartas a cada jugador, ninguna a reserva', () => {
    const partida = crearPartida();
    expect(partida.jugadores[0].mano).toHaveLength(7);
    expect(partida.jugadores[1].mano).toHaveLength(7);
    expect(partida.jugadores[0].reserva).toHaveLength(0);
    expect(partida.jugadores[1].reserva).toHaveLength(0);

  });

  it('pone una carta en cada pila', () => {
    const partida = crearPartida();
    expect(partida.pilas[0]).toHaveLength(1);
    expect(partida.pilas[1]).toHaveLength(1);
  });

  it('quedan 84 cartas en mazo', () => {
    const partida = crearPartida();
    expect(partida.mazo).toHaveLength(84);
  });

 it('el turno inicial es del jugador sorteado', () => {
    const partida = crearPartida();
    expect(partida.turno).toBe(partida.inicialRonda1);
  });


});

describe("nuevaRonda", () => {
  it("si era la última ronda, termina la partida", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba([], { palo: "p2", numero: 5 }),
      ronda: 3,
    };

    // 2. ACTUAR
    const nuevo = nuevaRonda(estado);

    // 3. COMPROBAR
    expect(nuevo.fase).toEqual({ tipo: "finPartida" });
  });
    it("de la ronda 1 pasa a la 2: reparte, conserva reservas y empieza el otro", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba([], { palo: "p2", numero: 5 }),
      mazo: crearBaraja(),          // 100 cartas en orden
      ronda: 1,
      inicialRonda1: 0,
      jugadores: [
        { mano: [], reserva: [{ palo: "p6", numero: 2 }] },  // reserva de la ronda 1
        { mano: [], reserva: [] },
      ],
    };

    // 2. ACTUAR
    const nuevo = nuevaRonda(estado);

    // 3. COMPROBAR
    expect(nuevo.ronda).toBe(2);
    expect(nuevo.jugadores[0].mano).toHaveLength(7);
    expect(nuevo.jugadores[1].mano).toHaveLength(7);
    expect(nuevo.mazo).toHaveLength(86);
    expect(nuevo.jugadores[0].reserva).toEqual([{ palo: "p6", numero: 2 }]); // no se pierde
    expect(nuevo.turno).toBe(1);   // ronda par: empieza el que NO empezó la 1
    expect(nuevo.fase).toEqual({ tipo: "jugando" });
  });

    it("si el mazo tiene menos de 14 cartas, rebaraja las pilas antes de repartir", () => {
    // 1. PREPARAR
    const cartas = crearBaraja(); // 100 cartas en orden, para fabricar trozos
    const estado: EstadoPartida = {
      ...estadoDePrueba([], { palo: "p2", numero: 5 }),
      ronda: 1,
      mazo: cartas.slice(0, 3),                      // solo 3 cartas: no llega a 14
      pilas: [cartas.slice(3, 23), cartas.slice(23, 43)], // 20 cartas en cada pila
    };

    // 2. ACTUAR
    const nuevo = nuevaRonda(estado);

    // 3. COMPROBAR
    expect(nuevo.jugadores[0].mano).toHaveLength(7);
    expect(nuevo.jugadores[1].mano).toHaveLength(7);
    expect(nuevo.pilas[0]).toHaveLength(1);   // solo queda la de arriba
    expect(nuevo.pilas[1]).toHaveLength(1);
    expect(nuevo.mazo).toHaveLength(27);
  });
});