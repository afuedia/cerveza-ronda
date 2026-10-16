import "./card.css";
import "./Ronda.css";
import type { EstadoPartida } from "../game/types";
type RondaProps = { ronda: EstadoPartida["ronda"] };
export function Ronda({ ronda }: RondaProps) {
  return <article className="carta ronda">
    <div>{ronda}</div></article>;
}
