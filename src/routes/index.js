import cargoRoute from './cargoRoute.js';
import padraoLugaresRoute from './padraoLugaresRoute.js';

function routes(app) {
  padraoLugaresRoute(app);
  cargoRoute(app);
}

export default routes;
