import { authService } from '../services/authService.js';

export const authController = {
registrar(req, res) {
  console.log('CT:', req.headers['content-type'], '| BODY:', req.body);
  res.status(201).json(authService.registrar(req.body));
},

  login(req, res) {
    res.json(authService.login(req.body));
  },

  eu(req, res) {
    res.json(authService.eu(req.usuario.id));
  },
};