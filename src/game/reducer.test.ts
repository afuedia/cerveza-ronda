import { describe, it, expect } from "vitest";
import { partidaReducer } from "./reducer";
import { crearPartida } from "./partida";
import type { EstadoPartida } from "./types";
import { estadoDePrueba } from "./estadoPrueba";

//partidaReducer
// preparar: una partida cualquiera, con crearPartida()
// actuar: pasarla por partidaReducer con la comanda { tipo: "crearPartida" }
// comprobar: que la fase del resultado es "jugando"
describe("crearPartida", () => {
  it("Al pulsar el boton, se crea una partida", () => {
    // 1. PREPARAR
    const estado: EstadoPartida = {...crearPartida(), fase: {tipo: "finPartida"} };
    
    // 2. ACTUAR
    const nuevo = partidaReducer(estado, { tipo: "crearPartida" });
    // 3. COMPROBAR
    expect(nuevo.fase).toEqual({ tipo: "jugando" });
  });

  
});

describe("control de turno", () => {
  it("ignora una jugada del jugador que no está en turno", () => {
    // 1. PREPARAR: le toca al jugador 0
    const estado = estadoDePrueba(
      [{ palo: "p1", numero: 5 }],
      { palo: "p2", numero: 3 },
    );

    // 2. ACTUAR: la envía el jugador 1
    const nuevo = partidaReducer(estado, { tipo: "jugarCarta", posicion: 0, pila: 0 }, 1);

    // 3. COMPROBAR: mismo objeto, no se ha tocado nada
    expect(nuevo).toBe(estado);
  });

  it("ignora crearPartida si la partida no ha terminado", () => {
    // 1. PREPARAR: partida en curso (fase "jugando")
    const estado = crearPartida();

    // 2. ACTUAR: cualquiera de los dos lo pide
    const nuevo = partidaReducer(estado, { tipo: "crearPartida" }, 0);

    // 3. COMPROBAR
    expect(nuevo).toBe(estado);
  });
});