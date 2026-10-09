import { PALOS, type Carta } from "./types";
import type { EstadoPartida, JugadorId } from "./types";

export function calcularPuntos(cartas: readonly Carta[]): number {
  let total = 0;
  for (const paloActual of PALOS) {
    const delPalo = cartas.filter((c) => c.palo === paloActual);

    if (delPalo.length > 0) {
      const numerosDelPalo = delPalo.map((c) => c.numero);
      const masBaja = Math.min(...numerosDelPalo);
      total += masBaja;
    }
  }
  return total;
}

export function calcularGanador(estado: EstadoPartida): JugadorId | "empate" {
  const puntos0 = calcularPuntos(estado.jugadores[0].reserva);
  const puntos1 = calcularPuntos(estado.jugadores[1].reserva);
  if (puntos0 < puntos1) return 0;
  if (puntos1 < puntos0) return 1;
  if (puntos0 === puntos1) {
    const palos0 = new Set(
      estado.jugadores[0].reserva.map((carta) => carta.palo),
    ).size;
    const palos1 = new Set(
      estado.jugadores[1].reserva.map((carta) => carta.palo),
    ).size;
    if (palos0 < palos1) return 0;
    if (palos1 < palos0) return 1;
    if (palos1 === palos0) {
      const cartas0 = estado.jugadores[0].reserva.length;
      const cartas1 = estado.jugadores[1].reserva.length;
      if (cartas0 < cartas1) return 0;
      if (cartas1 < cartas0) return 1;
    }
  }

  return "empate";
}
