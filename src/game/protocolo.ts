// Protocolo de mensajes entre cliente y servidor.
// Solo tipos: lo importan los dos lados para hablar el mismo idioma.
import type { Accion, VistaJugador } from "./types";

// ---------- Cliente → Servidor ----------
// El cliente nunca dice quién es: el servidor lo sabe por la conexión.
export type MensajeCliente =
  | { tipo: "accion"; accion: Accion };

// ---------- Servidor → Cliente ----------
export type MensajeServidor =
  | { tipo: "esperandoRival" }                  // estás dentro, falta el otro
  | { tipo: "salaLlena" }                       // ya hay dos jugadores
  | { tipo: "vista"; vista: VistaJugador };     // estado de la partida para ti