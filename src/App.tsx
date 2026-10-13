import { useState, useReducer } from "react";
import { partidaReducer } from "./game/reducer.ts";
import type { PilaId } from "./game/types.ts";
import "./App.css";
import { Card } from "./components/Card.tsx";
import { crearPartida } from "./game/partida.ts";
import { calcularGanador, calcularPuntos } from "./game/puntos.ts";

function App() {
  const [partida, despachar] = useReducer(partidaReducer, undefined, crearPartida);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const manoTurno = partida.jugadores[partida.turno].mano;
  const pilaA = partida.pilas[0];
  const pilaB = partida.pilas[1];
  const puntos0 = calcularPuntos(partida.jugadores[0].reserva);
  const puntos1 = calcularPuntos(partida.jugadores[1].reserva);
  const ganador = calcularGanador(partida);
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

  return (
    <main>
      {partida.fase.tipo === "finPartida" && (
  <div>
    <h2>Fin de la partida</h2>
    <p>Jugador 1: {puntos0} puntos</p>
    <p>Jugador 2: {puntos1} puntos</p>
    <p>{ganador === "empate" ? "¡Empate!" : `Ganador: jugador ${ganador + 1}`}</p>
  </div>
)}
      <p>
        Ronda {partida.ronda} · Turno del jugador {partida.turno + 1} Fase:{" "}
        {partida.fase.tipo}
      </p>
      <section>
        <div className="flex">
          <Card
            carta={pilaA[pilaA.length - 1]}
            onClick={() => jugarEnPila(0)}
          />
          <div>Mazo: {partida.mazo.length} cartas</div>
          <Card
            carta={pilaB[pilaB.length - 1]}
            onClick={() => jugarEnPila(1)}
          />
        </div>
        <div className="flex">
          {manoTurno.map((carta, posicion) => (
            <Card
              key={`${carta.palo}-${carta.numero}`}
              carta={carta}
              onClick={() => pulsarCartaDeMano(posicion)}
              seleccionada= {seleccionada === posicion}
              
            />
          ))}
        </div>
        <p>
          Seleccionada: {seleccionada === null ? "ninguna" : seleccionada + 1}
        </p>
      </section>
      {partida.fase.tipo === "decidirCierre" && (
        <div>
          <button onClick={() => despachar({tipo: "decidirCierre", cerrar: true })}>
            Cerrar la ronda
          </button>
          <button onClick={() => despachar({tipo: "decidirCierre",cerrar: false})}>
            Seguir jugando
          </button>
        </div>
      )}
      {partida.fase.tipo === "elegirCartaParaDar" && (
        <p>Elige una carta de tu mano para dársela a tu rival</p>
        )}
      {partida.fase.tipo === "elegirRobo" && (
        <div>
          <button onClick={() => despachar({tipo: "robar", origen: "mazo"})}>
            Robar del Mazo
          </button>
          <button onClick={() => despachar({tipo: "robar", origen: "pila"})}>
            Robar de la Pila
          </button>
        </div>
      )}

      <button onClick={() => {despachar({ tipo: "crearPartida" }); setSeleccionada(null)}}>Nueva partida</button>
    </main>
  );
}
export default App;
