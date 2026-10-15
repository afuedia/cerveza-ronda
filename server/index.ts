// Servidor de Cerveza en Ronda: una sala de 2 jugadores.
// El servidor guarda la partida entera y es el único que la modifica.
// Cada jugador manda acciones y recibe solo su vista.
import { WebSocketServer, type WebSocket } from "ws";
import type { EstadoPartida, JugadorId } from "../src/game/types";
import type { MensajeServidor } from "../src/game/protocolo";
import { crearPartida } from "../src/game/partida";
import { partidaReducer } from "../src/game/reducer";
import { vistaPara } from "../src/game/vistaPara";
import { leerMensajeCliente } from "../src/game/validacion";

const PUERTO = Number(process.env.PUERTO ?? 8080);

// ---------- Estado de la sala ----------
// asientos[0] es la conexión del jugador 0, asientos[1] la del jugador 1.
const asientos: [WebSocket | null, WebSocket | null] = [null, null];
let partida: EstadoPartida | null = null;

// ---------- Ayudantes ----------
function enviar(conexion: WebSocket, mensaje: MensajeServidor): void {
  conexion.send(JSON.stringify(mensaje));
}

function buscarAsientoLibre(): JugadorId | null {
  if (asientos[0] === null) return 0;
  if (asientos[1] === null) return 1;
  return null;
}

// Manda a cada jugador conectado SU vista de la partida.
function repartirVistas(estado: EstadoPartida): void {
  for (const jugador of [0, 1] as const) {
    const conexion = asientos[jugador];
    if (conexion !== null) {
      enviar(conexion, { tipo: "vista", vista: vistaPara(estado, jugador) });
    }
  }
}

// ---------- Servidor ----------
const servidor = new WebSocketServer({ port: PUERTO });

servidor.on("connection", (conexion) => {
  // 1. Asignar asiento (lo decide el servidor, nunca el cliente)
  const asiento = buscarAsientoLibre();
  if (asiento === null) {
    enviar(conexion, { tipo: "salaLlena" });
    conexion.close();
    return;
  }
  asientos[asiento] = conexion;
  console.log(`Jugador ${asiento} conectado`);

  // 2. Empezar la partida o esperar al rival
  if (asientos[0] !== null && asientos[1] !== null) {
    partida ??= crearPartida(); // solo se crea si no había una a medias
    repartirVistas(partida);
  } else {
    enviar(conexion, { tipo: "esperandoRival" });
  }

  // 3. Cada mensaje: validar → reducer con el asiento de ESTA conexión → vistas
  conexion.on("message", (datos) => {
    const mensaje = leerMensajeCliente(datos.toString());
    if (mensaje === null) {
      console.log(`Jugador ${asiento}: mensaje inválido, ignorado`);
      return;
    }
    if (partida === null) return; // aún no hay partida

    switch (mensaje.tipo) {
      case "accion": {
        const nueva = partidaReducer(partida, mensaje.accion, asiento);
        if (nueva === partida) return; // mismo objeto = acción ignorada
        partida = nueva;
        repartirVistas(partida);
        break;
      }
    }
  });

  // 4. Al irse, el asiento queda libre (la partida se conserva)
  conexion.on("close", () => {
    asientos[asiento] = null;
    console.log(`Jugador ${asiento} desconectado`);
  });
});

console.log(`Servidor escuchando en ws://localhost:${PUERTO}`);