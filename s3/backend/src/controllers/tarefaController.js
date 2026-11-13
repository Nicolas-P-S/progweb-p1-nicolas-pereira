import { tarefaService } from '../services/tarefaService.js';

export const tarefaController = {
  listar(req, res) {
    res.json(tarefaService.listar(req.query.objetivoId));
  },

  buscarPorId(req, res) {
    res.json(tarefaService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const nova = tarefaService.criar(req.body);
    res.status(201).json(nova);
  },

  atualizar(req, res) {
    res.json(tarefaService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    tarefaService.remover(Number(req.params.id));
    res.status(204).end();
  },
};