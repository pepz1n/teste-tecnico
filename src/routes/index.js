import cargoRoute from './cargoRoute.js';
import descontoRoute from './descontoRoute.js';
import filmeRoute from './filmeRoute.js';
import padraoLugaresRoute from './padraoLugaresRoute.js';
import salaRoute from './salaRoute.js';
import sessaoRoute from './sessaoRoute.js';
import usuarioRoute from './usuarioRoute.js';

function routes(app) {
  padraoLugaresRoute(app);
  cargoRoute(app);
  descontoRoute(app);
  filmeRoute(app);
  salaRoute(app);
  usuarioRoute(app);
  sessaoRoute(app);
}

export default routes;
