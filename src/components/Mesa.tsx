import type { Carta, PilaId } from "../game/types";
import { Card } from "./Card";

type MesaProps = {
  pilaA: readonly Carta[];
  pilaB: readonly Carta[];
  cartasEnMazo: number;
  onPulsarPila: (pila: PilaId) => void;
};

export function Mesa({ pilaA, pilaB, cartasEnMazo, onPulsarPila }: MesaProps) {
  return (
    <div className="mesa">
      <Card carta={pilaA[pilaA.length - 1]} onClick={() => onPulsarPila(0)} />
      <div className="mazo">Mazo: {cartasEnMazo} cartas</div>
      <Card carta={pilaB[pilaB.length - 1]} onClick={() => onPulsarPila(1)} />
    </div>
  );
}