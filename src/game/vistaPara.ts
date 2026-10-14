import type { EstadoPartida, JugadorId, VistaJugador } from "./types";
import { calcularGanador, calcularPuntos } from "./puntos";

export function vistaPara(estado: EstadoPartida, jugador: JugadorId): VistaJugador {
  const idRival = jugador === 0 ? 1 : 0;
  const yo = estado.jugadores[jugador];
  const rival = estado.jugadores[idRival];
  const [pilaA, pilaB] = estado.pilas;

  return {
    yo: jugador,
    miMano: [...yo.mano],
    miReserva: [...yo.reserva],
    rival: {
      cartasEnMano: rival.mano.length,
      cartasEnReserva: rival.reserva.length,
    },
    cimas: [pilaA[pilaA.length - 1], pilaB[pilaB.length - 1]],
    cartasEnMazo: estado.mazo.length,
    ronda: estado.ronda,
    turno: estado.turno,
    fase: estado.fase,
    resultado:
      estado.fase.tipo === "finPartida"
        ? {
            puntos: [
              calcularPuntos(estado.jugadores[0].reserva),
              calcularPuntos(estado.jugadores[1].reserva),
            ],
            ganador: calcularGanador(estado),
          }
        : null,
  };
}