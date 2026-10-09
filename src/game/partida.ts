import type { EstadoPartida, JugadorId, Carta } from "./types";
import { crearBaraja, barajarBaraja } from "./baraja";

function repartirManos(mazo: readonly Carta[]): { manos: [Carta[], Carta[]]; resto: Carta[] } {
  const mazoNuevo = mazo.slice(14);
  const mano0 = mazo.slice(0, 7);
  const mano1 = mazo.slice(7, 14);
  return { manos:[mano0, mano1], resto:mazoNuevo}
}

export function crearPartida(): EstadoPartida {
  const baraja = crearBaraja();
  const barajaBarajada = barajarBaraja(baraja);
  const reparto = repartirManos(barajaBarajada)
  // const mano1 = barajaBarajada.slice(0, 7);
  // const mano2 = barajaBarajada.slice(7,14);
  const pila0 = reparto.resto.slice(0,1);
  const pila1 = reparto.resto.slice(1,2);
  const mazo = reparto.resto.slice(2);

  const inicial: JugadorId = Math.random() < 0.5 ? 0 : 1;

  return {
    mazo: mazo,
    pilas: [pila0, pila1],
    jugadores: [{mano: reparto.manos[0], reserva: []},{mano: reparto.manos[1], reserva: []}],
    ronda: 1,
    turno: inicial,
    inicialRonda1: inicial,
    fase: { tipo: 'jugando' }
    };
  }
  
export function nuevaRonda(estado: EstadoPartida): EstadoPartida {
  if (estado.ronda === 3) {
    return {...estado,
      fase: { tipo: 'finPartida' }
    }
  }
  const ronda = estado.ronda === 1 ? 2 : 3;
  const reparto = repartirManos(estado.mazo);
  // const mazoNuevo = estado.mazo.slice(14);
  // const mano0 = estado.mazo.slice(0, 7);
  // const mano1 = estado.mazo.slice(7, 14);
  const otroJugador = estado.inicialRonda1 === 0 ? 1 : 0;
  const turno = ronda === 3 ? estado.inicialRonda1 : otroJugador;
  return {...estado,
    mazo: reparto.resto,
    jugadores: [
  { ...estado.jugadores[0], mano: reparto.manos[0] },
  { ...estado.jugadores[1], mano: reparto.manos[1] },
],
turno: turno,
    ronda: ronda,
    fase: { tipo: 'jugando'}
  }
}


