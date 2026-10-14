import type { JugadorId } from "../game/types";

type FinPartidaProps = {
  puntos0: number;
  puntos1: number;
  ganador: JugadorId | "empate";
};

export function FinPartida({ puntos0, puntos1, ganador }: FinPartidaProps) {
  return (
    <div className="flex">
      
        <h2>Fin de la partida</h2>
        <p>Jugador 1: {puntos0} puntos</p>
        <p>Jugador 2: {puntos1} puntos</p>
        <p>
          {ganador === "empate"
            ? "¡Empate!"
            : `Ganador: jugador ${ganador + 1}`}
        </p>
      
    </div>
  );
}
