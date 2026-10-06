import { PALOS, type Carta } from './types';

export function calcularPuntos(cartas: readonly Carta[]): number {
let total = 0;
for (const paloActual of PALOS) {
  const delPalo = cartas.filter((c) => c.palo === paloActual);
  
  if (delPalo.length > 0) {
    const numerosDelPalo = delPalo.map((c) => c.numero);
    const masBaja = Math.min(...numerosDelPalo);
    total += masBaja;
  }
  
 
  
}
  return total;
}

