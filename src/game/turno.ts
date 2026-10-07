import type { Carta, Caso, EstadoPartida, PilaId, Jugador } from "./types";

export function determinarCaso(jugada: Carta, cima: Carta): Caso {
  if (jugada.palo === cima.palo || jugada.numero === cima.numero) {
    return "coincide";
  } else if (jugada.numero > cima.numero) {
    return "mayor";
  } else {
    return "menor";
  }
}

export function jugarCarta(estado: EstadoPartida, indice: number, pila: PilaId): EstadoPartida {
  const jugadorActual = estado.jugadores[estado.turno];
 
  const carta = jugadorActual.mano[indice];

  const manoNueva = jugadorActual.mano.filter((cartaMano, posicion) => posicion !== indice);

  const pilaNueva = [...estado.pilas[pila], carta];

  const jugadorNuevo = { ...jugadorActual, mano: manoNueva };

  const jugadoresNuevos: [Jugador, Jugador] = [...estado.jugadores];


  jugadoresNuevos[estado.turno] = jugadorNuevo;

  const pilasNuevas: [Carta[], Carta[]] = [...estado.pilas];

  pilasNuevas[pila] = pilaNueva;

  return { ...estado, jugadores: jugadoresNuevos, pilas: pilasNuevas };


  }