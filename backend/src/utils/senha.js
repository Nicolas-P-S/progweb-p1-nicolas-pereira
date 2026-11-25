import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export function gerarHash(senha) {
  const sal = randomBytes(16).toString('hex');
  const hash = scryptSync(senha, sal, 64).toString('hex');
  return `${sal}:${hash}`;
}

export function conferirSenha(senha, armazenado) {
  const [sal, hash] = armazenado.split(':');
  const calculado = scryptSync(senha, sal, 64);
  return timingSafeEqual(calculado, Buffer.from(hash, 'hex'));
}