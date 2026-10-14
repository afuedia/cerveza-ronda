import type { EstadoPartida, Accion, JugadorId } from "./types";
import { decidirCierre, jugarCarta, darCarta, robar } from "./turno";
import { crearPartida } from "./partida";

export function partidaReducer(
  estado: EstadoPartida,
  accion: Accion,
  jugador: JugadorId,
): EstadoPartida {
  if (accion.tipo !== "crearPartida" && jugador !== estado.turno) {
    return estado;
  }

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
      if (estado.fase.tipo !== "finPartida") {
        return estado;
      }
      return crearPartida();

    default: {
      const exhaustivo: never = accion;
      return exhaustivo;
    }
  }
}