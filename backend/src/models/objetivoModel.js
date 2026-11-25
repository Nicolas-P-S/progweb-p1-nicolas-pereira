import { db } from '../db.js';

const COLUNAS = 'id, titulo, descricao, prazo, status';

export const objetivoModel = {
  listar(usuarioId) {
    return db.prepare(`SELECT ${COLUNAS} FROM objetivos WHERE usuario_id = ? ORDER BY id`).all(usuarioId);
  },

  buscarPorId(id, usuarioId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM objetivos WHERE id = ? AND usuario_id = ?`)
      .get(id, usuarioId) ?? null;
  },

  // A coluna é NOCASE: a comparação ignora maiúsculas. Vale só dentro do mesmo usuário.
  existeTitulo(usuarioId, titulo, ignorarId = null) {
    const linha = db
      .prepare('SELECT 1 FROM objetivos WHERE usuario_id = ? AND titulo = ? AND id IS NOT ?')
      .get(usuarioId, titulo.trim(), ignorarId);
    return linha !== undefined;
  },

  inserir(usuarioId, { titulo, descricao, prazo, status }) {
    const r = db
      .prepare('INSERT INTO objetivos (titulo, descricao, prazo, status, usuario_id) VALUES (?, ?, ?, ?, ?)')
      .run(titulo.trim(), descricao ?? null, prazo ?? null, status, usuarioId);
    return this.buscarPorId(r.lastInsertRowid, usuarioId);
  },

  atualizar(id, usuarioId, dados) {
    const atual = this.buscarPorId(id, usuarioId);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE objetivos SET titulo = ?, descricao = ?, prazo = ?, status = ? WHERE id = ? AND usuario_id = ?')
      .run(novo.titulo, novo.descricao ?? null, novo.prazo ?? null, novo.status, id, usuarioId);
    return this.buscarPorId(id, usuarioId);
  },

  remover(id, usuarioId) {
    const r = db.prepare('DELETE FROM objetivos WHERE id = ? AND usuario_id = ?').run(id, usuarioId);
    return r.changes > 0;
  },
};