# Testes da API — Projeto 1 (S3)

**API:** Estudos API\
**Servidor:** `npm run dev em http://localhost:3000\
**Ferramenta:** Postman


| # | Método | URL | Body | Status obtido | 
|---|---|---|---|---|
| 1 | POST | http://localhost:3000/objetivos |  {"id":1,"titulo":"Aprender SQL","descricao":"Do básico ao avançado","prazo":"2026-12-31","status":"EM_ANDAMENTO"}| 201|
| 2 | POST | http://localhost:3000/objetivos | {"erro":"Já existe um objetivo com este título"} | 409 |
| 3 | POST | http://localhost:3000/objetivos | {"erro":"Campo \"titulo\" é obrigatório"} | 400 | 
| 4 | POST | http://localhost:3000/tarefas | {"id":1,"titulo":"Revisar JOINs","prazo":"2026-11-20","status":"PENDENTE","objetivoId":1} | 201 |
| 5 | POST | http://localhost:3000/tarefas | {"erro":"Objetivo informado não existe"} | 422 |
| 6 | GET | http://localhost:3000/tarefas?objetivoId=1 | [{"id":1,"titulo":"Revisar JOINs","prazo":"2026-11-20","status":"PENDENTE","objetivoId":1}] | 200 |
| 7 | PUT | http://localhost:3000/tarefas/1 | {"id":1,"titulo":"Revisar JOINs","prazo":"2026-11-20","status":"CONCLUIDA","objetivoId":1} | 200 | 
| 8 | DELETE | http://localhost:3000/tarefas/1 | - | 204 |