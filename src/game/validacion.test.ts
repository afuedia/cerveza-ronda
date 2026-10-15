import { describe, it, expect } from "vitest";
import { leerMensajeCliente } from "./validacion";

// Ayuda: convierte un objeto a texto, como llegaría por el socket.
const enviar = (x: unknown) => leerMensajeCliente(JSON.stringify(x));

describe("leerMensajeCliente: mensajes válidos", () => {
  it("acepta jugarCarta", () => {
    const mensaje = { tipo: "accion", accion: { tipo: "jugarCarta", posicion: 2, pila: 1 } };
    expect(enviar(mensaje)).toEqual(mensaje);
  });

  it("acepta darCarta", () => {
    const mensaje = { tipo: "accion", accion: { tipo: "darCarta", indice: 0 } };
    expect(enviar(mensaje)).toEqual(mensaje);
  });

  it("acepta robar", () => {
    const mensaje = { tipo: "accion", accion: { tipo: "robar", origen: "pila" } };
    expect(enviar(mensaje)).toEqual(mensaje);
  });

  it("acepta decidirCierre", () => {
    const mensaje = { tipo: "accion", accion: { tipo: "decidirCierre", cerrar: false } };
    expect(enviar(mensaje)).toEqual(mensaje);
  });

  it("acepta crearPartida", () => {
    const mensaje = { tipo: "accion", accion: { tipo: "crearPartida" } };
    expect(enviar(mensaje)).toEqual(mensaje);
  });
});

describe("leerMensajeCliente: basura", () => {
  it("rechaza texto que no es JSON", () => {
    expect(leerMensajeCliente("hola qué tal")).toBeNull();
  });

  it("rechaza JSON que no es un objeto", () => {
    expect(enviar(42)).toBeNull();
    expect(enviar(null)).toBeNull();
    expect(enviar(["accion"])).toBeNull();
  });

  it("rechaza un tipo de mensaje desconocido", () => {
    expect(enviar({ tipo: "hacerTrampa" })).toBeNull();
  });

  it("rechaza una acción desconocida", () => {
    expect(enviar({ tipo: "accion", accion: { tipo: "ganarYa" } })).toBeNull();
  });

  it("rechaza un mensaje sin acción", () => {
    expect(enviar({ tipo: "accion" })).toBeNull();
  });
});

describe("leerMensajeCliente: campos con valores inválidos", () => {
  it("rechaza una pila que no es 0 ni 1", () => {
    expect(enviar({ tipo: "accion", accion: { tipo: "jugarCarta", posicion: 0, pila: 2 } })).toBeNull();
  });

  it("rechaza posiciones negativas, decimales o como texto", () => {
    expect(enviar({ tipo: "accion", accion: { tipo: "jugarCarta", posicion: -1, pila: 0 } })).toBeNull();
    expect(enviar({ tipo: "accion", accion: { tipo: "jugarCarta", posicion: 1.5, pila: 0 } })).toBeNull();
    expect(enviar({ tipo: "accion", accion: { tipo: "jugarCarta", posicion: "2", pila: 0 } })).toBeNull();
  });

  it("rechaza un origen de robo inventado", () => {
    expect(enviar({ tipo: "accion", accion: { tipo: "robar", origen: "manoDelRival" } })).toBeNull();
  });

  it("rechaza cerrar si no es booleano", () => {
    expect(enviar({ tipo: "accion", accion: { tipo: "decidirCierre", cerrar: "si" } })).toBeNull();
  });
});

describe("leerMensajeCliente: lista blanca", () => {
  it("descarta los campos de más, como un jugador que intenta colar su id", () => {
    const resultado = enviar({
      tipo: "accion",
      jugador: 1,
      accion: { tipo: "robar", origen: "mazo", jugador: 1 },
    });

    expect(resultado).toEqual({ tipo: "accion", accion: { tipo: "robar", origen: "mazo" } });
  });
});