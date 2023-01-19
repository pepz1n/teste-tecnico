import SalaController from '../controllers/salaController';

export default (app) => {
  app.get('/sala', SalaController.get);
  app.get('/sala/:id', SalaController.get);
  app.post('/sala', SalaController.persist);
  app.post('/sala/:id', SalaController.persist);
  app.delete('/sala/:id', SalaController.destroy);
};
