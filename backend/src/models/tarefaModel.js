let tarefas = [];
let proximoId = 1;

export const tarefaModel = {
  listar() {
    return tarefas;
  },

  listarPorObjetivo(objetivoId) {
    return tarefas.filter((t) => t.objetivoId === objetivoId);
  },

  buscarPorId(id) {
    return tarefas.find((t) => t.id === id) ?? null;
  },

  inserir({ titulo, prazo, status, objetivoId }) {
    const nova = {
      id: proximoId++,
      titulo: titulo.trim(),
      prazo,
      status,
      objetivoId: Number(objetivoId),
    };
    tarefas.push(nova);
    return nova;
  },

  atualizar(id, dados) {
    const i = tarefas.findIndex((t) => t.id === id);
    if (i === -1) return null;
    tarefas[i] = { ...tarefas[i], ...dados, id };
    return tarefas[i];
  },

  remover(id) {
    const antes = tarefas.length;
    tarefas = tarefas.filter((t) => t.id !== id);
    return tarefas.length < antes;
  },
};