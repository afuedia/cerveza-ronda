import { describe, it, expect } from "vitest";
import { crearBaraja, barajarBaraja, rebarajarPilas } from "./baraja";
import { estadoDePrueba } from "./estadoPrueba";
import type { EstadoPartida } from "./types";

describe("crearBaraja", () => {
  it("crea 100 cartas", () => {
    expect(crearBaraja()).toHaveLength(100);
  });

  it("no repite ninguna carta", () => {
    const baraja = crearBaraja();
    const claves = baraja.map((carta) => `${carta.palo}-${carta.numero}`);
    //    ↑                                └ el mismo "DNI" que usaste en la key de React
    expect(new Set(claves).size).toBe(100);
    //     ↑
    //     └ un Set guarda cada valor UNA sola vez: si hubiera repetidas, tendría menos de 100
  });
});

describe("barajarBaraja", () => {
  it("devuelve las mismas cartas, en otra lista", () => {
    const baraja = crearBaraja();
    const barajada = barajarBaraja(baraja);

    expect(barajada).toHaveLength(100);
    expect(barajada).not.toBe(baraja);       // es un array NUEVO (no la misma caja)
    expect(baraja[0]).toEqual({ palo: "p1", numero: 1 }); // el original sigue en orden
  });
});

describe("rebarajarPilas", () => {
  // Preparación común: un mazo de 1 carta y dos pilas de 2
  function estadoConPilas(): EstadoPartida {
    return {
      ...estadoDePrueba([], { palo: "p2", numero: 5 }),
      mazo: [{ palo: "p6", numero: 2 }],
      pilas: [
        [{ palo: "p8", numero: 6 }, { palo: "p2", numero: 5 }],   // pila 0: arriba el 5 de p2
        [{ palo: "p4", numero: 3 }, { palo: "p10", numero: 10 }], // pila 1: arriba el 10 de p10
      ],
    };
  }

  it("las pilas se quedan solo con su carta de arriba", () => {
    const nuevo = rebarajarPilas(estadoConPilas());

    expect(nuevo.pilas).toEqual([
      [{ palo: "p2", numero: 5 }],
      [{ palo: "p10", numero: 10 }],
    ]);
  });

  it("el mazo recibe las cartas de debajo de las pilas", () => {
    const nuevo = rebarajarPilas(estadoConPilas());

    expect(nuevo.mazo).toHaveLength(3); // la que había + una de cada pila
    expect(nuevo.mazo).toContainEqual({ palo: "p6", numero: 2 });  // la que ya estaba
    expect(nuevo.mazo).toContainEqual({ palo: "p8", numero: 6 });  // de debajo de la pila 0
    expect(nuevo.mazo).toContainEqual({ palo: "p4", numero: 3 });  // de debajo de la pila 1
  });

  it("las cartas de arriba NO van al mazo", () => {
    const nuevo = rebarajarPilas(estadoConPilas());

    expect(nuevo.mazo).not.toContainEqual({ palo: "p2", numero: 5 });
    expect(nuevo.mazo).not.toContainEqual({ palo: "p10", numero: 10 });
    //                 ↑
    //                 └ .not le da la vuelta a cualquier comprobador
  });
});