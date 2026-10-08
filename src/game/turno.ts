import type {
  Carta,
  Caso,
  EstadoPartida,
  PilaId,
  Jugador,
  Fase,
  JugadorId,
  OrigenRobo,
} from "./types";
import { calcularPuntos } from "./puntos";

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
    (_cartaMano, posicion) => posicion !== indice,
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

export function darCarta(estado: EstadoPartida, indice: number): EstadoPartida {
  // Quitar esa carta de la mano del jugador del turno
  const jugadorActual = estado.jugadores[estado.turno];
  const idRival = estado.turno === 0 ? 1 : 0;
  const jugadorContrario = estado.jugadores[idRival];
  const carta = jugadorActual.mano[indice];
  // Manos nuevas
  const manoActualNueva = jugadorActual.mano.filter(
    (_cartaMano, posicion) => posicion !== indice,
  );
  const manoRivalNueva = [...jugadorContrario.mano, carta];
  const jugadorNuevo = { ...jugadorActual, mano: manoActualNueva };
  const jugadorRivalNuevo = { ...jugadorContrario, mano: manoRivalNueva };
  const jugadoresNuevos: [Jugador, Jugador] = [...estado.jugadores];
  jugadoresNuevos[estado.turno] = jugadorNuevo;
  jugadoresNuevos[idRival] = jugadorRivalNuevo;

  return {
    ...estado,
    jugadores: jugadoresNuevos,
    turno: idRival,
    fase: { tipo: "jugando" },
  };
}

export function robar(
  estado: EstadoPartida,
  origen: OrigenRobo,
): EstadoPartida {
  if (estado.fase.tipo !== "elegirRobo") {
    return estado;
  }

  const jugadorActual = estado.jugadores[estado.turno];

  const pilaJugada = estado.fase.pilaJugada;
  const otraPila = pilaJugada === 0 ? 1 : 0;

  if (origen === "mazo") {
    const cartaMazo = estado.mazo[estado.mazo.length - 1];
    const mazoNuevo = estado.mazo.slice(0, estado.mazo.length - 1);
    const nuevaMano = [...jugadorActual.mano, cartaMazo];
    const jugadorNuevo = { ...jugadorActual, mano: nuevaMano };
    const jugadoresNuevos: [Jugador, Jugador] = [...estado.jugadores];
    jugadoresNuevos[estado.turno] = jugadorNuevo;
    return {
      ...estado,
      mazo: mazoNuevo,
      jugadores: jugadoresNuevos,
      turno: estado.turno === 0 ? 1 : 0,
      fase: { tipo: "jugando" },
    };
  }
  return estado; // provisional: aquí irá el robo de la pila
}
