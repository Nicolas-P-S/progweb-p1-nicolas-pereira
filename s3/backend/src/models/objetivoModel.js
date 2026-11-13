let objetivos = [];
let proximoId = 1;

export const objetivoModel = {
  listar() {
    return objetivos;
  },

  buscarPorId(id) {
    return objetivos.find((o) => o.id === id) ?? null;
  },

  existeTitulo(titulo, ignorarId = null) {
    const t = titulo.trim().toLowerCase();
    return objetivos.some((o) => o.id !== ignorarId && o.titulo.toLowerCase() === t);
  },

  inserir({ titulo, descricao, prazo, status }) {
    const novo = {
      id: proximoId++,
      titulo: titulo.trim(),
      descricao: descricao ?? null,
      prazo: prazo ?? null,
      status,
    };
    objetivos.push(novo);
    return novo;
  },

  atualizar(id, dados) {
    const i = objetivos.findIndex((o) => o.id === id);
    if (i === -1) return null;
    objetivos[i] = { ...objetivos[i], ...dados, id };
    return objetivos[i];
  },

  remover(id) {
    const antes = objetivos.length;
    objetivos = objetivos.filter((o) => o.id !== id);
    return objetivos.length < antes;
  },
};