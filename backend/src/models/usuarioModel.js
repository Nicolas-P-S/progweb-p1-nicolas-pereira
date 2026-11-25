import { db } from '../db.js';

export const usuarioModel = {
  buscarPorId(id) {
    return db.prepare('SELECT id, nome, email FROM usuarios WHERE id = ?').get(id) ?? null;
  },

  // Só o login usa o hash
  buscarPorEmailComSenha(email) {
    return db
      .prepare('SELECT id, nome, email, senha_hash AS senhaHash FROM usuarios WHERE email = ?')
      .get(email) ?? null;
  },

  existeEmail(email) {
    return db.prepare('SELECT 1 FROM usuarios WHERE email = ?').get(email) !== undefined;
  },

  inserir({ nome, email, senhaHash }) {
    const r = db
      .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
      .run(nome, email, senhaHash);
    return this.buscarPorId(r.lastInsertRowid);
  },
};