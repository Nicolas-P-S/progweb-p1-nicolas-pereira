const el = {
  form: document.querySelector('#form-tarefa'),
  objetivo: document.querySelector('#tarefa-objetivo'),
  salvar: document.querySelector('#tarefa-salvar'),
  cancelar: document.querySelector('#tarefa-cancelar'),
  carregando: document.querySelector('#tarefas-carregando'),
  erro: document.querySelector('#tarefas-erro'),
  erroMsg: document.querySelector('#tarefas-erro-msg'),
  recarregar: document.querySelector('#tarefas-recarregar'),
  vazio: document.querySelector('#tarefas-vazio'),
  sucesso: document.querySelector('#tarefas-sucesso'),
  linhas: document.querySelector('#tarefas-linhas'),
};

const NOME_STATUS = { PENDENTE: 'Pendente', CONCLUIDA: 'Concluída' };

// id → título do objetivo, para mostrar o nome sem outra requisição
let tituloDoObjetivo = new Map();

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

function linha(tarefa, editandoId) {
  const tr = document.createElement('tr');
  if (tarefa.id === editandoId) tr.className = 'editando';

  const objetivo = tituloDoObjetivo.get(tarefa.objetivoId)
    ?? `objetivo #${tarefa.objetivoId} (removido)`;

  const acoes = celula('', 'text-end text-nowrap');
  acoes.append(
    botao('Editar', 'editar', tarefa.id, 'btn-outline-primary me-1'),
    botao('Remover', 'remover', tarefa.id, 'btn-outline-danger'),
  );

  tr.append(
    celula(tarefa.id),
    celula(objetivo),
    celula(tarefa.titulo),
    celula(formatarData(tarefa.prazo), 'numero text-nowrap'),
    celula(NOME_STATUS[tarefa.status] ?? tarefa.status),
    acoes,
  );
  return tr;
}

export const tarefaView = {
  // Preenche o <select> com os objetivos que existem agora
  preencherObjetivos(objetivos) {
    tituloDoObjetivo = new Map(objetivos.map((o) => [o.id, o.titulo]));
    const escolhido = el.objetivo.value;

    const opcoes = objetivos.map((o) => new Option(`${o.titulo} (#${o.id})`, o.id));
    el.objetivo.replaceChildren(new Option('Selecione…', ''), ...opcoes);

    if (tituloDoObjetivo.has(Number(escolhido))) el.objetivo.value = escolhido;
  },

  render({ status, tarefas, erro, editandoId, salvando }) {
    el.carregando.classList.toggle('d-none', status !== 'carregando');
    el.erro.classList.toggle('d-none', status !== 'erro');
    el.vazio.classList.toggle('d-none', status !== 'vazio');
    el.sucesso.classList.toggle('d-none', status !== 'sucesso');

    el.erroMsg.textContent = erro ?? '';
    el.linhas.replaceChildren(...tarefas.map((t) => linha(t, editandoId)));

    el.salvar.disabled = salvando;
    el.salvar.textContent = salvando
      ? 'Salvando…'
      : editandoId ? 'Salvar alterações' : 'Criar tarefa';
    el.cancelar.classList.toggle('d-none', !editandoId);
  },

  preencherForm(tarefa) {
    el.form.objetivoId.value = tarefa.objetivoId;
    el.form.titulo.value = tarefa.titulo;
    el.form.prazo.value = tarefa.prazo ?? '';
    el.form.status.value = tarefa.status;
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