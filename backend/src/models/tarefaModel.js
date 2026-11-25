import { db } from '../db.js';

// A tarefa é do usuário por meio do objetivo: todo SELECT faz JOIN para conferir o dono.
const COLUNAS = 't.id, t.titulo, t.prazo, t.status, t.objetivo_id AS objetivoId';
const DO_USUARIO = 'FROM tarefas t JOIN objetivos o ON o.id = t.objetivo_id WHERE o.usuario_id = ?';

export const tarefaModel = {
  listar(usuarioId) {
    return db.prepare(`SELECT ${COLUNAS} ${DO_USUARIO} ORDER BY t.id`).all(usuarioId);
  },

  listarPorObjetivo(objetivoId, usuarioId) {
    return db
      .prepare(`SELECT ${COLUNAS} ${DO_USUARIO} AND t.objetivo_id = ? ORDER BY t.id`)
      .all(usuarioId, objetivoId);
  },

  buscarPorId(id, usuarioId) {
    return db
      .prepare(`SELECT ${COLUNAS} ${DO_USUARIO} AND t.id = ?`)
      .get(usuarioId, id) ?? null;
  },

  // O service já conferiu que o objetivo é do usuário
  inserir({ titulo, prazo, status, objetivoId }) {
    const r = db
      .prepare('INSERT INTO tarefas (titulo, prazo, status, objetivo_id) VALUES (?, ?, ?, ?)')
      .run(titulo.trim(), prazo, status, Number(objetivoId));
    return db.prepare(`SELECT ${COLUNAS} FROM tarefas t WHERE t.id = ?`).get(r.lastInsertRowid);
  },

  // O service já conferiu o dono (via buscarPorId) antes de chamar
  atualizar(id, usuarioId, dados) {
    const atual = this.buscarPorId(id, usuarioId);
    if (!atual) return null;
    const novo = { ...atual, ...dados };
    db.prepare('UPDATE tarefas SET titulo = ?, prazo = ?, status = ?, objetivo_id = ? WHERE id = ?')
      .run(novo.titulo, novo.prazo, novo.status, Number(novo.objetivoId), id);
    return this.buscarPorId(id, usuarioId);
  },

  remover(id, usuarioId) {
    const r = db
      .prepare('DELETE FROM tarefas WHERE id = ? AND objetivo_id IN (SELECT id FROM objetivos WHERE usuario_id = ?)')
      .run(id, usuarioId);
    return r.changes > 0;
  },
};