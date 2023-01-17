import testeController from '../controllers/testeController.js';

export default (app) => {
  app.get('/teste', testeController.get);
};
