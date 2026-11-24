import { db } from '../db.js';

export const objetivoModel = {
  listar() {
    return db.prepare('SELECT * FROM objetivos ORDER BY id').all();
  },

  buscarPorId(id) {
    return db.prepare('SELECT * FROM objetivos WHERE id = ?').get(id) ?? null;
  },

  // ignorarId serve para o PUT não achar o próprio objetivo como duplicado
  existeTitulo(titulo, ignorarId = null) {
    const linha = db
      .prepare('SELECT 1 FROM objetivos WHERE lower(titulo) = lower(?) AND id IS NOT ?')
      .get(titulo.trim(), ignorarId);
    return linha !== undefined;
  },

  inserir({ titulo, descricao, prazo, status }) {
    const r = db
      .prepare('INSERT INTO objetivos (titulo, descricao, prazo, status) VALUES (?, ?, ?, ?)')
      .run(titulo.trim(), descricao ?? null, prazo ?? null, status);
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE objetivos SET titulo = ?, descricao = ?, prazo = ?, status = ? WHERE id = ?')
      .run(novo.titulo, novo.descricao ?? null, novo.prazo ?? null, novo.status, id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM objetivos WHERE id = ?').run(id);
    return r.changes > 0;
  },
};