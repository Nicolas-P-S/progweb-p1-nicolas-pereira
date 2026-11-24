import { DatabaseSync } from 'node:sqlite';

const arquivo = process.env.DB_FILE ?? 'banco.db';
export const db = new DatabaseSync(arquivo);

// No SQLite a checagem de chave estrangeira vem desligada.
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS objetivos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo    TEXT NOT NULL UNIQUE COLLATE NOCASE,
    descricao TEXT,
    prazo     TEXT,
    status    TEXT NOT NULL CHECK (status IN ('EM_ANDAMENTO', 'CONCLUIDO'))
  );

  CREATE TABLE IF NOT EXISTS tarefas (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT NOT NULL,
    prazo       TEXT NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('PENDENTE', 'CONCLUIDA')),
    objetivo_id INTEGER NOT NULL REFERENCES objetivos(id)
  );
`);