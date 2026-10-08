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