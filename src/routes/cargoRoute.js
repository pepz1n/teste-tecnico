import CargoController from '../controllers/cargoController';

export default (app) => {
  app.get('/cargo', CargoController.get);
  app.get('/cargo/:id', CargoController.get);
  app.post('/cargo', CargoController.persist);
  app.post('/cargo/:id', CargoController.persist);
  app.delete('/cargo/:id', CargoController.destroy);
};
