import { verificarToken } from '../utils/token.js';
import { erro } from '../utils/erro.js';

export function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  if (tipo !== 'Bearer' || !token) throw erro(401, 'Faça login para continuar');
  try {
    req.usuario = { id: verificarToken(token) };
  } catch {
    throw erro(401, 'Sessão inválida ou expirada. Entre de novo.');
  }
  next();
}