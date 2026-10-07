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



