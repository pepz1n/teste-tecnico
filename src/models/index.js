// import Teste from './Teste.js';
import Cargo from './Cargo.js';
import Filme from './Filme.js';
import PadraoLugares from './PadraoLugares.js';
import Parametro from './Parametro.js';
import Sala from './Sala.js';
import Usuario from './Usuario.js';

(async () => {
  // await Teste.sync({ force: true });
  await Parametro.sync({ force: true });
  await Filme.sync({ force: true });
  await Cargo.sync({ force: true });
  await PadraoLugares.sync({ force: true });
  await Sala.sync({ force: true });
  await Usuario.sync({ force: true });
})();
