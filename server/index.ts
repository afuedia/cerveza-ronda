// Servidor de eco: devuelve a cada cliente lo que le manda.
// Paso 4 del Hito 4: comprobar que Node + TypeScript + WebSocket funcionan.
import { WebSocketServer } from "ws";

// Variable de entorno PUERTO, o 8080 si no existe.
const PUERTO = Number(process.env.PUERTO ?? 8080);

const servidor = new WebSocketServer({ port: PUERTO });

// Node trabaja con eventos: "cuando pase X, ejecuta esta función".
servidor.on("connection", (conexion) => {
  console.log("Alguien se ha conectado");

  conexion.on("message", (datos) => {
    const texto = datos.toString();
    console.log("Recibido:", texto);
    conexion.send(`Eco: ${texto}`);
  });

  conexion.on("close", () => {
    console.log("Alguien se ha desconectado");
  });
});

console.log(`Servidor escuchando en ws://localhost:${PUERTO}`);