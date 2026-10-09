import type { Carta, EstadoPartida } from "./types";

export function estadoDePrueba(mano: Carta[], cima: Carta): EstadoPartida {
  return {
    mazo: [],
    pilas: [[cima], [{ palo: "p10", numero: 10 }]],
    jugadores: [
      { mano: mano, reserva: [] }, // jugador 0: el que juega
      { mano: [{ palo: "p9", numero: 9 }], reserva: [] }, // jugador 1: da igual
    ],
    ronda: 1,
    turno: 0, // siempre le toca al jugador 0
    inicialRonda1: 0,
    fase: { tipo: "jugando" },
  };
}