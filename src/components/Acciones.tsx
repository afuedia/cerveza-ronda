import type { Fase, OrigenRobo } from "../game/types";

type AccionesProps = {
  fase: Fase;
  onDecidirCierre: (cerrar: boolean) => void;
  onRobar: (origen: OrigenRobo) => void;
};

export function Acciones({ fase, onDecidirCierre, onRobar }: AccionesProps) {


  return (
    <div>
      {fase.tipo === "decidirCierre" && (
        <div>
          <button
            onClick={() => onDecidirCierre( true )}
          >
            Cerrar la ronda
          </button>
          <button
            onClick={() => onDecidirCierre(false )}
          >
            Seguir jugando
          </button>
        </div>
      )}
      {fase.tipo === "elegirCartaParaDar" && (
        <p>Elige una carta de tu mano para dársela a tu rival</p>
      )}
      {fase.tipo === "elegirRobo" && (
        <div>
          <button onClick={() => onRobar( "mazo" )}>
            Robar del Mazo
          </button>
          <button onClick={() => onRobar( "pila" )}>
            Robar de la Pila
          </button>
        </div>
      )}
    </div>
  );
}
