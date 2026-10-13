import './Card.css'
import type { Carta} from '../game/types'

type CardProps = { carta:Carta;
  onClick?: () => void;
  seleccionada?: boolean;
};

export function Card({ carta, onClick, seleccionada }:CardProps) {
   return (
      <article className={seleccionada ? "carta seleccionada" : "carta"} data-palo={carta.palo} onClick={onClick}>
        <header>{carta.numero}</header>
        <figure>
          {/* Aquí pendiente de poner imagenes */}
        </figure>
        <footer>{carta.numero}</footer>
        
        
      </article>
      )
}

