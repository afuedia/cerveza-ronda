import { PALOS, NUMEROS, type Carta } from './types';
import type { EstadoPartida } from './types';

export function crearBaraja():Carta[] {
  
  const baraja:Carta[] = []
  
  for (const x of PALOS) {
    for (const y of NUMEROS) {
      baraja.push({palo: x, numero: y})
    }
  }                       
  return baraja


}

export function barajarBaraja(baraja: readonly Carta[]):Carta[] {
  const copia:Carta[] = [...baraja];
  for (let i=copia.length-1; i > 0; i--) {
    const aleatorio = Math.floor(Math.random() * (i+1));
    [copia[i], copia[aleatorio]] = [copia[aleatorio], copia[i]];
  }
  
  return copia;
}

export function rebarajarPilas(estado: EstadoPartida): EstadoPartida {
  const pila0 = estado.pilas[0];
  const cima0 = pila0[pila0.length - 1];
  const resto0 = pila0.slice(0, pila0.length - 1);

  const pila1 = estado.pilas[1];
  const cima1 = pila1[pila1.length - 1];
  const resto1 = pila1.slice(0, pila1.length - 1);

  const nuevoMazo = barajarBaraja([...estado.mazo, ...resto0, ...resto1]) ;

  return {
    ...estado,
    mazo: nuevoMazo,
    pilas: [[cima0],[cima1]],
  }
}