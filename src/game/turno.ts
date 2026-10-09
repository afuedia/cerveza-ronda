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
import { nuevaRonda } from "./partida";
import { rebarajarPilas } from "./baraja";

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
  const jugadorActual = estado.jugadores[estado.turno];
  const idRival = estado.turno === 0 ? 1 : 0;
  const jugadorContrario = estado.jugadores[idRival];
  const carta = jugadorActual.mano[indice];
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
  const pilaJugada = estado.fase.pilaJugada;
  const otraPila = pilaJugada === 0 ? 1 : 0;
  const base = estado.mazo.length === 0 ? rebarajarPilas(estado) : estado;
  const jugadorActual = base.jugadores[base.turno];
  // ---------- ROBAR DEL MAZO ----------
  if (origen === "mazo") {
    const cartaMazo = base.mazo[base.mazo.length - 1];
    const mazoNuevo = base.mazo.slice(0, base.mazo.length - 1);
    const nuevaMano = [...jugadorActual.mano, cartaMazo];
    const jugadorNuevo = { ...jugadorActual, mano: nuevaMano };
    const jugadoresNuevos: [Jugador, Jugador] = [...base.jugadores];
    jugadoresNuevos[base.turno] = jugadorNuevo;
    return {
      ...base,
      mazo: mazoNuevo,
      jugadores: jugadoresNuevos,
      turno: base.turno === 0 ? 1 : 0,
      fase: { tipo: "jugando" },
    };
  }

  // ---------- ROBAR DE LA OTRA PILA ----------
  // (si llegamos aquí, el origen es 'pila')

  const pilaOrigen = base.pilas[otraPila];
  //    ↑            └ el ARRAY de la otra pila (primero eliges cuál)
  const cartaPila = pilaOrigen[pilaOrigen.length - 1];
  //    ↑           └ la carta de arriba de ese array
  const pilaOrigenNueva = pilaOrigen.slice(0, pilaOrigen.length - 1);
  //    ↑                 └ la pila sin su carta de arriba

  // Regla extra: si la pila se queda vacía, se repone con la de arriba del mazo
  let pilaFinal = pilaOrigenNueva;   // de partida, la pila tal como queda
  let mazoFinal = base.mazo;       // de partida, el mazo no cambia

  if (pilaOrigenNueva.length === 0) {
    const cartaReposicion = base.mazo[base.mazo.length - 1];
    pilaFinal = [cartaReposicion];
    //          └ una pila nueva con una sola carta: la que viene del mazo
    mazoFinal = base.mazo.slice(0, base.mazo.length - 1);
    //          └ y el mazo, sin esa carta
  }

  const nuevaMano = [...jugadorActual.mano, cartaPila];
  const jugadorNuevo = { ...jugadorActual, mano: nuevaMano };
  const jugadoresNuevos: [Jugador, Jugador] = [...base.jugadores];
  jugadoresNuevos[base.turno] = jugadorNuevo;

  const pilasNuevas: [Carta[], Carta[]] = [...base.pilas];
  pilasNuevas[otraPila] = pilaFinal;
  //          ↑           └ la pila después de robar (y reponer, si hizo falta)
  //          └ en la posición de la pila de la que robó

  return {
    ...base,
    mazo: mazoFinal,
    //    └ el mismo de antes, o con una carta menos si hubo que reponer
    pilas: pilasNuevas,
    jugadores: jugadoresNuevos,
    turno: base.turno === 0 ? 1 : 0,
    fase: { tipo: "jugando" },
  };
}

export function decidirCierre(estado: EstadoPartida, cerrar: boolean): EstadoPartida {
  if (estado.fase.tipo !== 'decidirCierre') {
    return estado
  }
  if (cerrar === false) {
    const turno = estado.turno;
    return {...estado,
            turno: turno === 0 ? 1 : 0,
            fase: { tipo: 'jugando'}
    }
  }
  // No necesito un nuevo condicional
  const jugador0 = estado.jugadores[0];
  const jugador1 = estado.jugadores[1];
  const estadoConReservas: EstadoPartida = {
  ...estado,
  jugadores: [
    { mano: [], reserva: [...jugador0.reserva, ...jugador0.mano] },
    { mano: [], reserva: [...jugador1.reserva, ...jugador1.mano] },
  ],
};
  return nuevaRonda(estadoConReservas)
    
 
}
