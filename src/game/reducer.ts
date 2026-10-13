import type { EstadoPartida, Accion } from "./types";
import { decidirCierre, jugarCarta, darCarta, robar } from "./turno";
import { crearPartida } from "./partida";

export function partidaReducer(estado: EstadoPartida, accion: Accion): EstadoPartida {
  switch (accion.tipo) {
    case "jugarCarta":
      return jugarCarta(estado, accion.posicion, accion.pila);

    case "darCarta":
      return darCarta(estado, accion.indice);

    case "robar":
      return robar(estado, accion.origen);

    case "decidirCierre":
      return decidirCierre(estado, accion.cerrar);

    case "crearPartida":
      return crearPartida();

    default: {
      const exhaustivo: never = accion;
      return exhaustivo;
    }
  }
}