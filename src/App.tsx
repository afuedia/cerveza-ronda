import "./App.css";
import { Mano } from "./components/Mano.tsx";
import { Mesa } from "./components/Mesa.tsx";
import { Acciones } from "./components/Acciones.tsx";
import { calcularGanador, calcularPuntos } from "./game/puntos.ts";
import { usePartida } from "./hooks/usePartida.ts";

function App() {
  const {
    nuevaPartida,
    pulsarCierre,
    pulsarRobo,
    partida,
    seleccionada,
    jugarEnPila,
    pulsarCartaDeMano,
  } = usePartida();
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
          <p>
            {ganador === "empate"
              ? "¡Empate!"
              : `Ganador: jugador ${ganador + 1}`}
          </p>
        </div>
      )}
      <p>
        Ronda {partida.ronda} · Turno del jugador {partida.turno + 1} Fase:{" "}
        {partida.fase.tipo}
      </p>
      <section>
        <Mesa
          pilaA={pilaA}
          pilaB={pilaB}
          cartasEnMazo={partida.mazo.length}
          onPulsarPila={jugarEnPila}
        />
        <Mano
          cartas={manoTurno}
          seleccionada={seleccionada}
          onPulsarCarta={pulsarCartaDeMano}
        />
        <p>
          Seleccionada: {seleccionada === null ? "ninguna" : seleccionada + 1}
        </p>
      </section>
      <Acciones fase={partida.fase} onDecidirCierre={pulsarCierre} onRobar={pulsarRobo} />

      <button onClick={nuevaPartida}>Nueva partida</button>
    </main>
  );
}
export default App;
