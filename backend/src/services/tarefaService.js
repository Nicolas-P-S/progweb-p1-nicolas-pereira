import { tarefaModel } from '../models/tarefaModel.js';
import { objetivoModel } from '../models/objetivoModel.js';
import { erro } from '../utils/erro.js';

const STATUS = ['PENDENTE', 'CONCLUIDA'];
const dataValida = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export const tarefaService = {
  listar(usuarioId, objetivoId) {
    if (objetivoId) return tarefaModel.listarPorObjetivo(Number(objetivoId), usuarioId);
    return tarefaModel.listar(usuarioId);
  },

  buscarPorId(id, usuarioId) {
    const tarefa = tarefaModel.buscarPorId(id, usuarioId);
    if (!tarefa) throw erro(404, 'Tarefa não encontrada');
    return tarefa;
  },

  criar(usuarioId, { titulo, prazo, status = 'PENDENTE', objetivoId } = {}) {
    if (!titulo || !String(titulo).trim() || !prazo || !objetivoId) {
      throw erro(400, 'Campos "titulo", "prazo" e "objetivoId" são obrigatórios');
    }
    if (!dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (!STATUS.includes(status)) throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    // O objetivo precisa existir E ser do usuário
    if (!objetivoModel.buscarPorId(Number(objetivoId), usuarioId)) throw erro(422, 'Objetivo informado não existe');
    return tarefaModel.inserir({ titulo, prazo, status, objetivoId });
  },

  atualizar(id, usuarioId, dados = {}) {
    this.buscarPorId(id, usuarioId); // 404 se não existir ou for de outro usuário
    const { titulo, prazo, status, objetivoId } = dados;

    if (titulo !== undefined && !String(titulo).trim()) throw erro(400, 'Campo "titulo" não pode ser vazio');
    if (prazo !== undefined && !dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (status !== undefined && !STATUS.includes(status)) {
      throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    }
    if (objetivoId !== undefined && !objetivoModel.buscarPorId(Number(objetivoId), usuarioId)) {
      throw erro(422, 'Objetivo informado não existe');
    }

    const campos = Object.fromEntries(
      Object.entries({
        titulo: titulo?.trim?.() ?? titulo,
        prazo,
        status,
        objetivoId: objetivoId !== undefined ? Number(objetivoId) : undefined,
      }).filter(([, v]) => v !== undefined)
    );
    return tarefaModel.atualizar(id, usuarioId, campos);
  },

  remover(id, usuarioId) {
    if (!tarefaModel.remover(id, usuarioId)) throw erro(404, 'Tarefa não encontrada');
  },
};