import { db } from './db.js';
import { gerarHash } from './utils/senha.js';

// Só entra se o banco estiver vazio. No Render grátis o arquivo some a
// cada reinício; assim a demonstração nunca abre vazia.
const { total } = db.prepare('SELECT COUNT(*) AS total FROM usuarios').get();

if (total === 0) {
  const u = db
    .prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
    .run('Usuário Demo', 'demo@exemplo.com', gerarHash('demo123'));
  const usuarioId = Number(u.lastInsertRowid);

  const novoObjetivo = db.prepare(
    'INSERT INTO objetivos (titulo, descricao, prazo, status, usuario_id) VALUES (?, ?, ?, ?, ?)'
  );
  const novaTarefa = db.prepare(
    'INSERT INTO tarefas (titulo, prazo, status, objetivo_id) VALUES (?, ?, ?, ?)'
  );

  const sql = Number(
    novoObjetivo.run('Aprender SQL', 'Do básico ao avançado', '2026-12-31', 'EM_ANDAMENTO', usuarioId).lastInsertRowid
  );
  const ingles = Number(
    novoObjetivo.run('Estudar inglês', 'Conversação para viagens', '2027-03-01', 'EM_ANDAMENTO', usuarioId).lastInsertRowid
  );

  novaTarefa.run('Revisar JOINs', '2026-12-05', 'PENDENTE', sql);
  novaTarefa.run('Praticar GROUP BY', '2026-12-10', 'CONCLUIDA', sql);
  novaTarefa.run('Assistir 3 episódios sem legenda', '2026-12-15', 'PENDENTE', ingles);
}