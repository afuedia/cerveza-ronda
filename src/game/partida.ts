import type { EstadoPartida, JugadorId } from "./types";
import { crearBaraja, barajarBaraja } from "./baraja";


export function crearPartida(): EstadoPartida {
  const baraja = crearBaraja();
  const barajaBarajada = barajarBaraja(baraja);
  const mano1 = barajaBarajada.slice(0, 7);
  const mano2 = barajaBarajada.slice(7,14);
  const pila1 = barajaBarajada.slice(14,15);
  const pila2 = barajaBarajada.slice(15,16);
  const mazo = barajaBarajada.slice(16);

  const inicial: JugadorId = Math.random() < 0.5 ? 0 : 1;

  return {
    mazo: mazo,
    pilas: [pila1, pila2],
    jugadores: [{mano: mano1, reserva: []},{mano: mano2, reserva: []}],
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
  const mazoNuevo = estado.mazo.slice(14);
  const mano0 = estado.mazo.slice(0, 7);
  const mano1 = estado.mazo.slice(7, 14);
  const otroJugador = estado.inicialRonda1 === 0 ? 1 : 0;
  const turno = ronda === 3 ? estado.inicialRonda1 : otroJugador;
  return {...estado,
    mazo: mazoNuevo,
    jugadores: [
  { ...estado.jugadores[0], mano: mano0 },
  { ...estado.jugadores[1], mano: mano1 },
],
turno: turno,
    ronda: ronda,
    fase: { tipo: 'jugando'}
  }
}


