import { useState, useReducer } from "react";
import type { PilaId, OrigenRobo } from "../game/types";
import { partidaReducer } from "../game/reducer";
import { crearPartida } from "../game/partida";

export function usePartida() {
  const [partida, despachar] = useReducer(partidaReducer, undefined, crearPartida);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

   function jugarEnPila(pila: PilaId) {
    if (seleccionada === null) {
      return;
    }
    despachar( {tipo: "jugarCarta", posicion: seleccionada, pila: pila});
    setSeleccionada(null);
  }
  function pulsarCartaDeMano(posicion: number) {
    if (partida.fase.tipo === "elegirCartaParaDar") {
      despachar( {tipo: "darCarta", indice: posicion});
      return;
    }
    if (partida.fase.tipo === "jugando") {
      setSeleccionada(posicion);
    }
  }

  function nuevaPartida() {
    
    despachar({ tipo: "crearPartida" }); 
    setSeleccionada(null)
  }

  function pulsarCierre(cerrar: boolean) {
    despachar( {tipo: "decidirCierre", cerrar: cerrar})
  }

  function pulsarRobo(origen: OrigenRobo) {
    despachar( {tipo: "robar", origen: origen})
  }

  return { pulsarCierre, pulsarRobo, nuevaPartida, partida, seleccionada, jugarEnPila, pulsarCartaDeMano };
}