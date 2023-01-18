import cargoRoute from './cargoRoute.js';
import descontoRoute from './descontoRoute.js';
import filmeRoute from './filmeRoute.js';
import padraoLugaresRoute from './padraoLugaresRoute.js';

function routes(app) {
  padraoLugaresRoute(app);
  cargoRoute(app);
  descontoRoute(app);
  filmeRoute(app);
}

export default routes;
