// Guarda o token e o usuário no navegador (sobrevive ao F5).
const CHAVE = 'trilha.sessao';

export const sessao = {
  obter() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE));
    } catch {
      return null;
    }
  },
  token() {
    return this.obter()?.token ?? null;
  },
  salvar(token, usuario) {
    localStorage.setItem(CHAVE, JSON.stringify({ token, usuario }));
  },
  limpar() {
    localStorage.removeItem(CHAVE);
  },
};