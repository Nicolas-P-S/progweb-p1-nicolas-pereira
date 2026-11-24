import { db } from '../db.js';

// Banco: snake_case (objetivo_id). API/front: camelCase (objetivoId).
const COLUNAS = 'id, titulo, prazo, status, objetivo_id AS objetivoId';

export const tarefaModel = {
  listar() {
    return db.prepare(`SELECT ${COLUNAS} FROM tarefas ORDER BY id`).all();
  },

  listarPorObjetivo(objetivoId) {
    return db
      .prepare(`SELECT ${COLUNAS} FROM tarefas WHERE objetivo_id = ? ORDER BY id`)
      .all(objetivoId);
  },

  buscarPorId(id) {
    return db.prepare(`SELECT ${COLUNAS} FROM tarefas WHERE id = ?`).get(id) ?? null;
  },

  inserir({ titulo, prazo, status, objetivoId }) {
    const r = db
      .prepare('INSERT INTO tarefas (titulo, prazo, status, objetivo_id) VALUES (?, ?, ?, ?)')
      .run(titulo.trim(), prazo, status, Number(objetivoId));
    return this.buscarPorId(r.lastInsertRowid);
  },

  atualizar(id, dados) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE tarefas SET titulo = ?, prazo = ?, status = ?, objetivo_id = ? WHERE id = ?')
      .run(novo.titulo, novo.prazo, novo.status, Number(novo.objetivoId), id);
    return this.buscarPorId(id);
  },

  remover(id) {
    const r = db.prepare('DELETE FROM tarefas WHERE id = ?').run(id);
    return r.changes > 0;
  },
};