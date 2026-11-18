import { api } from '../api.js';

const STATUS = ['EM_ANDAMENTO', 'CONCLUIDO'];

function preparar({ titulo, descricao, prazo, status }) {
  const dados = {
    titulo: (titulo ?? '').trim(),
    descricao: (descricao ?? '').trim(),
    status,
  };
  if (!dados.titulo) throw new Error('Informe o título do objetivo.');
  if (!STATUS.includes(status)) throw new Error('Status inválido.');
  if (prazo) dados.prazo = prazo; // prazo é opcional: vazio não vai no body
  return dados;
}

export const objetivoService = {
  listar() {
    return api.get('/objetivos');
  },

  async criar(dados) {
    return api.post('/objetivos', preparar(dados));
  },

  async atualizar(id, dados) {
    return api.put(`/objetivos/${id}`, preparar(dados));
  },

  remover(id) {
    return api.delete(`/objetivos/${id}`);
  },
};