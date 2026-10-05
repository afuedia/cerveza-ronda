import './Card.css'
import type { Carta } from '../game/types'

type CardProps = { carta:Carta};

export function Card({ carta }:CardProps) {
   return (
      <div className="carta" data-palo={carta.palo}>
        {carta.numero}
      </div>
      )
}

