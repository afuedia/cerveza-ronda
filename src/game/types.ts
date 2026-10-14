export const PALOS = ['p1' , 'p2' , 'p3' , 'p4' , 'p5' , 'p6' , 'p7' , 'p8' , 'p9' , 'p10'] as const;
export type Palo = typeof PALOS[number];

export const NUMEROS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;
export type Numero = typeof NUMEROS[number];

export type Carta = {
  palo: Palo;
  numero: Numero;
}

export const JUGADORES = [0, 1] as const;
export type JugadorId = typeof JUGADORES[number];

export type Jugador = {
  mano: Carta[];
  reserva: Carta[]}

export type EstadoPartida = {
  mazo: Carta[];
  pilas: [Carta[], Carta[]];
  jugadores: [Jugador, Jugador];
  ronda: 1 | 2 | 3;
  turno: JugadorId;
  inicialRonda1: JugadorId;
  fase: Fase;
};

export type PilaId = 0 | 1;

export type Fase =
  | { tipo: 'jugando' }
  | { tipo: 'elegirCartaParaDar' }
  | { tipo: 'elegirRobo'; pilaJugada: PilaId }
  | { tipo: 'decidirCierre' }
  | { tipo: 'finPartida' };

  export type Caso = 'coincide' | 'mayor' | 'menor';

  export type OrigenRobo = 'mazo' | 'pila';

  export type Accion =
  | { tipo: "jugarCarta"; posicion: number; pila: PilaId }
  | { tipo: "darCarta"; indice: number }
  | { tipo: "robar"; origen: OrigenRobo }
  | { tipo: "decidirCierre"; cerrar: boolean }
  | { tipo: "crearPartida" };

  // Lo que ve un jugador concreto: el servidor se lo envía a cada uno.
// Se construye campo a campo (lista blanca) para que nada secreto se cuele.
export type VistaJugador = {
  yo: JugadorId;
  miMano: Carta[];
  miReserva: Carta[];
  rival: {
    cartasEnMano: number;
    cartasEnReserva: number;
  };
  cimas: [Carta, Carta];
  cartasEnMazo: number;
  ronda: EstadoPartida["ronda"];
  turno: JugadorId;
  fase: Fase;
  resultado: {
    puntos: [number, number];
    ganador: JugadorId | "empate";
  } | null;
};