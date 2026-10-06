export const PALOS = ['p1' , 'p2' , 'p3' , 'p4' , 'p5' , 'p6' , 'p7' , 'p8' , 'p9' , 'p10'] as const;
// as const es tu promesa de que el contenido (del array) no va a cambiar nunca
export type Palo = typeof PALOS[number];
// Después de type Palo = TypeScript espera un tipo, y PALOS es un array que existe en JavaScript. Para pasar del mundo de los valores al de los tipos, usas typeof: typeof PALOS significa "el tipo que tiene PALOS"
// [number]: "el tipo de lo que hay en cualquier posición del array".


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
};

export type PilaId = 0 | 1;

export type Fase =
  | { tipo: 'jugando' }
  | { tipo: 'elegirCartaParaDar' }
  | { tipo: 'elegirRobo'; pilaJugada: PilaId }
  | { tipo: 'decidirCierre' }
  | { tipo: 'finPartida' };