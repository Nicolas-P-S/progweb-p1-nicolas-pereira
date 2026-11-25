import jwt from 'jsonwebtoken';

const SEGREDO = process.env.JWT_SECRET ?? 'segredo-so-para-desenvolvimento';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('Defina a variável de ambiente JWT_SECRET em produção');
}

export function gerarToken(usuarioId) {
  return jwt.sign({ sub: String(usuarioId) }, SEGREDO, { expiresIn: '7d' });
}

export function verificarToken(token) {
  const payload = jwt.verify(token, SEGREDO); // lança se inválido ou expirado
  return Number(payload.sub);
}