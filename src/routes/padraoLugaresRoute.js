import PadraoLugaresController from '../controllers/padraoLugaresController.js';

export default (app) => {
  app.get('/padrao-lugares', PadraoLugaresController.get);
  app.get('/padrao-lugares/:id', PadraoLugaresController.get);
  app.post('/padrao-lugares', PadraoLugaresController.persist);
  app.post('/padrao-lugares/:id', PadraoLugaresController.persist);
  app.delete('/padrao-lugares/:id', PadraoLugaresController.destroy);
};
