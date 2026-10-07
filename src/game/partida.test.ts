import { describe, it, expect } from 'vitest';
import { crearPartida } from './partida';

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