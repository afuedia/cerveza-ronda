import { describe, it, expect } from "vitest";
import { crearPartida } from "./partida";
import { determinarCaso, jugarCarta, darCarta, robar, decidirCierre } from "./turno";
import type { Carta, EstadoPartida } from "./types";
import { estadoDePrueba } from "./estadoPrueba";
import { crearBaraja } from "./baraja";
import { calcularGanador } from "./puntos";




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


//darCarta
describe("darCarta", () => {
  it("el que da tiene una carta menos", () => {
    // 1. PREPARAR: un estado en la fase de elegir carta para dar
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      fase: { tipo: "elegirCartaParaDar" },
    };

    // 2. ACTUAR: el jugador 0 da la carta de la posición 0 (el 4 de p3)
    const nuevo = darCarta(estado, 0);

    // 3. COMPROBAR: sobre el estado NUEVO
    expect(nuevo.jugadores[0].mano).toHaveLength(1);
  });

  it("el rival recibe la carta", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      fase: { tipo: "elegirCartaParaDar"}
    };

    const nuevo = darCarta(estado, 0);
    const manoRibal = nuevo.jugadores[1].mano;
    expect(manoRibal).toHaveLength(2)
    expect(manoRibal[manoRibal.length - 1]).toEqual({palo: 'p3', numero: 4})
  }) 

  it("el turno pasa al rival: turno es 1.", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      fase: { tipo: "elegirCartaParaDar"}
    };

    const nuevo = darCarta(estado, 0);
    const turnoRibal = nuevo.turno
    expect(turnoRibal).toBe(1)
  }) 

  it("la fase vuelve a jugando", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      fase: { tipo: "elegirCartaParaDar"}
    };

    const nuevo = darCarta(estado, 0);
    const fase = nuevo.fase;
    expect(fase.tipo).toBe('jugando')
  }) 
});

describe("robar", () => {
  it("si la fase no es elegirRobo, no cambia nada", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      fase: { tipo: "elegirCartaParaDar" },
    };

    // 2. ACTUAR
    const nuevo = robar(estado, 'mazo');

    // 3. COMPROBAR
    expect(nuevo).toBe(estado);
  });

  it("si roba del mazo, el mazo pierde una carta", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      mazo: [{ palo: 'p6', numero: 2 }, { palo: 'p7', numero: 3 }],
      fase: { tipo: 'elegirRobo' , pilaJugada: 0},
    };

    // 2. ACTUAR
    const nuevo = robar(estado, 'mazo');

    // 3. COMPROBAR
    expect( nuevo.mazo.length ).toBe( 1 );
  });
    it("si roba del mazo, se lleva la carta de arriba y pasa el turno", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      mazo: [{ palo: "p6", numero: 2 }, { palo: "p7", numero: 3 }],
      fase: { tipo: "elegirRobo", pilaJugada: 0 },
    };

    const nuevo = robar(estado, "mazo");

    const mano = nuevo.jugadores[0].mano;
    expect(mano).toHaveLength(3);
    expect(mano[mano.length - 1]).toEqual({ palo: "p7", numero: 3 }); // la de arriba del mazo
    expect(nuevo.turno).toBe(1);
    expect(nuevo.fase).toEqual({ tipo: "jugando" });
  });

  it("si roba de la otra pila y le quedan cartas, el mazo no cambia", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      mazo: [{ palo: "p6", numero: 2 }, { palo: "p7", numero: 3 }],
      pilas: [
        [{ palo: "p2", numero: 5 }],                              // pila 0: donde jugó
        [{ palo: "p8", numero: 6 }, { palo: "p10", numero: 10 }], // pila 1: tiene DOS cartas
      ],
      fase: { tipo: "elegirRobo", pilaJugada: 0 },
    };

    const nuevo = robar(estado, "pila");

    const mano = nuevo.jugadores[0].mano;
    expect(mano[mano.length - 1]).toEqual({ palo: "p10", numero: 10 }); // la de arriba de la pila 1
    expect(nuevo.pilas[1]).toEqual([{ palo: "p8", numero: 6 }]);       // le queda la de abajo
    expect(nuevo.mazo).toHaveLength(2);                                 // no se repone
  });

  it("si roba la última carta de la otra pila, la repone con la de arriba del mazo", () => {
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      mazo: [{ palo: "p6", numero: 2 }, { palo: "p7", numero: 3 }],
      fase: { tipo: "elegirRobo", pilaJugada: 0 },
      // la pila 1 de estadoDePrueba tiene UNA carta: al robarla se queda vacía
    };

    const nuevo = robar(estado, "pila");

    const mano = nuevo.jugadores[0].mano;
    expect(mano[mano.length - 1]).toEqual({ palo: "p10", numero: 10 }); // se lleva la única de la pila 1
    expect(nuevo.pilas[1]).toEqual([{ palo: "p7", numero: 3 }]);       // repuesta con la del mazo
    expect(nuevo.mazo).toEqual([{ palo: "p6", numero: 2 }]);           // el mazo pierde esa carta
  });
});

//decidirCierre
describe("decidirCierre", () => {
  it("Si la fase no es decidirCierre, no cambia nadas", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      fase: { tipo: "elegirCartaParaDar" },
    };

    // 2. ACTUAR
    const nuevo = decidirCierre(estado, true);

    // 3. COMPROBAR
    expect(nuevo).toBe(estado);
  });

 it("Si sigue, pasa el turno y vuelve a jugar", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 1 }, { palo: "p1", numero: 1 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      fase: { tipo: "decidirCierre" },
    };

    // 2. ACTUAR
    const nuevo = decidirCierre(estado, false);
  
    // 3. COMPROBAR
    expect(nuevo.fase).toEqual({tipo: 'jugando'});
    expect(nuevo.turno).toBe(1);
  });
  
  it("si cierra, las manos pasan a las reservas y empieza la ronda siguienteq", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 1 }, { palo: "p1", numero: 1 }],  // mano del jugador 0
        { palo: "p2", numero: 5 },                               // cima de la pila 0
      ),
      mazo: crearBaraja(),
      fase: { tipo: "decidirCierre" },
      turno: 1,
    };

    // 2. ACTUAR
    const nuevo = decidirCierre(estado, true);
    
    // 3. COMPROBAR
    expect(nuevo.jugadores[0].mano.length).toEqual(7);
    expect(nuevo.jugadores[1].mano.length).toEqual(7);
    expect(nuevo.jugadores[0].reserva).toEqual([
      { palo: "p3", numero: 1 },
      { palo: "p1", numero: 1 },
    ]);
    expect(nuevo.jugadores[1].reserva).toEqual([{ palo: "p9", numero: 9 }]);
    expect(nuevo.ronda).toBe(2);
  });
    it("si el mazo está vacío, rebaraja las pilas antes de robar", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {
      ...estadoDePrueba(
        [{ palo: "p3", numero: 4 }, { palo: "p1", numero: 8 }],
        { palo: "p2", numero: 5 },
      ),
      mazo: [],
      pilas: [
        [{ palo: "p4", numero: 1 }, { palo: "p4", numero: 2 }, { palo: "p2", numero: 5 }],    // arriba: 5 de p2
        [{ palo: "p6", numero: 1 }, { palo: "p6", numero: 2 }, { palo: "p10", numero: 10 }],  // arriba: 10 de p10
      ],
      fase: { tipo: "elegirRobo", pilaJugada: 0 },
    };

    // 2. ACTUAR
    const nuevo = robar(estado, "mazo");

    // 3. COMPROBAR
    expect(nuevo.jugadores[0].mano).toHaveLength(3);           // 2 que tenía + 1 robada
    expect(nuevo.pilas[0]).toEqual([{ palo: "p2", numero: 5 }]);   // solo la de arriba
    expect(nuevo.pilas[1]).toEqual([{ palo: "p10", numero: 10 }]);
    // mazo: 0 → rebaraja (+2 de cada pila = 4) → roba 1 = 3
    expect(nuevo.mazo).toHaveLength(3);
  });
});
//   Si sigue, pasa el turno y vuelve a jugar. decidirCierre(estado, false) → turno 1 y fase 'jugando'.
// Si cierra, las manos pasan a las reservas. decidirCierre(estado, true) → las dos manos vacías, y en las reservas, las cartas que tenían en la mano.

// Fabrica un estado en el que solo importan las reservas
function estadoConReservas(reserva0: Carta[], reserva1: Carta[]): EstadoPartida {
  return {
    ...estadoDePrueba([], { palo: "p2", numero: 5 }),
    jugadores: [
      { mano: [], reserva: reserva0 },
      { mano: [], reserva: reserva1 },
    ],
  };
}

describe("calcularGanador", () => {
  it("gana quien tiene menos puntos", () => {
    const estado = estadoConReservas(
      [{ palo: "p1", numero: 5 }],   // 5 puntos
      [{ palo: "p1", numero: 2 }],   // 2 puntos → gana el 1
    );
    expect(calcularGanador(estado)).toBe(1);
  });

  it("con empate a puntos, gana quien tiene menos palos", () => {
    const estado = estadoConReservas(
      [{ palo: "p1", numero: 5 }],                              // 5 puntos, 1 palo → gana el 0
      [{ palo: "p1", numero: 2 }, { palo: "p2", numero: 3 }],   // 2 + 3 = 5 puntos, 2 palos
    );
    expect(calcularGanador(estado)).toBe(0);
  });

  it("con empate a puntos y palos, gana quien tiene menos cartas", () => {
    const estado = estadoConReservas(
      [{ palo: "p1", numero: 3 }, { palo: "p1", numero: 7 }, { palo: "p2", numero: 2 }], // 3 + 2 = 5, 2 palos, 3 cartas
      [{ palo: "p1", numero: 3 }, { palo: "p2", numero: 2 }],                            // 3 + 2 = 5, 2 palos, 2 cartas → gana el 1
    );
    expect(calcularGanador(estado)).toBe(1);
  });

  it("si empatan en todo, es empate", () => {
    const estado = estadoConReservas(
      [{ palo: "p1", numero: 4 }],
      [{ palo: "p1", numero: 4 }],
    );
    expect(calcularGanador(estado)).toBe("empate");
  });
});