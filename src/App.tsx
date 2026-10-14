import "./App.css";
import { Mano } from "./components/Mano.tsx";
import { Mesa } from "./components/Mesa.tsx";
import { Acciones } from "./components/Acciones.tsx";
import { calcularGanador, calcularPuntos } from "./game/puntos.ts";
import { usePartida } from "./hooks/usePartida.ts";
import { FinPartida } from "./components/FinPartida.tsx";
import { Marcador } from "./components/Marcador.tsx";

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
      < FinPartida puntos0={puntos0} puntos1={puntos1} ganador={ganador}/>
      )}
      <Marcador ronda={partida.ronda} turno={partida.turno} fase={partida.fase.tipo} />
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
