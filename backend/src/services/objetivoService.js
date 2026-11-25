import { objetivoModel } from '../models/objetivoModel.js';
import { tarefaModel } from '../models/tarefaModel.js';
import { erro } from '../utils/erro.js';

const STATUS = ['EM_ANDAMENTO', 'CONCLUIDO'];
const dataValida = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export const objetivoService = {
  listar(usuarioId) {
    return objetivoModel.listar(usuarioId);
  },

  buscarPorId(id, usuarioId) {
    const objetivo = objetivoModel.buscarPorId(id, usuarioId);
    if (!objetivo) throw erro(404, 'Objetivo não encontrado');
    return objetivo;
  },

  criar(usuarioId, { titulo, descricao, prazo, status = 'EM_ANDAMENTO' } = {}) {
    if (!titulo || !String(titulo).trim()) throw erro(400, 'Campo "titulo" é obrigatório');
    if (!STATUS.includes(status)) throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    if (prazo !== undefined && !dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (objetivoModel.existeTitulo(usuarioId, titulo)) throw erro(409, 'Você já tem um objetivo com este título');
    return objetivoModel.inserir(usuarioId, { titulo, descricao, prazo, status });
  },

  atualizar(id, usuarioId, dados = {}) {
    this.buscarPorId(id, usuarioId); // 404 se não existir ou for de outro usuário
    const { titulo, descricao, prazo, status } = dados;

    if (titulo !== undefined) {
      if (!String(titulo).trim()) throw erro(400, 'Campo "titulo" não pode ser vazio');
      if (objetivoModel.existeTitulo(usuarioId, titulo, id)) throw erro(409, 'Você já tem um objetivo com este título');
    }
    if (status !== undefined && !STATUS.includes(status)) {
      throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    }
    if (prazo !== undefined && !dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');

    const campos = Object.fromEntries(
      Object.entries({ titulo: titulo?.trim?.() ?? titulo, descricao, prazo, status }).filter(
        ([, v]) => v !== undefined
      )
    );
    return objetivoModel.atualizar(id, usuarioId, campos);
  },

  remover(id, usuarioId) {
    this.buscarPorId(id, usuarioId);
    if (tarefaModel.listarPorObjetivo(id, usuarioId).length > 0) {
      throw erro(409, 'Não é possível remover um objetivo que ainda tem tarefas');
    }
    objetivoModel.remover(id, usuarioId);
  },
};