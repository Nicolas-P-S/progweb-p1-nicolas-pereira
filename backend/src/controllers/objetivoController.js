import { objetivoService } from '../services/objetivoService.js';

export const objetivoController = {
  listar(req, res) {
    res.json(objetivoService.listar(req.usuario.id));
  },

  buscarPorId(req, res) {
    res.json(objetivoService.buscarPorId(Number(req.params.id), req.usuario.id));
  },

  criar(req, res) {
    res.status(201).json(objetivoService.criar(req.usuario.id, req.body));
  },

  atualizar(req, res) {
    res.json(objetivoService.atualizar(Number(req.params.id), req.usuario.id, req.body));
  },

  remover(req, res) {
    objetivoService.remover(Number(req.params.id), req.usuario.id);
    res.status(204).end();
  },
};