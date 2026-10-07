import type { Carta, Caso, EstadoPartida, PilaId, Jugador, Fase, JugadorId } from "./types";
import { calcularPuntos } from './puntos';

export function determinarCaso(jugada: Carta, cima: Carta): Caso {
  if (jugada.palo === cima.palo || jugada.numero === cima.numero) {
    return "coincide";
  } else if (jugada.numero > cima.numero) {
    return "mayor";
  } else {
    return "menor";
  }
}

export function jugarCarta(
  estado: EstadoPartida,
  indice: number,
  pila: PilaId,
): EstadoPartida {
  const jugadorActual = estado.jugadores[estado.turno];
  const carta = jugadorActual.mano[indice];
  const pilaElegida = estado.pilas[pila];
  const cima = pilaElegida[pilaElegida.length - 1];
  const caso = determinarCaso(carta, cima);
  const manoNueva = jugadorActual.mano.filter(
    (cartaMano, posicion) => posicion !== indice,
  );
  const pilaNueva = [...pilaElegida, carta];
  const jugadorNuevo = { ...jugadorActual, mano: manoNueva };
  const jugadoresNuevos: [Jugador, Jugador] = [...estado.jugadores];
  jugadoresNuevos[estado.turno] = jugadorNuevo;
  const pilasNuevas: [Carta[], Carta[]] = [...estado.pilas];
  pilasNuevas[pila] = pilaNueva;
  let faseNueva: Fase = { tipo: "jugando" };
  let turnoNuevo: JugadorId = estado.turno;
  if (caso === "coincide") {
    faseNueva = { tipo: "elegirCartaParaDar" };
  } else if (caso === "mayor") {
    faseNueva = { tipo: "elegirRobo", pilaJugada: pila };
  } else {
    if (calcularPuntos(manoNueva) <= 3) {
      faseNueva = { tipo: "decidirCierre" };
    } else {
      turnoNuevo = estado.turno === 0 ? 1 : 0;
    }
  }
  return {
    ...estado,
    jugadores: jugadoresNuevos,
    pilas: pilasNuevas,
    fase: faseNueva,
    turno: turnoNuevo,
  };
}
