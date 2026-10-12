import type {
  Carta,
  Caso,
  EstadoPartida,
  JugadorId,
  PilaId,
  Jugador,
  OrigenRobo,
} from "./types";
import { calcularPuntos } from "./puntos";
import { cerrarRonda } from "./partida";
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

function robarDelMazo(estado: EstadoPartida, jugador: JugadorId): EstadoPartida {

let base = estado;
  if (estado.mazo.length === 0) {
  base = rebarajarPilas(estado);
} 

const cartaMazo = base.mazo[base.mazo.length - 1];
const mazoNuevo = base.mazo.slice(0, base.mazo.length - 1);
const jugadorQueRoba = base.jugadores[jugador];

const nuevaMano = [...jugadorQueRoba.mano, cartaMazo];
const jugadorNuevo = { ...jugadorQueRoba, mano: nuevaMano };
const jugadoresNuevos: [Jugador, Jugador] = [...base.jugadores];
jugadoresNuevos[jugador] = jugadorNuevo;

return { ...base, mazo: mazoNuevo, jugadores: jugadoresNuevos };
}


export function jugarCarta(
  estado: EstadoPartida,
  indice: number,
  pila: PilaId,
): EstadoPartida {
  
  if (estado.fase.tipo !== "jugando") {
  return estado;
}
  const jugadorActual = estado.jugadores[estado.turno];
 
  if (indice < 0 || indice >= jugadorActual.mano.length) {
  return estado;
}

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
  
  const conCartaJugada: EstadoPartida = {
    ...estado,
    jugadores: jugadoresNuevos,
    pilas: pilasNuevas,
  };

  if (caso === "coincide") {
    if (manoNueva.length === 0) {
      return terminarTurno(robarDelMazo(conCartaJugada, estado.turno === 0 ? 1 : 0))
    }
    return { ...conCartaJugada, fase: { tipo: "elegirCartaParaDar" } };
  }
  if (caso === "mayor") {
    return { ...conCartaJugada, fase: { tipo: "elegirRobo", pilaJugada: pila } };
  }
  if (manoNueva.length === 0) {
    return terminarTurno(conCartaJugada)
  } 
  if (calcularPuntos(manoNueva) <=3) {
    return {...conCartaJugada,
            fase: {tipo: "decidirCierre"}
            }
  } 
  return terminarTurno(conCartaJugada);
}

export function darCarta(estado: EstadoPartida, indice: number): EstadoPartida {
  if (estado.fase.tipo !== "elegirCartaParaDar") {
    return estado;
  }
  const jugadorActual = estado.jugadores[estado.turno];
    if (indice < 0 || indice >= jugadorActual.mano.length) {
    return estado;
  }
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

  return terminarTurno({ ...estado, jugadores: jugadoresNuevos });
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
    return terminarTurno(robarDelMazo(base, base.turno));
  };

  // ---------- ROBAR DE LA OTRA PILA ----------
  // (si llegamos aquí, el origen es 'pila')

  const pilaOrigen = base.pilas[otraPila];
  //    ↑            └ el ARRAY de la otra pila (primero eliges cuál)
  const cartaPila = pilaOrigen[pilaOrigen.length - 1];
  //    ↑           └ la carta de arriba de ese array
  const pilaOrigenNueva = pilaOrigen.slice(0, pilaOrigen.length - 1);
  //    ↑                 └ la pila sin su carta de arriba

  // Regla extra: si la pila se queda vacía, se repone con la de arriba del mazo
  let pilaFinal = pilaOrigenNueva; // de partida, la pila tal como queda
  let mazoFinal = base.mazo; // de partida, el mazo no cambia

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

  return terminarTurno({...base,
    mazo: mazoFinal,
    
    pilas: pilasNuevas,
    jugadores: jugadoresNuevos})
  }

export function decidirCierre(estado: EstadoPartida, cerrar: boolean,): EstadoPartida {
  if (estado.fase.tipo !== "decidirCierre") {
    return estado;
  }
  if (cerrar === false) {
    return terminarTurno(estado)
  };
  return cerrarRonda(estado);
}


export function terminarTurno(estado: EstadoPartida): EstadoPartida {
  if (estado.jugadores[estado.turno].mano.length === 0) {
    return cerrarRonda(estado);
  }
  return {
    ...estado,
    turno: estado.turno === 0 ? 1 : 0,
    fase: { tipo: "jugando" },
  };
}
