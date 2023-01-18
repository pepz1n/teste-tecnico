import Cargo from './Cargo.js';
import Filme from './Filme.js';
import PadraoLugares from './PadraoLugares.js';
import Sala from './Sala.js';
import Sessao from './Sessao.js';
import Usuario from './Usuario.js';
import Desconto from './Desconto.js';
import UsuarioSessaoDesconto from './UsuarioSessaoDesconto.js';
import UsuarioSessao from './UsuarioSessao.js';

(async () => {
  await Desconto.sync({ force: true });
  await Filme.sync({ force: true });
  await Cargo.sync({ force: true });
  await PadraoLugares.sync({ force: true });
  await Sala.sync({ force: true });
  await Usuario.sync({ force: true });
  await Sessao.sync({ force: true });
  await UsuarioSessao.sync({ force: true });
  await UsuarioSessaoDesconto.sync({ force: true });
})();
