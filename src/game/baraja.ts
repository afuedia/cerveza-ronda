import { PALOS, NUMEROS, type Carta } from './types';

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