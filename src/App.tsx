import { useState } from "react";

import './App.css'
import { Card } from './components/Card.tsx'
import { crearPartida } from './game/partida.ts';


function App() {
  const [partida, setPartida] = useState(crearPartida)
  
  const manoTurno = partida.jugadores[partida.turno].mano
  const pilaA = partida.pilas[0];
  const pilaB = partida.pilas[1];
   return (
      <main>
        <button onClick={() => setPartida(crearPartida())}>Nueva partida</button>
        <section id="center">
        
        <p>Ronda {partida.ronda} · Turno del jugador {partida.turno + 1}</p>
        <div>
          <div>
            <Card carta={pilaA[pilaA.length - 1]} /></div>
          <div>
            <div>Mazo: {partida.mazo.length} cartas</div>
          </div>
          <div><Card carta={pilaB[pilaB.length - 1]} /> </div>
        </div>
        <div>
          {manoTurno.map((x) => <Card key={`${x.palo}-${x.numero}`} carta={x}/>)}
        </div>
        
        
        
        
      </section>
      </main>
      
      )
}
export default App
