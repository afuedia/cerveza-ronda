import './App.css'
import { Card } from './components/Card.tsx'

function App() {
   return (
      <section id="center">
        
        <Card carta={{ palo: 'p1', numero: 8 }}/>
        <Card carta={{ palo: 'p2', numero: 9 }}/>
        <Card carta={{ palo: 'p3', numero: 10 }}/>
        
      </section>
      )
}
export default App
