import moment from 'moment';
import Filme from '../models/Filme.js';
import Sessao from '../models/Sessao.js';
import trataError from '../utils/trataError.js';
import sequelize from '../config/index.js';

export default class SessaoController {
  static #findSessaoById = (id) => Sessao.findOne({ where: { id } });

  static #getPadraoLugares = async (id) => {
    const response = await sequelize.query(`
      select
        pl.lugares
      from padrao_lugares as pl
      join salas as s on (s.id_padrao_lugares = pl.id)
      where s.id = ${id}
    `).then((a) => a[0][0].lugares);

    return response;
  };

  static #update = async (id, dados, res) => {
    const getSessao = await this.#findSessaoById(id);

    if (!getSessao) {
      return trataError.badRequest(res, 'Nenhum registro encontrado para ser atualizado!');
    }

    if (dados.dataInicio && dados.dataInicio !== getSessao.dataInicio) {
      dados.dataFim = await this.#getDataFim(getSessao.idFilme, dados.dataInicio);
    }

    if (dados.idSala && dados.idSala !== getSessao.idSala) {
      const usados = getSessao.lugares.filter((a) => a.vendido);

      if (usados.length) {
        return trataError.badRequest(res, 'A operação não pode ser concluida pois lugares já foram vendidos na sessão!');
      }

      dados.lugares = await this.#getPadraoLugares(dados.idSala);
    }

    Object.keys(dados).forEach((field) => getSessao[field] = dados[field]);
    await getSessao.save();

    return res.status(200).send({ message: `Cadastro de id: ${getSessao.id} atualizado com sucesso`, data: getSessao });
  };

  static #getDataFim = async (idFilme, dataInicio) => {
    const filme = await Filme.findOne({
      where: {
        id: idFilme,
      },
    });

    if (!filme) {
      throw new Error('Filme não encontrado');
    }

    return moment.tz(dataInicio, process.env.TIMEZONE).add(filme.duracao, 'minutes').format();
  };

  static #create = async (dados, res) => {
    dados.dataFim = await this.#getDataFim(dados.idFilme, dados.dataInicio);
    dados.lugares = await this.#getPadraoLugares(dados.idSala);
    const response = await Sessao.create(dados);
    return res.status(200).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findSessaoById(id) || [];
      } else {
        response = await Sessao.findAll({
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

      if (req.body.dataInicio) {
        req.body.dataInicio = moment.tz(req.body.dataInicio, process.env.TIMEZONE).format();
      }

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

      const response = await this.#findSessaoById(id);

      if (!response) {
        return trataError.badRequest(res, 'Nenhum registro encontrado para ser excluido!');
      }

      await response.destroy();

      return res.status(200).send({ message: 'Registro excluido com sucesso', data: [] });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };
}
// TODO
// QUANTIDADE INGRESSOS VENDIDOS;
// VALOR FINAL DA SESSAO;
// VER SESSOES DISPONIVEIS PARA VENDA DE INGRESSO;
