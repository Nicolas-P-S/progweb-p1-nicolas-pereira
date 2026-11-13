# Testes da API — Projeto 1 (S3)

**API:** Banco API\
**Servidor:** `npm run dev` em http://localhost:3000\
**Ferramenta:** Postman


| # | Método | URL | Body | Status obtido | 
|---|---|---|---|---|
| 1 | POST | http://localhost:3000/ |  {"api":"Banco API","versao":"1.0.0","rotas":["/clientes"]}| 200| |
| 2 | POST | http://localhost:3000/clientes | {"id":1,"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana@email.com"} |201|
| 3 | GET | http://localhost:3000/clientes | {"id":2,"nome":"Bruno Costa","cpf":"987.654.321-00","email":null} | 201| |
| 4 | GET | http://localhost:3000/clientes | [{"id":1,"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana@email.com"},{"id":2,"nome":"Bruno Costa","cpf":"987.654.321-00","email":null}] |200|
| 5 | GET | http://localhost:3000/clientes/1 | {"id":1,"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana@email.com"} | 200| |
| 6 | GET | http://localhost:3000/clientes/99 | {"erro":"Cliente não encontrado"} | 404| |
| 7 | PUT | http://localhost:3000/clientes/1 | {"id":1,"nome":"Ana Silva","cpf":"123.456.789-00","email":"ana.nova@email.com"} | 200 | |
| 8 | POST | http://localhost:3000/clientes | {"erro":"Já existe um cliente com este CPF"} | 409| |
| 9 | POST | http://localhost:3000/clientes | {"erro":"Unexpected non-whitespace character after JSON at position 13 (line 1 column 14)"} | 400 | |
| 10 | DEL | http://localhost:3000/clientes/2 | — | 204 | |
| 11 | GET | http://localhost:3000/clientes/2 | {"erro":"Cliente não encontrado"} | 404| |
