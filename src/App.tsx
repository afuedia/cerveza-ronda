import "./App.css";
import { Mano } from "./components/Mano.tsx";
import { Card } from "./components/Card.tsx";
import { calcularGanador, calcularPuntos } from "./game/puntos.ts";
import { usePartida } from "./hooks/usePartida.ts";

function App() {
  const { nuevaPartida, despachar, partida, seleccionada, jugarEnPila, pulsarCartaDeMano } = usePartida();
  const manoTurno = partida.jugadores[partida.turno].mano;
  const pilaA = partida.pilas[0];
  const pilaB = partida.pilas[1];
  const puntos0 = calcularPuntos(partida.jugadores[0].reserva);
  const puntos1 = calcularPuntos(partida.jugadores[1].reserva);
  const ganador = calcularGanador(partida);

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
        <Mano cartas={manoTurno} seleccionada={seleccionada} onPulsarCarta={pulsarCartaDeMano}/>
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

      <button onClick={nuevaPartida}>Nueva partida</button>
    </main>
  );
}
export default App;
