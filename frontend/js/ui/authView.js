const el = {
  telaAuth: document.querySelector('#tela-auth'),
  app: document.querySelector('#app-logado'),
  barra: document.querySelector('#usuario-barra'),
  nome: document.querySelector('#usuario-nome'),
  sair: document.querySelector('#btn-sair'),
  formLogin: document.querySelector('#form-login'),
  formCadastro: document.querySelector('#form-cadastro'),
};

export const authView = {
  mostrarAuth() {
    el.telaAuth.classList.remove('d-none');
    el.app.classList.add('d-none');
    el.barra.classList.add('d-none');
  },

  mostrarApp(usuario) {
    el.telaAuth.classList.add('d-none');
    el.app.classList.remove('d-none');
    el.barra.classList.remove('d-none');
    el.nome.textContent = usuario.nome;
  },

  limparForms() {
    el.formLogin.reset();
    el.formCadastro.reset();
  },

  aoEntrar(fn) {
    el.formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      fn(Object.fromEntries(new FormData(el.formLogin)));
    });
  },

  aoCadastrar(fn) {
    el.formCadastro.addEventListener('submit', (e) => {
      e.preventDefault();
      fn(Object.fromEntries(new FormData(el.formCadastro)));
    });
  },

  aoSair(fn) {
    el.sair.addEventListener('click', fn);
  },
};