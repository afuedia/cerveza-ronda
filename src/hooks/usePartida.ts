import { useEffect, useRef, useState } from "react";
import type { Accion, OrigenRobo, PilaId, VistaJugador } from "../game/types";
import type { MensajeCliente, MensajeServidor } from "../game/protocolo";

// En qué punto está la conexión con la sala.
export type EstadoSala =
  | { tipo: "conectando" }
  | { tipo: "esperandoRival" }
  | { tipo: "salaLlena" }
  | { tipo: "jugando"; vista: VistaJugador };

   // El juego está en la ruta /ws del MISMO sitio que sirve la web.
   // location.host = "localhost:5173" en desarrollo, "192.168.0.52:3000" en casa…
   // Si la web llegara por https, el socket tendría que ir por wss (cifrado).
   const PROTOCOLO_WS = location.protocol === "https:" ? "wss" : "ws";
   const URL_SERVIDOR = `${PROTOCOLO_WS}://${location.host}/ws`;

export function usePartida() {
  const [sala, setSala] = useState<EstadoSala>({ tipo: "conectando" });
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  // La conexión no se pinta: se guarda en un ref, no en el estado.
  const socketRef = useRef<WebSocket | null>(null);

  // Abrir la conexión al montar el componente y cerrarla al desmontarlo.
  useEffect(() => {
    const socket = new WebSocket(URL_SERVIDOR);
    socketRef.current = socket;

    socket.onmessage = (evento) => {
      // Confiamos en NUESTRO servidor: no validamos lo que nos manda él.
      const mensaje = JSON.parse(evento.data) as MensajeServidor;
      switch (mensaje.tipo) {
        case "esperandoRival":
          setSala({ tipo: "esperandoRival" });
          break;
        case "salaLlena":
          setSala({ tipo: "salaLlena" });
          break;
        case "vista":
          setSala({ tipo: "jugando", vista: mensaje.vista });
          break;
      }
    };

    return () => socket.close();
  }, []);

  function enviar(accion: Accion) {
    const mensaje: MensajeCliente = { tipo: "accion", accion };
    socketRef.current?.send(JSON.stringify(mensaje));
  }

  const fase = sala.tipo === "jugando" ? sala.vista.fase.tipo : null;

  function jugarEnPila(pila: PilaId) {
    if (seleccionada === null) return;
    enviar({ tipo: "jugarCarta", posicion: seleccionada, pila });
    setSeleccionada(null);
  }

  function pulsarCartaDeMano(posicion: number) {
    if (fase === "elegirCartaParaDar") {
      enviar({ tipo: "darCarta", indice: posicion });
      return;
    }
    if (fase === "jugando") {
      setSeleccionada(posicion);
    }
  }

  function nuevaPartida() {
    enviar({ tipo: "crearPartida" });
    setSeleccionada(null);
  }

  function pulsarCierre(cerrar: boolean) {
    enviar({ tipo: "decidirCierre", cerrar });
  }

  function pulsarRobo(origen: OrigenRobo) {
    enviar({ tipo: "robar", origen });
  }

  return { sala, seleccionada, jugarEnPila, pulsarCartaDeMano, nuevaPartida, pulsarCierre, pulsarRobo };
}