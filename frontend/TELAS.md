# Telas do Projeto 1 (S4)

Front: `npx http-server -p 5500 -c-1` em `frontend/` · API: `npm run dev` em `backend/`

| Lista | Estado | Como provocar | O que aparece |
|---|---|---|---|
| Objetivos | carregando | Network → throttling 3G → F5 | spinner "Carregando objetivos…" |
| Objetivos | vazio | API recém-iniciada | "Nenhum objetivo ainda…" |
| Objetivos | erro | Ctrl+C na API → F5 | "Não consegui falar com a API…" + Tentar de novo |
| Objetivos | sucesso | cadastrar "Aprender SQL" | tabela com 1 linha |
| Tarefas | vazio | sem tarefas | "Nenhuma tarefa ainda…" |
| Tarefas | sucesso | criar "Revisar JOINs" no objetivo 1 | tabela com o título do objetivo |
| Objetivos | erro de regra | cadastrar "Aprender SQL" de novo | aviso "Já existe um objetivo com este título" (409) |
| Objetivos | erro de regra | remover objetivo que tem tarefas | aviso "Não é possível remover um objetivo que ainda tem tarefas" (409) |

## Camadas
- api: `js/api.js` · services: `js/services/` · state: `js/state/store.js` · ui: `js/ui/`