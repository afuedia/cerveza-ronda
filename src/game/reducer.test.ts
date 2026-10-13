import { describe, it, expect } from "vitest";
import { partidaReducer } from "./reducer";
import { crearPartida } from "./partida";
import type { EstadoPartida } from "./types";

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