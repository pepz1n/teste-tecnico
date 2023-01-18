import DescontoController from '../controllers/descontoController';

export default (app) => {
  app.get('/desconto', DescontoController.get);
  app.get('/desconto/:id', DescontoController.get);
  app.post('/desconto', DescontoController.persist);
  app.post('/desconto/:id', DescontoController.persist);
  app.delete('/desconto/:id', DescontoController.destroy);
};
