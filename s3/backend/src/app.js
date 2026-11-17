import express from 'express';
import objetivosRouter from './routes/objetivos.js';
import tarefasRouter from './routes/tarefas.js';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
  res.json({ api: 'Trilha de Estudos API', versao: '1.0.0', rotas: ['/objetivos', '/tarefas'] });
});

app.use('/objetivos', objetivosRouter);
app.use('/tarefas', tarefasRouter);

app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.url} não existe` });
});

app.use(errorHandler);

export default app;