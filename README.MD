# Trilha de Estudos

Sistema para organizar estudos: cada pessoa cria seus **objetivos** de aprendizado
(por exemplo, "aprender SQL") e as **tarefas** para alcançá-los. Cada usuário vê
apenas os próprios dados. Projeto 1 da disciplina Programação Web (UEPB, 2026.2).

- **Aplicação:** https://SEU-FRONT.vercel.app
- **API:** https://SEU-SERVICO.onrender.com
- **Vídeo de apresentação:** (link)

**Conta de demonstração:** `demo@exemplo.com` / `demo123` (dados fictícios).

> A API está no plano grátis do Render: o primeiro acesso pode levar cerca de
> um minuto, e os dados voltam aos de exemplo a cada reinício do serviço.

## Tecnologias

- Backend: Node.js 22, Express 5, SQLite (`node:sqlite`, SQL puro), JWT (`jsonwebtoken`),
  senhas com hash `scrypt`
- Frontend: HTML, CSS, Bootstrap 5, JavaScript puro (ES Modules, `fetch`)

## Como rodar localmente

Pré-requisito: Node.js 22 ou superior.

```bash
# 1. API
cd backend
npm install
cp .env.example .env             # edite o JWT_SECRET
npm run dev                      # http://localhost:3000

# 2. Frontend (em outro terminal)
cd frontend
npx http-server -p 5500 -c-1     # http://localhost:5500
```

## Rotas da API

Todas as rotas de `/objetivos` e `/tarefas` exigem o header `Authorization: Bearer <token>`.

| Método | Rota | O que faz | Respostas |
|---|---|---|---|
| POST | /auth/registrar | Cria a conta e devolve o token | 201, 400, 409 |
| POST | /auth/login | Entra e devolve o token | 200, 400, 401 |
| GET | /auth/me | Dados do usuário logado | 200, 401 |
| GET | /objetivos | Lista os objetivos do usuário | 200, 401 |
| POST | /objetivos | Cria um objetivo | 201, 400, 409 |
| GET | /objetivos/:id | Busca um objetivo | 200, 404 |
| PUT | /objetivos/:id | Atualiza um objetivo | 200, 400, 404, 409 |
| DELETE | /objetivos/:id | Remove um objetivo | 204, 404, 409 |
| GET | /tarefas | Lista as tarefas (filtro `?objetivoId=`) | 200, 401 |
| POST | /tarefas | Cria uma tarefa | 201, 400, 422 |
| GET | /tarefas/:id | Busca uma tarefa | 200, 404 |
| PUT | /tarefas/:id | Atualiza uma tarefa | 200, 400, 404, 422 |
| DELETE | /tarefas/:id | Remove uma tarefa | 204, 404 |

Erros seguem o formato `{ "erro": "mensagem" }`.

## Regras de negócio

- Cadastro: nome obrigatório, e-mail válido e único (409), senha com 6+ caracteres (400).
- Login: e-mail ou senha errados devolvem 401, sem revelar qual dos dois falhou.
- Objetivo: título obrigatório (400) e único por usuário (409); status `EM_ANDAMENTO` ou `CONCLUIDO`; prazo, se enviado, deve ser data válida (400).
- Objetivo com tarefas não pode ser removido (409).
- Tarefa: título, prazo e objetivo obrigatórios (400); status `PENDENTE` ou `CONCLUIDA`; o objetivo precisa existir e ser do usuário (422).
- Dados de outro usuário respondem 404, como se não existissem.

## Estrutura

```
backend/
  src/
    routes/        mapeia URL → controller
    controllers/   lê a requisição, chama o service, responde
    services/      regras de negócio
    models/        acesso ao banco (SQL)
    middleware/    logger, autenticação e tratamento de erros
    utils/         erros com status, token JWT, hash de senha
    db.js          conexão e schema do SQLite
    seed.js        dados de exemplo
frontend/
  js/
    api.js         camada HTTP (fetch, token)
    sessao.js      token e usuário guardados no navegador
    services/      regras da tela
    state/         estado da aplicação
    ui/            desenho da tela
MODELAGEM.md       modelagem de classes (S2)
s1/ … s4/          exercícios das semanas
```

## Limitações conhecidas

- O token JWT fica no `localStorage`. Em um sistema real, um cookie `HttpOnly` seria mais seguro contra XSS.
- O disco do plano grátis do Render é efêmero: os dados não persistem em produção (a persistência é demonstrada localmente).

## Autor

Nicolas Pereira de Souza · Ciência da Computação · UEPB