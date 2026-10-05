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