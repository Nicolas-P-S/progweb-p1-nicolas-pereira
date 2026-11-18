const el = {
  form: document.querySelector('#form-objetivo'),
  salvar: document.querySelector('#obj-salvar'),
  cancelar: document.querySelector('#obj-cancelar'),
  carregando: document.querySelector('#objetivos-carregando'),
  erro: document.querySelector('#objetivos-erro'),
  erroMsg: document.querySelector('#objetivos-erro-msg'),
  recarregar: document.querySelector('#objetivos-recarregar'),
  vazio: document.querySelector('#objetivos-vazio'),
  sucesso: document.querySelector('#objetivos-sucesso'),
  linhas: document.querySelector('#objetivos-linhas'),
};

const NOME_STATUS = { EM_ANDAMENTO: 'Em andamento', CONCLUIDO: 'Concluído' };

function formatarData(texto) {
  if (!texto) return '—';
  const [ano, mes, dia] = texto.slice(0, 10).split('-');
  return `${dia}/${mes}/${ano}`;
}

function celula(texto, classe = '') {
  const td = document.createElement('td');
  td.textContent = texto;
  td.className = classe;
  return td;
}

function botao(texto, acao, id, classe) {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = texto;
  b.className = `btn btn-sm ${classe}`;
  b.dataset.acao = acao;
  b.dataset.id = id;
  return b;
}

function linha(objetivo, editandoId) {
  const tr = document.createElement('tr');
  if (objetivo.id === editandoId) tr.className = 'editando';

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', objetivo.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', objetivo.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(objetivo.id),
    celula(objetivo.titulo),
    celula(formatarData(objetivo.prazo), 'numero text-nowrap'),
    celula(NOME_STATUS[objetivo.status] ?? objetivo.status),
    acoes,
  );
  return tr;
}

export const objetivoView = {
  render({ status, objetivos, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...objetivos.map((o) => linha(o, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Cadastrar objetivo';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(objetivo) {
    el.form.titulo.value = objetivo.titulo;
    el.form.descricao.value = objetivo.descricao ?? '';
    el.form.prazo.value = objetivo.prazo ?? '';
    el.form.status.value = objetivo.status;
    el.form.titulo.focus();
  },

  limparForm() {
    el.form.reset();
  },

  aoEnviar(fn) {
    el.form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      fn(Object.fromEntries(new FormData(el.form)));
    });
  },

  aoCancelar(fn) {
    el.cancelar.addEventListener('click', fn);
  },

  aoRecarregar(fn) {
    el.recarregar.addEventListener('click', fn);
  },

  aoClicarNaLista({ editar, remover }) {
    el.linhas.addEventListener('click', (evento) => {
      const alvo = evento.target.closest('button[data-acao]');
      if (!alvo) return;
      const id = Number(alvo.dataset.id);
      if (alvo.dataset.acao === 'editar') editar(id);
      if (alvo.dataset.acao === 'remover') remover(id);
    });
  },
};