# Cerveza en Ronda — Reglas (2 jugadores)

## Componentes

- 100 cartas: 10 palos (estilos de cerveza) × 10 números (del 1 al 10).
- No hay cartas de ronda: el juego muestra en pantalla la ronda actual.

## Objetivo

Se juegan **3 rondas**. Las cartas que te queden en la mano al terminar cada ronda se acumulan en tu **reserva**. Al final de la partida, gana quien tenga **menos puntos** en su reserva.

## Cálculo de puntos

Agrupa las cartas por palo y suma **solo la carta más baja de cada palo**.

> Ejemplo: tienes un 3, un 7 y un 8 de p2, y un 2 y un 10 de p5.
> Puntos: 3 (el más bajo de p2) + 2 (el más bajo de p5) = **5 puntos**.

Esta regla se usa tanto para la puntuación final como para el caso C del turno.

## Preparación

1. Se barajan las 100 cartas.
2. Se reparten 7 cartas a cada jugador.
3. Se ponen boca arriba las dos cartas siguientes, cada una formando una **pila de ofrenda**.
4. El resto queda boca abajo como **mazo**.
5. Se sortea quién empieza. *(Versión de mesa: empieza el último que haya tomado cerveza.)*

## Turno

En su turno, el jugador elige **qué carta** de su mano juega y **en qué pila** la pone. El efecto no se elige: depende de cómo es su carta comparada con la que había arriba de esa pila.

### Caso A: mismo palo o mismo número

El jugador entrega en secreto una carta de su mano a su rival. Si después de jugar ya no le quedan cartas, el rival roba en secreto la primera carta del mazo.

### Caso B: distinto palo y número mayor

El jugador elige entre:
- Robar la primera carta del mazo.
- Robar la carta de arriba de la otra pila. Si era la última carta de esa pila, se repone con la primera carta del mazo.

### Caso C: distinto palo y número menor

Se calculan los puntos de la mano del jugador.
- Si son **más de 3**, la partida sigue.
- Si son **3 o menos**, el jugador puede elegir enseñar su mano y **cerrar la ronda**, o seguir jugando.

Después de resolver cualquier caso, si la ronda no ha terminado, el turno pasa al rival.

## Fin de ronda

Una ronda termina cuando:
- Un jugador acaba su turno sin cartas en la mano, o
- Un jugador cierra la ronda en el caso C.

Las cartas que cada jugador tenga en la mano pasan a su reserva. La reserva es secreta y sus cartas ya no se pueden jugar.

## Nueva ronda

- Cada jugador roba 7 cartas del mazo.
- El jugador que empezó la ronda 1 empieza también las rondas impares. El otro, las pares.

## Mazo agotado

Si hay que robar y el mazo está vacío, se barajan todas las cartas de las dos pilas, **excepto la de arriba de cada una**, y forman un nuevo mazo.

## Fin de partida

Al terminar la última ronda, cada jugador revela su reserva y se calculan los puntos.

1. Gana quien tenga **menos puntos**.
2. Si hay empate: gana quien tenga **menos palos distintos** en su reserva.
3. Si sigue el empate: gana quien tenga **menos cartas** en su reserva.

## Información visible

| Elemento | Quién lo ve |
|---|---|
| Mi mano | Solo yo |
| Mano del rival | Nadie más que él. *Propuesta: los dos vemos cuántas cartas tiene.* |
| Carta de arriba de cada pila | Los dos |
| Cartas de debajo de las pilas | Nadie |
| Mazo | Nadie. *Propuesta: los dos vemos cuántas quedan.* |
| Carta entregada en el caso A | Quien la da y quien la recibe |
| Carta robada del mazo | Solo quien la roba |
| Mano de quien cierra en el caso C | Los dos, en el momento de cerrar |
| Reserva | Solo su dueño hasta el final. *Propuesta: los dos vemos cuántas cartas tiene.* |
| Ronda actual | Los dos |

## Decisiones de implementación

1. **Orden de los casos.** *Propuesta:* se comprueba primero el caso A (mismo palo **o** mismo número). Solo si no se cumple, se mira si es mayor (B) o menor (C). Un 5 de p3 sobre un 5 de p7 es caso A.
2. **Puntos en el caso C.** *Propuesta:* se cuentan **después** de jugar la carta, con la mano que te queda.
3. **Caso A que te deja sin cartas.** *Propuesta:* la ronda termina al final de ese turno, como dice la regla general.
4. **Mazo agotado al robar.** *Propuesta:* se rebaraja antes de robar. Si aun así no hay cartas (solo quedan las dos de arriba de las pilas), no se roba y el turno sigue.
5. **Mazo de la nueva ronda.** *Propuesta:* se usa el mazo tal como quedó. Solo se rebaraja si se agota.