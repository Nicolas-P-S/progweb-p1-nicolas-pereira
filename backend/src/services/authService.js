import { usuarioModel } from '../models/usuarioModel.js';
import { gerarToken } from '../utils/token.js';
import { gerarHash, conferirSenha } from '../utils/senha.js';
import { erro } from '../utils/erro.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const authService = {
  registrar({ nome, email, senha } = {}) {
    if (!nome || !String(nome).trim()) throw erro(400, 'Campo "nome" é obrigatório');
    if (!email || !EMAIL.test(String(email).trim())) throw erro(400, 'E-mail inválido');
    if (!senha || String(senha).length < 6) throw erro(400, 'A senha deve ter pelo menos 6 caracteres');

    const emailLimpo = String(email).trim().toLowerCase();
    if (usuarioModel.existeEmail(emailLimpo)) throw erro(409, 'Já existe uma conta com este e-mail');

    const usuario = usuarioModel.inserir({
      nome: String(nome).trim(),
      email: emailLimpo,
      senhaHash: gerarHash(String(senha)),
    });
    return { usuario, token: gerarToken(usuario.id) };
  },

  login({ email, senha } = {}) {
    if (!email || !senha) throw erro(400, 'Informe e-mail e senha');

    const u = usuarioModel.buscarPorEmailComSenha(String(email).trim().toLowerCase());
    // Mesma mensagem para e-mail inexistente e senha errada: não revela qual dos dois falhou
    if (!u || !conferirSenha(String(senha), u.senhaHash)) {
      throw erro(401, 'E-mail ou senha incorretos');
    }
    return { usuario: { id: u.id, nome: u.nome, email: u.email }, token: gerarToken(u.id) };
  },

  eu(usuarioId) {
    const usuario = usuarioModel.buscarPorId(usuarioId);
    if (!usuario) throw erro(401, 'Usuário não existe mais');
    return usuario;
  },
};