// Ponto de entrada: liga store, service e view. Nenhuma regra mora aqui.
import { criarStore } from './state/store.js';
import { objetivoService } from './services/objetivoService.js';
import { tarefaService } from './services/tarefaService.js';
import { objetivoView } from './ui/objetivoView.js';
import { tarefaView } from './ui/tarefaView.js';
import { aviso } from './ui/aviso.js';

// ===================== ESTADOS =====================
const objetivos = criarStore({
  status: 'carregando', // 'carregando' | 'erro' | 'vazio' | 'sucesso'
  objetivos: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

const tarefas = criarStore({
  status: 'carregando',
  tarefas: [],
  erro: null,
  editandoId: null,
  salvando: false,
});

objetivos.assinar(objetivoView.render);
tarefas.assinar(tarefaView.render);

// As tarefas dependem dos objetivos: mudou a lista de objetivos,
// refaz o <select> e redesenha os títulos na tabela de tarefas.
objetivos.assinar((estado) => {
  tarefaView.preencherObjetivos(estado.objetivos);
  tarefaView.render(tarefas.get());
});

// ===================== OBJETIVOS =====================
async function carregarObjetivos() {
  objetivos.set({ status: 'carregando', erro: null });
  try {
    const lista = await objetivoService.listar();
    objetivos.set({ status: lista.length ? 'sucesso' : 'vazio', objetivos: lista });
  } catch (e) {
    objetivos.set({ status: 'erro', erro: e.message });
  }
}

async function salvarObjetivo(dados) {
  const { editandoId } = objetivos.get();
  aviso.limpar();
  objetivos.set({ salvando: true });
  try {
    if (editandoId) await objetivoService.atualizar(editandoId, dados);
    else await objetivoService.criar(dados);

    aviso.sucesso(editandoId ? 'Objetivo atualizado.' : 'Objetivo cadastrado.');
    objetivoView.limparForm();
    objetivos.set({ editandoId: null });
    await carregarObjetivos();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    objetivos.set({ salvando: false });
  }
}

function editarObjetivo(id) {
  const objetivo = objetivos.get().objetivos.find((o) => o.id === id);
  objetivoView.preencherForm(objetivo);
  objetivos.set({ editandoId: id });
}

function cancelarEdicaoObjetivo() {
  objetivoView.limparForm();
  objetivos.set({ editandoId: null });
}

async function removerObjetivo(id) {
  if (!confirm(`Remover o objetivo #${id}?`)) return;
  aviso.limpar();
  try {
    await objetivoService.remover(id);
    aviso.sucesso('Objetivo removido.');
    if (objetivos.get().editandoId === id) cancelarEdicaoObjetivo();
    await carregarObjetivos();
  } catch (e) {
    aviso.erro(e.message); // ex.: 409 "ainda tem tarefas"
  }
}

objetivoView.aoEnviar(salvarObjetivo);
objetivoView.aoCancelar(cancelarEdicaoObjetivo);
objetivoView.aoRecarregar(carregarObjetivos);
objetivoView.aoClicarNaLista({ editar: editarObjetivo, remover: removerObjetivo });

// ===================== TAREFAS =====================
async function carregarTarefas() {
  tarefas.set({ status: 'carregando', erro: null });
  try {
    const lista = await tarefaService.listar();
    tarefas.set({ status: lista.length ? 'sucesso' : 'vazio', tarefas: lista });
  } catch (e) {
    tarefas.set({ status: 'erro', erro: e.message });
  }
}

async function salvarTarefa(dados) {
  const { editandoId } = tarefas.get();
  aviso.limpar();
  tarefas.set({ salvando: true });
  try {
    if (editandoId) await tarefaService.atualizar(editandoId, dados);
    else await tarefaService.criar(dados);

    aviso.sucesso(editandoId ? 'Tarefa atualizada.' : 'Tarefa criada.');
    tarefaView.limparForm();
    tarefas.set({ editandoId: null });
    await carregarTarefas();
  } catch (e) {
    aviso.erro(e.message);
  } finally {
    tarefas.set({ salvando: false });
  }
}

function editarTarefa(id) {
  const tarefa = tarefas.get().tarefas.find((t) => t.id === id);
  tarefaView.preencherForm(tarefa);
  tarefas.set({ editandoId: id });
}

function cancelarEdicaoTarefa() {
  tarefaView.limparForm();
  tarefas.set({ editandoId: null });
}

async function removerTarefa(id) {
  if (!confirm(`Remover a tarefa #${id}?`)) return;
  aviso.limpar();
  try {
    await tarefaService.remover(id);
    aviso.sucesso('Tarefa removida.');
    if (tarefas.get().editandoId === id) cancelarEdicaoTarefa();
    await carregarTarefas();
  } catch (e) {
    aviso.erro(e.message);
  }
}

tarefaView.aoEnviar(salvarTarefa);
tarefaView.aoCancelar(cancelarEdicaoTarefa);
tarefaView.aoRecarregar(carregarTarefas);
tarefaView.aoClicarNaLista({ editar: editarTarefa, remover: removerTarefa });

// ===================== INÍCIO =====================
carregarObjetivos();
carregarTarefas();