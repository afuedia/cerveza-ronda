import type { Carta } from "../game/types";
import { Card } from "./Card";

type ManoProps = {
  cartas: readonly Carta[];
  seleccionada: number | null;
  onPulsarCarta: (posicion: number) => void;
};

export function Mano({ cartas, seleccionada, onPulsarCarta }: ManoProps) {
  return (
    // aquí: el <div className="flex"> con el .map de App
    <div className="mano">
          {cartas.map((carta, posicion) => (
            <Card
              key={`${carta.palo}-${carta.numero}`}
              carta={carta}
              onClick={() => onPulsarCarta(posicion)}
              seleccionada= {seleccionada === posicion}
              
            />
          ))}
        </div>
  );
}