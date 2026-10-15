// Servidor de Cerveza en Ronda: una sala de 2 jugadores.
// El servidor guarda la partida entera y es el único que la modifica.
// Cada jugador manda acciones y recibe solo su vista.
//
// Un solo puerto para todo:
//   - HTTP normal  → sirve la web compilada (carpeta dist/)
//   - HTTP en /ws  → se "convierte" en WebSocket para jugar
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, type WebSocket } from "ws";
import type { EstadoPartida, JugadorId } from "../src/game/types";
import type { MensajeServidor } from "../src/game/protocolo";
import { crearPartida } from "../src/game/partida";
import { partidaReducer } from "../src/game/reducer";
import { vistaPara } from "../src/game/vistaPara";
import { leerMensajeCliente } from "../src/game/validacion";

const PUERTO = Number(process.env.PUERTO ?? 8080);

// dist/ está un nivel por encima de esta carpeta (server/)
const CARPETA_WEB = fileURLToPath(new URL("../dist", import.meta.url));

// ---------- Estado de la sala ----------
// asientos[0] es la conexión del jugador 0, asientos[1] la del jugador 1.
const asientos: [WebSocket | null, WebSocket | null] = [null, null];
let partida: EstadoPartida | null = null;

// ---------- Ayudantes del juego ----------
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

// ---------- Servir la web (archivos de dist/) ----------
const TIPOS: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json",
};

async function servirArchivo(peticion: IncomingMessage, respuesta: ServerResponse): Promise<void> {
  // De la URL solo nos interesa la ruta ("/assets/index-7dTb6kvq.js"), sin "?..."
  const ruta = new URL(peticion.url ?? "/", "http://x").pathname;
  const relativa = ruta === "/" ? "/index.html" : decodeURIComponent(ruta);
  const archivo = resolve(CARPETA_WEB, "." + relativa);

  // Seguridad: que nadie pida "/../server/index.ts" y salga de dist/
  if (!archivo.startsWith(CARPETA_WEB + sep)) {
    respuesta.writeHead(403).end("Prohibido");
    return;
  }

  try {
    const contenido = await readFile(archivo);
    respuesta.writeHead(200, {
      "Content-Type": TIPOS[extname(archivo)] ?? "application/octet-stream",
      // Los de assets/ llevan huella en el nombre: se pueden guardar para siempre.
      // index.html no: el navegador debe preguntar siempre si hay versión nueva.
      "Cache-Control": relativa.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "no-cache",
    });
    respuesta.end(contenido);
  } catch {
    respuesta.writeHead(404).end("No encontrado");
  }
}

// ---------- Servidor ----------
const servidorHttp = createServer((peticion, respuesta) => {
  void servirArchivo(peticion, respuesta);
});

// El WebSocket va "montado" sobre el servidor HTTP, solo en la ruta /ws
const servidor = new WebSocketServer({ server: servidorHttp, path: "/ws" });

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

servidorHttp.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO} (juego en /ws)`);
});
