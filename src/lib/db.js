// src/lib/db.js
import Database from "better-sqlite3";

const db = new Database("lavacontrol.db");

// Crear tabla si no existe
db.prepare(`
  CREATE TABLE IF NOT EXISTS fichas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref_payco TEXT UNIQUE,
    used BOOLEAN DEFAULT 0,
    used_washer TIMESTAMP,
    used_dryer TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;
