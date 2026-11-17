import { tarefaModel } from '../models/tarefaModel.js';
import { objetivoModel } from '../models/objetivoModel.js';
import { erro } from '../utils/erro.js';

const STATUS = ['PENDENTE', 'CONCLUIDA'];
const dataValida = (v) => typeof v === 'string' && !Number.isNaN(Date.parse(v));

export const tarefaService = {
  listar(objetivoId) {
    if (objetivoId) return tarefaModel.listarPorObjetivo(Number(objetivoId));
    return tarefaModel.listar();
  },

  buscarPorId(id) {
    const tarefa = tarefaModel.buscarPorId(id);
    if (!tarefa) throw erro(404, 'Tarefa não encontrada');
    return tarefa;
  },

  criar({ titulo, prazo, status = 'PENDENTE', objetivoId } = {}) {
    if (!titulo || !String(titulo).trim() || !prazo || !objetivoId) {
      throw erro(400, 'Campos "titulo", "prazo" e "objetivoId" são obrigatórios');
    }
    if (!dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (!STATUS.includes(status)) throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    // Regra: o objetivo precisa existir
    if (!objetivoModel.buscarPorId(Number(objetivoId))) throw erro(422, 'Objetivo informado não existe');
    return tarefaModel.inserir({ titulo, prazo, status, objetivoId });
  },

  atualizar(id, dados = {}) {
    this.buscarPorId(id); // 404 se não existir
    const { titulo, prazo, status, objetivoId } = dados;

    if (titulo !== undefined && !String(titulo).trim()) throw erro(400, 'Campo "titulo" não pode ser vazio');
    if (prazo !== undefined && !dataValida(prazo)) throw erro(400, 'Prazo inválido (use AAAA-MM-DD)');
    if (status !== undefined && !STATUS.includes(status)) {
      throw erro(400, `Status deve ser um de: ${STATUS.join(', ')}`);
    }
    if (objetivoId !== undefined && !objetivoModel.buscarPorId(Number(objetivoId))) {
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
    return tarefaModel.atualizar(id, campos);
  },

  remover(id) {
    const removida = tarefaModel.remover(id);
    if (!removida) throw erro(404, 'Tarefa não encontrada');
  },
};