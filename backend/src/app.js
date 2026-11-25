import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import objetivosRouter from './routes/objetivos.js';
import tarefasRouter from './routes/tarefas.js';
import { logger } from './middleware/logger.js';
import { autenticar } from './middleware/autenticar.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware global: SEMPRE antes das rotas
// Em produção, a origem do front vem da variável CORS_ORIGIN.
const origens = (process.env.CORS_ORIGIN
  ?? 'http://localhost:5500,http://127.0.0.1:5500').split(',');
app.use(cors({ origin: origens }));
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({
    api: 'Trilha de Estudos API',
    versao: '1.0.0',
    rotas: ['/auth', '/objetivos', '/tarefas'],
  });
});

// Rotas
app.use('/auth', authRouter);
app.use('/objetivos', autenticar, objetivosRouter);
app.use('/tarefas', autenticar, tarefasRouter);

// 404 para rotas que não existem
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

// Tratador de erro: SEMPRE o último
app.use(errorHandler);

export default app;