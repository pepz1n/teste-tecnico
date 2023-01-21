import UsuarioController from '../controllers/usuarioController';

export default (app) => {
  app.get('/usuario', UsuarioController.get);
  app.get('/usuario/:id', UsuarioController.get);
  app.post('/usuario', UsuarioController.persist);
  app.post('/usuario/comprar/:idLugar', UsuarioController.comprarSessao);
  app.post('/usuario/:id', UsuarioController.persist);
  app.delete('/usuario/:id', UsuarioController.destroy);
};
