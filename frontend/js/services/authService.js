import { api } from '../api.js';
import { sessao } from '../sessao.js';

export const authService = {
  async entrar({ email, senha }) {
    if (!(email ?? '').trim() || !senha) throw new Error('Informe e-mail e senha.');
    const r = await api.post('/auth/login', { email: email.trim(), senha });
    sessao.salvar(r.token, r.usuario);
    return r;
  },

  async cadastrar({ nome, email, senha }) {
    if (!(nome ?? '').trim()) throw new Error('Informe o nome.');
    if (!(email ?? '').trim()) throw new Error('Informe o e-mail.');
    if ((senha ?? '').length < 6) throw new Error('A senha precisa ter pelo menos 6 caracteres.');
    const r = await api.post('/auth/registrar', { nome: nome.trim(), email: email.trim(), senha });
    sessao.salvar(r.token, r.usuario);
    return r;
  },

  sair() {
    sessao.limpar();
  },
};