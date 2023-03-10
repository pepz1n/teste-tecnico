import moment from 'moment';
import { Op } from 'sequelize';
import sequelize from '../config/index.js';
import Desconto from '../models/Desconto.js';
import Sessao from '../models/Sessao.js';
import Usuario from '../models/Usuario.js';
import UsuarioSessao from '../models/UsuarioSessao.js';
import UsuarioSessaoDesconto from '../models/UsuarioSessaoDesconto.js';
import dateAux from '../utils/dateAux.js';
import trataError from '../utils/trataError.js';

export default class UsuarioController {
  static #findUsuarioById = (id) => Usuario.findOne({ where: { id } });

  static #update = async (id, dados, res) => {
    const getUsuario = await this.#findUsuarioById(id);

    if (!getUsuario) {
      return trataError.badRequest(res, 'Nenhum registro encontrado para ser atualizado!');
    }

    Object.keys(dados).forEach((field) => getUsuario[field] = dados[field]);
    await getUsuario.save();

    return res.status(200).send({ message: `Cadastro de id: ${getUsuario.id} atualizado com sucesso`, data: getUsuario });
  };

  static #getSessoesFuturasCompradas = async (idUsuario) => {
    const response = await sequelize.query(`
    select
      f.nome as "Filme",
      s.data_fim as "DataFim",
      s.preco as "Valor",
      us.valor_atual as "ValorAtual"
    from sessoes as s
    join filmes as f on (f.id = s.id_filme)
    join usuario_sessoes as us on (s.id = us.id_sessao)
    where us.id_usuario = ${idUsuario}
    `).then((a) => a[0]);
    return response;
  };

  static #create = async (dados, res) => {
    const response = await Usuario.create(dados);
    return res.status(201).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findUsuarioById(id) || [];
      } else {
        response = await Usuario.findAll({
          order: [['id', 'asc']],
        });
      }

      if (!response.length && !response.id) {
        return await trataError.badRequest(res, id ? `Nenhum registro encontrado com o id ${id}` : 'Nenhum registro encontrado');
      }

      return res.status(200).send({ message: 'Busca feita com sucesso', data: response });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static persist = async (req, res) => {
    try {
      const { id } = req.params;

      if (id) {
        return await this.#update(id, req.body, res);
      }

      return await this.#create(req.body, res);
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static destroy = async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return trataError.badRequest(res, 'Nenhum Id informado!');
      }

      const response = await this.#findUsuarioById(id);

      if (!response) {
        return trataError.badRequest(res, 'Nenhum registro encontrado para ser excluido!');
      }

      await response.destroy();

      return res.status(200).send({ message: 'Registro excluido com sucesso', data: [] });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static comprarSessao = async (req, res) => {
    try {
      const { idLugar } = req.params;
      const dados = req.body;

      if (!dados.idSessao || !dados.idUsuario || !idLugar) {
        return trataError.badRequest(res, 'Informa????es inv??lidas');
      }

      const usuario = await this.#findUsuarioById(dados.idUsuario);

      if (!usuario) {
        return trataError.badRequest(res, `Nenhum usu??rio encontrado com o id ${dados.idUsuario}`);
      }

      usuario.idCargo = await usuario.getCargo();

      if (usuario.idCargo.descricao === 'atendente') {
        return trataError.badRequest(res, 'Atendentes n??o podem comprar ingressos');
      }

      const sessaoBanco = await Sessao.findOne({
        where: {
          id: dados.idSessao,
          dataInicio: {
            [Op.gt]: new Date(Date.now()),
          },
        },
      });

      const sessao = sessaoBanco.toJSON();

      if (!sessao) {
        return trataError.badRequest(res, `Nenhuma sess??o v??lida encontrada com o id ${dados.idSessao}`);
      }

      const dataInicio = moment.tz(sessao.dataInicio, 'utc').format();
      const dataFim = moment.tz(sessao.dataFim, 'utc').format();

      const sessoesConflito = await sequelize.query(`
        select
          s.*
        from sessoes as s
        join usuario_sessoes as us on (s.id = us.id_sessao)
        where us.id_usuario = ${usuario.id} and (('${dataInicio}' between s.data_inicio and s.data_fim) or ('${dataFim}' between s.data_inicio and s.data_fim) or ('${dataInicio}' < s.data_inicio and '${dataFim}' > s.data_fim));
      `).then((a) => a[0]);

      if (sessoesConflito.find((a) => a.id === sessao.id)) {
        return trataError.badRequest(res, 'Usu??rio j?? comprou ingresso para essa sess??o!');
      }

      if (sessoesConflito.length) {
        return trataError.badRequest(res, 'Usu??rio j?? comprou ingresso para outra(s) sess??es neste hor??rio!');
      }

      const indexLugar = sessao.lugares.findIndex((a) => a.id === Number(idLugar));

      if (indexLugar === -1) {
        return trataError.badRequest(res, 'Lugar n??o encontrado na sess??o!');
      }

      if (sessao.lugares[indexLugar].vendido) {
        return trataError.badRequest(res, 'Lugar escolhido j?? se encontra vendido!');
      }

      const whereGetDesconto = [];
      const dia = new Date(Date.now()).getDay();

      if (dia !== 6 && dia !== 0) {
        whereGetDesconto.push({ chave: 'semana' });
      }

      if (usuario.estudante) {
        whereGetDesconto.push({ chave: 'estudante' });
      }

      const descontos = await Desconto.findAll({
        where: {
          [Op.or]: whereGetDesconto,
        },
      });

      const valorAtual = descontos.reduce((acumulador, valor) => {
        if (valor.porcentagem) {
          acumulador -= acumulador * (valor.valor / 100);
        } else {
          acumulador -= valor.valor;
        }
        return Number(acumulador.toFixed(2));
      }, sessao.preco);

      const usuarioSessoesReq = {
        idUsuario: usuario.id,
        idSessao: sessao.id,
        valorAtual,
      };

      const usuarioSessoesRes = await UsuarioSessao.create(usuarioSessoesReq);

      descontos.forEach(async (desconto) => {
        await UsuarioSessaoDesconto.create({ idUsuarioSessao: usuarioSessoesRes.id, idDesconto: desconto.id });
      });

      sessao.lugares[indexLugar].vendido = true;
      sessao.lugares[indexLugar].idUsuario = usuario.id;
      sessaoBanco.lugares = sessao.lugares;

      await sessaoBanco.save();

      sessaoBanco.idFilme = await sessaoBanco.getFilme();

      const responseFim = {
        Filme: sessaoBanco.idFilme.nome,
        Sess??o: dateAux.formatDate(sessao.dataInicio),
        Valor: Number(sessao.preco),
        ValorAtual: valorAtual,
      };

      return res.status(201).send(responseFim);
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static sessoesCompradasNaoCome??adas = async (req, res) => {
    try {
      const { idUsuario } = req.params;

      const usuario = await this.#findUsuarioById(idUsuario);

      if (!usuario) {
        return trataError.badRequest(res, `N??o existe usuario com o id ${idUsuario}`);
      }

      if (!idUsuario) {
        return trataError.badRequest(res, 'Nenhum id informado');
      }

      const response = await this.#getSessoesFuturasCompradas(idUsuario);

      if (!response.length) {
        return trataError.badRequest(res, 'O usuario n??o possui nenhuma sess??o futura!');
      }

      return res.status(200).send({ data: response });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static cancelarSessao = async (req, res) => {
    try {
      const { idUsuario, idSessao } = req.body;

      if (!idUsuario || !idSessao) {
        return trataError.badRequest(res, 'Informa????es inv??lidas');
      }

      const sessao = await Sessao.findOne({
        where: {
          id: idSessao,
        },
      });

      if (!sessao) {
        return trataError.badRequest(res, `A sess??o id ${idSessao} n??o existe!`);
      }

      if (sessao.dataInicio < new Date(Date.now())) {
        return trataError.badRequest(res, 'O usu??rio n??o pode cancelar uma sess??o que j?? aconteceu');
      }

      const usuarioSessao = await UsuarioSessao.findOne({
        where: {
          idSessao,
          idUsuario,
        },
      });

      if (!usuarioSessao) {
        return trataError.badRequest(res, 'O usu??rio n??o tem compra para a sess??o');
      }

      const sessaoDescontos = await UsuarioSessaoDesconto.findAll({
        where: {
          idUsuarioSessao: usuarioSessao.id,
        },
      });

      sessaoDescontos.forEach(async (a) => a.destroy());
      await usuarioSessao.destroy();

      const sessaoJson = sessao.toJSON();
      const index = sessaoJson.lugares.findIndex((a) => a.idUsuario === idUsuario);
      sessaoJson.lugares[index].vendido = false;
      sessaoJson.lugares[index].idUsuario = null;

      sessao.lugares = sessaoJson.lugares;
      await sessao.save();

      return res.status(200).send({ message: `Sess??o cancelada para o usu??rio ${idUsuario}` });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };
}
