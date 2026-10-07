import { describe, it, expect } from "vitest";
import { crearPartida } from "./partida";
import { determinarCaso, jugarCarta } from "./turno";
import type { Carta, EstadoPartida } from "./types";

function estadoDePrueba(mano: Carta[], cima: Carta): EstadoPartida {
  return {
    mazo: [],
    pilas: [[cima], [{ palo: "p10", numero: 10 }]],
    jugadores: [
      { mano: mano, reserva: [] }, // jugador 0: el que juega
      { mano: [{ palo: "p9", numero: 9 }], reserva: [] }, // jugador 1: da igual
    ],
    ronda: 1,
    turno: 0, // siempre le toca al jugador 0
    inicialRonda1: 0,
    fase: { tipo: "jugando" },
  };
}

describe("determinarCaso", () => {
  it("coincide si son del mismo palo, aunque el número sea mayor", () => {
    expect(
      determinarCaso(
        { palo: "p3", numero: 9 }, // la jugada
        { palo: "p3", numero: 1 }, // la cima
      ),
    ).toBe("coincide");
  });

  it("coincide si tienen el mismo número y distinto palo", () => {
    expect(
      determinarCaso(
        { palo: "p4", numero: 9 }, // la jugada
        { palo: "p3", numero: 9 }, // la cima
      ),
    ).toBe("coincide");
  });

  it("da mayor si es de distinto palo y número mayor", () => {
    expect(
      determinarCaso(
        { palo: "p4", numero: 9 }, // la jugada
        { palo: "p3", numero: 8 }, // la cima
      ),
    ).toBe("mayor");
  });

  it("da menor si es de distinto palo y número menor", () => {
    expect(
      determinarCaso(
        { palo: "p4", numero: 7 }, // la jugada
        { palo: "p5", numero: 8 }, // la cima
      ),
    ).toBe("menor");
  });
});

describe("jugarCarta", () => {
  it("quita la carta de la mano del jugador", () => {
    const estado = crearPartida();
    const nuevo = jugarCarta(estado, 0, 0);
    expect(nuevo.jugadores[estado.turno].mano).toHaveLength(6);
  });
  it("pone la carta jugada arriba de la pila", () => {
    const estado = crearPartida();
    const cartaJugada = estado.jugadores[estado.turno].mano[0];
    //    ↑
    //    └ la guardamos ANTES de jugar, para saber cuál era

    const nuevo = jugarCarta(estado, 0, 0);
    const pila = nuevo.pilas[0];

    expect(pila[pila.length - 1]).toEqual(cartaJugada);
    //     ↑                      ↑
    //     │                      └ mismo contenido: toEqual, porque es un objeto
    //     └ la última carta de la pila, la de arriba
  });

  it("la pila tiene una carta más", () => {
    const estado = crearPartida();
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.pilas[0]).toHaveLength(2);
  });

  it("no modifica el estado original", () => {
    const estado = crearPartida();
    jugarCarta(estado, 0, 0);

    expect(estado.jugadores[estado.turno].mano).toHaveLength(7);
    expect(estado.pilas[0]).toHaveLength(1);
  });

  it("si coincide, pasa a elegir carta para dar", () => {
    const estado = estadoDePrueba(
      [
        { palo: "p3", numero: 4 },
        { palo: "p1", numero: 8 },
      ],
      { palo: "p3", numero: 7 },
    );
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.fase).toEqual({ tipo: "elegirCartaParaDar" });
    expect(nuevo.turno).toBe(0);
  });

  it("si es mayor, pasa a elegir de dónde robar", () => {
    const estado = estadoDePrueba(
      [
        { palo: "p5", numero: 9 },
        { palo: "p2", numero: 8 },
      ],
      { palo: "p3", numero: 7 },
    );
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.fase).toEqual({ tipo: "elegirRobo", pilaJugada: 0 });
    expect(nuevo.turno).toBe(0);
  });

  it("si es menor y quedan más de 3 puntos, pasa el turno al rival", () => {
    const estado = estadoDePrueba(
      [
        { palo: "p5", numero: 6 },
        { palo: "p2", numero: 8 },
      ],
      { palo: "p3", numero: 7 },
    );
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.fase).toEqual({ tipo: "jugando" });
    expect(nuevo.turno).toBe(1);
  });

  it("si es menor y quedan menos de 3 puntos, pasa a deciridr si acabar la ronda", () => {
    const estado = estadoDePrueba(
      [
        { palo: "p5", numero: 6 },
        { palo: "p2", numero: 1 },
      ],
      { palo: "p3", numero: 7 },
    );
    const nuevo = jugarCarta(estado, 0, 0);

    expect(nuevo.fase).toEqual({ tipo: "decidirCierre" });
    expect(nuevo.turno).toBe(0); //¿Seguro? es 0 si decido no cerrar el turno, pero si decido cerrarlo, empieza el nuevo turno quien no empezó el turno que acaba de cerrar
  });
});
