import './App.css'
import { Card } from './components/Card.tsx'
import { crearBaraja } from './game/baraja.ts'

function App() {
  const baraja = crearBaraja();
   return (
      <section id="center">
        {baraja.map((x) => <Card key={`${x.palo}-${x.numero}`} carta={x}/>)}
        
        
        
      </section>
      )
}
export default App
