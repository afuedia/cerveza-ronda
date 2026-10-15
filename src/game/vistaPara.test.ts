import { describe, it, expect } from "vitest";
import { vistaPara } from "./vistaPara";
import { estadoDePrueba } from "./estadoPrueba";
import type { Carta, EstadoPartida } from "./types";

// Jugador 0: mano con dos cartas. Jugador 1: mano con un 9 de p9.
// Pilas: cima 3 de p2 y 10 de p10.
const manoJugador0: Carta[] = [
  { palo: "p1", numero: 5 },
  { palo: "p4", numero: 8 },
];
const cima: Carta = { palo: "p2", numero: 3 };

function estadoBase(): EstadoPartida {
  return estadoDePrueba(manoJugador0, cima);
}

describe("vistaPara", () => {
  it("cada jugador ve su propia mano", () => {
    const estado = estadoBase();

    expect(vistaPara(estado, 0).miMano).toEqual(manoJugador0);
    expect(vistaPara(estado, 1).miMano).toEqual([{ palo: "p9", numero: 9 }]);
  });

  it("del rival solo se ve cuántas cartas tiene en mano y en reserva", () => {
    const estado: EstadoPartida = {
      ...estadoBase(),
      jugadores: [
        { mano: manoJugador0, reserva: [{ palo: "p3", numero: 1 }] },
        { mano: [{ palo: "p9", numero: 9 }], reserva: [] },
      ],
    };

    expect(vistaPara(estado, 0).rival).toEqual({ cartasEnMano: 1, cartasEnReserva: 0 });
    expect(vistaPara(estado, 1).rival).toEqual({ cartasEnMano: 2, cartasEnReserva: 1 });
  });

  it("no filtra ninguna carta del rival en todo el objeto", () => {
    const estado = estadoBase();

    // Convertimos la vista a texto, como hará el servidor antes de enviarla,
    // y buscamos el palo que solo tiene el jugador 1.
    const texto = JSON.stringify(vistaPara(estado, 0));

    expect(texto).not.toContain('"p9"');
  });

  it("solo se ve la carta de arriba de cada pila", () => {
    const estado: EstadoPartida = {
      ...estadoBase(),
      pilas: [
        [{ palo: "p7", numero: 7 }, cima],
        [{ palo: "p10", numero: 10 }],
      ],
    };

    expect(vistaPara(estado, 0).cimas).toEqual([cima, { palo: "p10", numero: 10 }]);
    expect(JSON.stringify(vistaPara(estado, 0))).not.toContain('"p7"');
  });

  it("del mazo solo se ve cuántas cartas quedan", () => {
    const estado: EstadoPartida = {
      ...estadoBase(),
      mazo: [
        { palo: "p6", numero: 2 },
        { palo: "p6", numero: 4 },
      ],
    };

    const vista = vistaPara(estado, 0);

    expect(vista.cartasEnMazo).toBe(2);
    expect(JSON.stringify(vista)).not.toContain('"p6"');
  });

  it("copia ronda, turno y fase tal cual", () => {
    const vista = vistaPara(estadoBase(), 1);

    expect(vista.yo).toBe(1);
    expect(vista.ronda).toBe(1);
    expect(vista.turno).toBe(0);
    expect(vista.fase).toEqual({ tipo: "jugando" });
  });

  it("no hay resultado mientras la partida sigue", () => {
    expect(vistaPara(estadoBase(), 0).resultado).toBeNull();
  });

  it("al terminar la partida trae los puntos y el ganador", () => {
    const estado: EstadoPartida = {
      ...estadoBase(),
      fase: { tipo: "finPartida" },
      jugadores: [
        { mano: [], reserva: [{ palo: "p1", numero: 2 }] },
        { mano: [], reserva: [{ palo: "p1", numero: 6 }] },
      ],
    };

    expect(vistaPara(estado, 1).resultado).toEqual({
      puntos: [2, 6],
      ganador: 0,
    });
  });
});