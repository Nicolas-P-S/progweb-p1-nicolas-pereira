import { objetivoModel } from '../models/objetivoModel.js';
import { tarefaModel } from '../models/tarefaModel.js';
import { erro } from '../utils/erro.js';

const STATUS = ['EM_ANDAMENTO', 'CONCLUIDO'];
const dataValida = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export const objetivoService = {
  listar() {
    return objetivoModel.listar();
  },

  buscarPorId(id) {
    const objetivo = objetivoModel.buscarPorId(id);
    if (!objetivo) throw erro(404, 'Objetivo não encontrado');
    return objetivo;
  },

  criar({ titulo, descricao, prazo, status = 'EM_ANDAMENTO' } = {}) {
    if (!titulo || !String(titulo).trim()) throw erro(400, 'Campo "titulo" é obrigatório');
    if (!STATUS.includes(status)) throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    if (prazo !== undefined && !dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (objetivoModel.existeTitulo(titulo)) throw erro(409, 'Já existe um objetivo com este título');
    return objetivoModel.inserir({ titulo, descricao, prazo, status });
  },

  atualizar(id, dados = {}) {
    this.buscarPorId(id); // 404 se não existir
    const { titulo, descricao, prazo, status } = dados;

    if (titulo !== undefined) {
      if (!String(titulo).trim()) throw erro(400, 'Campo "titulo" não pode ser vazio');
      if (objetivoModel.existeTitulo(titulo, id)) throw erro(409, 'Já existe um objetivo com este título');
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
    return objetivoModel.atualizar(id, campos);
  },

  remover(id) {
    this.buscarPorId(id); // 404 se não existir
    if (tarefaModel.listarPorObjetivo(id).length > 0) {
      throw erro(409, 'Não é possível remover um objetivo que ainda tem tarefas');
    }
    objetivoModel.remover(id);
  },
};