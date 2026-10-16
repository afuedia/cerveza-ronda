import type { Fase, EstadoPartida } from "../game/types";

type MarcadorProps = {
     
  turno: EstadoPartida["turno"];
  fase:  Fase["tipo"];           
}

export function Marcador({turno, fase}: MarcadorProps) {

  return (
    <div>
      Turno del jugador {turno + 1} Fase:{" "}
        {fase}
    </div>
  )
}
