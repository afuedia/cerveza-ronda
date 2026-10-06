import './App.css'
import { Card } from './components/Card.tsx'
import { crearBaraja, barajarBaraja } from './game/baraja.ts'


function App() {
  const baraja = crearBaraja();
  const mazo = barajarBaraja(baraja);
   return (
      <section id="center">
        {mazo.map((x) => <Card key={`${x.palo}-${x.numero}`} carta={x}/>)}
        
        
        
      </section>
      )
}
export default App
