# Cerveza en Ronda — imagen de producción
# Dos etapas: la "cocina" construye la web y el "comedor" solo ejecuta el juego.
 
# ---------- Etapa 1: la cocina (construye la web) ----------
# Partimos de un Linux mínimo con Node 24 ya instalado.
# "AS construccion" le pone nombre para traer cosas de aquí más abajo.
FROM node:24-slim AS construccion
 
# Node trae npm, no pnpm. Corepack lo activa.
# La variable evita que corepack se pare a preguntar antes de descargar pnpm.
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
 
# Todo lo que sigue ocurre dentro de /app (es el "cd" del Dockerfile).
WORKDIR /app
 
# Primero SOLO la lista de dependencias y el lockfile.
# Si no cambian, Docker reutiliza la capa siguiente y no reinstala nada.
COPY package.json pnpm-lock.yaml ./
 
# Instala TODO (también Vite, TypeScript…), exactamente las versiones del lockfile.
RUN pnpm install --frozen-lockfile
 
# Ahora el resto del código del repo (menos lo que diga .dockerignore).
COPY . .
 
# Comprueba los tipos y construye la web → genera /app/dist
RUN pnpm build
 
 
# ---------- Etapa 2: el comedor (ejecuta el juego) ----------
# Caja limpia: nada de lo instalado en la cocina pasa aquí salvo lo que copiemos.
FROM node:24-slim
 
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /app
 
# Otra vez la lista de dependencias…
COPY package.json pnpm-lock.yaml ./
 
# …pero ahora solo las de producción: react, ws y tsx. Sin Vite ni TypeScript.
RUN pnpm install --prod --frozen-lockfile
 
# De la cocina nos traemos solo el plato: la web ya construida.
COPY --from=construccion /app/dist ./dist
 
# El servidor y la lógica del juego, con la MISMA estructura que en el repo
# (server/index.ts importa "../src/game/..." y busca "../dist").
COPY server ./server
COPY src/game ./src/game
 
# Puerto en el que escucha Node DENTRO del contenedor.
ENV PUERTO=8080
# Solo documenta el puerto; quien lo abre hacia fuera es "ports" en el compose.
EXPOSE 8080
 
# Al arrancar el contenedor: tsx ejecuta el servidor en TypeScript.
# Se llama directamente (no con "pnpm start") para que las señales de
# parada de Docker le lleguen a Node sin intermediarios.
CMD ["./node_modules/.bin/tsx", "server/index.ts"]
 