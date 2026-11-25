import { API_URL } from './config.js';
import { sessao } from './sessao.js';

let aoNaoAutorizado = () => {};

async function request(metodo, caminho, dados) {
  const opcoes = { method: metodo, headers: {} };
  const token = sessao.token();
  if (token) opcoes.headers.Authorization = `Bearer ${token}`;
  if (dados !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(dados);
  }

  let resp;
  try {
    resp = await fetch(`${API_URL}${caminho}`, opcoes);
  } catch {
    throw new Error('Não consegui falar com a API. Ela está rodando?');
  }

  if (resp.status === 204) return null;

  const corpo = await resp.json().catch(() => null);

  if (!resp.ok) {
    // 401 com token enviado = sessão expirada ou inválida: volta para o login
    if (resp.status === 401 && token) {
      sessao.limpar();
      aoNaoAutorizado();
    }
    throw new Error(corpo?.erro ?? `Erro ${resp.status}`);
  }

  return corpo;
}

export const api = {
  get: (caminho) => request('GET', caminho),
  post: (caminho, dados) => request('POST', caminho, dados),
  put: (caminho, dados) => request('PUT', caminho, dados),
  delete: (caminho) => request('DELETE', caminho),
  aoNaoAutorizado: (fn) => { aoNaoAutorizado = fn; },
};