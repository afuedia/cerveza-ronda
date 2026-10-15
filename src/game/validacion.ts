// Validación en runtime de lo que llega por la red.
// TypeScript desaparece al compilar: lo que entra por el socket es texto
// y no hay ninguna garantía de que cumpla MensajeCliente. Aquí se comprueba.
import type { Accion, PilaId, OrigenRobo } from "./types";
import type { MensajeCliente } from "./protocolo";

// Type guard: si devuelve true, TS sabe que x es un objeto con claves string.
function esObjeto(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null && !Array.isArray(x);
}

function esEnteroNoNegativo(x: unknown): x is number {
  return typeof x === "number" && Number.isInteger(x) && x >= 0;
}

function esPilaId(x: unknown): x is PilaId {
  return x === 0 || x === 1;
}

function esOrigenRobo(x: unknown): x is OrigenRobo {
  return x === "mazo" || x === "pila";
}

// Devuelve una Accion NUEVA con solo los campos esperados (lista blanca),
// o null si algo no cuadra. Los campos de más que mande el cliente se tiran.
function leerAccion(x: unknown): Accion | null {
  if (!esObjeto(x)) return null;

  switch (x.tipo) {
    case "jugarCarta":
      if (!esEnteroNoNegativo(x.posicion) || !esPilaId(x.pila)) return null;
      return { tipo: "jugarCarta", posicion: x.posicion, pila: x.pila };

    case "darCarta":
      if (!esEnteroNoNegativo(x.indice)) return null;
      return { tipo: "darCarta", indice: x.indice };

    case "robar":
      if (!esOrigenRobo(x.origen)) return null;
      return { tipo: "robar", origen: x.origen };

    case "decidirCierre":
      if (typeof x.cerrar !== "boolean") return null;
      return { tipo: "decidirCierre", cerrar: x.cerrar };

    case "crearPartida":
      return { tipo: "crearPartida" };

    default:
      return null;
  }
}

// Punto de entrada: texto crudo del socket → mensaje válido o null.
export function leerMensajeCliente(texto: string): MensajeCliente | null {
  let datos: unknown;
  try {
    datos = JSON.parse(texto);
  } catch {
    return null; // no era JSON
  }

  if (!esObjeto(datos)) return null;

  switch (datos.tipo) {
    case "accion": {
      const accion = leerAccion(datos.accion);
      if (accion === null) return null;
      return { tipo: "accion", accion };
    }
    default:
      return null;
  }
}