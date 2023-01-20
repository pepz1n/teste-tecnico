import SessaoController from '../controllers/sessaoController.js';

export default (app) => {
  app.get('/sessao', SessaoController.get);
  app.get('/sessao/:id', SessaoController.get);
  app.get('/sessao/relatorio/:idSessao', SessaoController.relatorioSessao);
  app.post('/sessao', SessaoController.persist);
  app.post('/sessao/:id', SessaoController.persist);
  app.delete('/sessao/:id', SessaoController.destroy);
};
