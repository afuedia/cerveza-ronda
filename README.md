# Cerveza en Ronda 🍺

Juego de cartas para dos jugadores con temática de cerveza artesana.

Se juega en red local: cada jugador desde su dispositivo, con el servidor en un Debian casero.

Proyecto de aprendizaje de TypeScript, React y multijugador en tiempo real.

## Reglas

Las reglas completas están en [RULES.md](./RULES.md).

## Stack

- **Cliente:** React 19 + TypeScript + Vite
- **Lógica del juego:** TypeScript puro, sin dependencias de la interfaz (`src/game/`)
- **Tests:** Vitest
- **Servidor (próximamente):** Node + TypeScript + WebSockets

## Cómo arrancarlo

```bash
pnpm install   # instala las dependencias
pnpm dev       # arranca el servidor de desarrollo
pnpm test      # ejecuta los tests
```

## Estado

En desarrollo. Hito actual: lógica del juego en TypeScript puro.