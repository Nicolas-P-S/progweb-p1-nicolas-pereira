import { objetivoService } from '../services/objetivoService.js';

export const objetivoController = {
  listar(req, res) {
    res.json(objetivoService.listar());
  },

  buscarPorId(req, res) {
    res.json(objetivoService.buscarPorId(Number(req.params.id)));
  },

  criar(req, res) {
    const novo = objetivoService.criar(req.body);
    res.status(201).json(novo);
  },

  atualizar(req, res) {
    res.json(objetivoService.atualizar(Number(req.params.id), req.body));
  },

  remover(req, res) {
    objetivoService.remover(Number(req.params.id));
    res.status(204).end();
  },
};