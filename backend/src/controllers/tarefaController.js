import { tarefaService } from '../services/tarefaService.js';

export const tarefaController = {
  listar(req, res) {
    res.json(tarefaService.listar(req.usuario.id, req.query.objetivoId));
  },

  buscarPorId(req, res) {
    res.json(tarefaService.buscarPorId(Number(req.params.id), req.usuario.id));
  },

  criar(req, res) {
    res.status(201).json(tarefaService.criar(req.usuario.id, req.body));
  },

  atualizar(req, res) {
    res.json(tarefaService.atualizar(Number(req.params.id), req.usuario.id, req.body));
  },

  remover(req, res) {
    tarefaService.remover(Number(req.params.id), req.usuario.id);
    res.status(204).end();
  },
};