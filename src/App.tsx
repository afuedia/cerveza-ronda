import "./App.css";
import { Mano } from "./components/Mano.tsx";
import { Reserva } from "./components/Reserva.tsx";
import { Mesa } from "./components/Mesa.tsx";
import { Acciones } from "./components/Acciones.tsx";
import { usePartida } from "./hooks/usePartida.ts";
import { FinPartida } from "./components/FinPartida.tsx";
import { Marcador } from "./components/Marcador.tsx";

function App() {
  const {
    sala,
    seleccionada,
    jugarEnPila,
    pulsarCartaDeMano,
    nuevaPartida,
    pulsarCierre,
    pulsarRobo,
  } = usePartida();

  if (sala.tipo === "conectando") return <p>Conectando con el servidor…</p>;
  if (sala.tipo === "esperandoRival") return <p>Esperando a tu rival…</p>;
  if (sala.tipo === "salaLlena") return <p>La sala está llena: ya hay dos jugadores.</p>;

  // A partir de aquí, TS sabe que sala.tipo es "jugando" y que existe sala.vista.
  const { vista } = sala;
  const esMiTurno = vista.yo === vista.turno;

  return (
    <main>
      {vista.resultado !== null && (
        <>
          <FinPartida
            puntos0={vista.resultado.puntos[0]}
            puntos1={vista.resultado.puntos[1]}
            ganador={vista.resultado.ganador}
          />
          <button onClick={nuevaPartida}>Nueva partida</button>
        </>
      )}
      <p>
        Eres el jugador {vista.yo + 1} · {esMiTurno ? "te toca" : "turno de tu rival"} ·
        Tu rival tiene {vista.rival.cartasEnMano} cartas en mano
      </p>
      <Marcador ronda={vista.ronda} turno={vista.turno} fase={vista.fase.tipo} />
      <section>
        <Mesa
          pilaA={[vista.cimas[0]]}
          pilaB={[vista.cimas[1]]}
          cartasEnMazo={vista.cartasEnMazo}
          onPulsarPila={jugarEnPila}
        />
        <Mano
          cartas={vista.miMano}
          seleccionada={seleccionada}
          onPulsarCarta={pulsarCartaDeMano}
        />
        <Reserva cartas={vista.miReserva}/>
      </section>
      {esMiTurno && (
        <Acciones fase={vista.fase} onDecidirCierre={pulsarCierre} onRobar={pulsarRobo} />
      )}
    </main>
  );
}
export default App;