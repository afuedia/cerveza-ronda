import './Card.css'
import type { Carta } from '../game/types'

type CardProps = { carta:Carta};

export function Card({ carta }:CardProps) {
   return (
      <article className="carta" data-palo={carta.palo}>
        <header>{carta.numero}</header>
        <figure>
          {/* Aquí pendiente de poner imagenes */}
        </figure>
        <footer>{carta.numero}</footer>
        
        
      </article>
      )
}

