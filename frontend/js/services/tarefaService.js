import { api } from '../api.js';

const STATUS = ['PENDENTE', 'CONCLUIDA'];

function preparar({ titulo, prazo, status, objetivoId }) {
  if (!objetivoId) throw new Error('Selecione o objetivo.');
  const dados = {
    titulo: (titulo ?? '').trim(),
    prazo,
    status,
    objetivoId: Number(objetivoId), // o formulário só entrega string
  };
  if (!dados.titulo) throw new Error('Informe o título da tarefa.');
  if (!prazo) throw new Error('Informe o prazo da tarefa.');
  if (!STATUS.includes(status)) throw new Error('Status inválido.');
  return dados;
}

export const tarefaService = {
  listar() {
    return api.get('/tarefas');
  },

  async criar(dados) {
    return api.post('/tarefas', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/tarefas/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/tarefas/${id}`);
  },
};