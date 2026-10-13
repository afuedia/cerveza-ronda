import { useState, useReducer } from "react";
import type { PilaId, OrigenRobo } from "../game/types";
import { partidaReducer } from "../game/reducer";
import { crearPartida } from "../game/partida";

export function usePartida() {
  // aquí: las dos líneas del useReducer y el useState
  const [partida, despachar] = useReducer(partidaReducer, undefined, crearPartida);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);

  // aquí: jugarEnPila y pulsarCartaDeMano
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
    setSeleccionada(posicion);
  }
  function nuevaPartida() {
    // las dos cosas que hace ahora el botón
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