import testeController from '../controllers/testeController.js';

export default (app) => {
  app.get('/teste', testeController.get);
  app.get('/teste/:id', testeController.get);
  app.post('/teste', testeController.persist);
  app.post('/teste/:id', testeController.persist);
  app.delete('/teste/:id', testeController.destroy);
};
