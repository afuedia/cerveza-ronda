import type { Fase, EstadoPartida } from "../game/types";

type MarcadorProps = {
  ronda: EstadoPartida["ronda"];   
  turno: EstadoPartida["turno"];
  fase:  Fase["tipo"];           
}

export function Marcador({ronda, turno, fase}: MarcadorProps) {

  return (
    <div>
      Ronda {ronda} · Turno del jugador {turno + 1} Fase:{" "}
        {fase}
    </div>
  )
}
