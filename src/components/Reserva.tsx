import type { Carta } from "../game/types";
import { Card } from "./Card";

type ReservaProps = {
  cartas: readonly Carta[];
};

export function Reserva({ cartas }: ReservaProps) {
  return (
    
    <div className="reserva">
          {cartas.map((carta) => (
            <Card
              key={`${carta.palo}-${carta.numero}`}
              carta={carta}
                          
            />
          ))}
        </div>
  );
}