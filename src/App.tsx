import { useState } from "react";
import type { PilaId } from "./game/types.ts";
import "./App.css";
import { Card } from "./components/Card.tsx";
import { crearPartida } from "./game/partida.ts";
import { jugarCarta } from "./game/turno.ts";

function App() {
  const [partida, setPartida] = useState(crearPartida);
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const manoTurno = partida.jugadores[partida.turno].mano;
  const pilaA = partida.pilas[0];
  const pilaB = partida.pilas[1];
  function jugarEnPila(pila: PilaId) {
    if (seleccionada === null) {
    return;}
    setPartida(jugarCarta(partida, seleccionada, pila));
    setSeleccionada(null)
  
}


  return (
    <main>
      <p>
          Ronda {partida.ronda} · Turno del jugador {partida.turno + 1} Fase: {partida.fase.tipo}
        </p>
      <section>
        
        <div className="flex">
            <Card carta={pilaA[pilaA.length - 1]} onClick={() => jugarEnPila(0)} />
          
          
            <div>Mazo: {partida.mazo.length} cartas</div>
          
          
            <Card carta={pilaB[pilaB.length - 1]} onClick={() => jugarEnPila(1)}/>{" "}
          
        </div>
        <div className="flex">
          {manoTurno.map((carta, posicion) => (
            <Card
              key={`${carta.palo}-${carta.numero}`}
              carta={carta}
              onClick={() => setSeleccionada(posicion)}
            />
          ))}
        </div>
        <p>
          Seleccionada: {seleccionada === null ? "ninguna" : seleccionada + 1}
        </p>
      </section>
      <button onClick={() => setPartida(crearPartida())}>Nueva partida</button>
    </main>
  );
}
export default App;
