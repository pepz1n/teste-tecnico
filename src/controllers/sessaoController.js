import { Op } from 'sequelize';
import Filme from '../models/Filme.js';
import Sessao from '../models/Sessao.js';
import trataError from '../utils/trataError.js';
import sequelize from '../config/index.js';
import dateAux from '../utils/dateAux.js';

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

    const response = getSessao.toJSON();

    response.dataFim = dateAux.formatDate(response.dataFim);
    response.dataInicio = dateAux.formatDate(response.dataInicio);

    return res.status(200).send({ message: `Cadastro de id: ${getSessao.id} atualizado com sucesso`, data: response });
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

    return dateAux.somaData(dataInicio, filme.duracao, 'minutes');
  };

  static #create = async (dados, res) => {
    dados.dataFim = await this.#getDataFim(dados.idFilme, dados.dataInicio);
    dados.lugares = await this.#getPadraoLugares(dados.idSala);
    let response = await Sessao.create(dados);

    response = response.toJSON();

    response.dataFim = dateAux.formatDate(response.dataFim);
    response.dataInicio = dateAux.formatDate(response.dataInicio);

    return res.status(201).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findSessaoById(id).then((a) => a && a.toJSON()) || [];
        response.dataFim = dateAux.formatDate(response.dataFim);
        response.dataInicio = dateAux.formatDate(response.dataInicio);
      } else {
        response = await Sessao.findAll({
          order: [['id', 'asc']],
        });

        response = response.map((item) => {
          const itemFormatado = item.toJSON();
          itemFormatado.dataFim = dateAux.formatDate(itemFormatado.dataFim);
          itemFormatado.dataInicio = dateAux.formatDate(itemFormatado.dataInicio);
          return itemFormatado;
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
        req.body.dataInicio = dateAux.formatDate(req.body.dataInicio);
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

  static relatorioSessao = async (req, res) => {
    try {
      const { idSessao } = req.params;

      if (!idSessao) {
        return trataError.badRequest(res, 'Nenhum id informado');
      }

      const getSessao = await this.#findSessaoById(idSessao);

      if (!getSessao) {
        return trataError.badRequest(res, `Nenhum registro encontrado com id ${idSessao}`);
      }

      const response = await sequelize.query(`
        select
          count(us.id) as vendidos,
          sum(us.valor_atual) as "valorTotal"
        from usuario_sessoes as us
        where us.id_sessao = ${idSessao}
      `).then((a) => a[0][0]);

      response.valorTotal = response.valorTotal ? Number(response.valorTotal).toFixed(2) : 0.00;

      return res.status(200).send({ message: 'Dados resgatados com sucesso', data: response });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };

  static getSessoesDisponiveis = async (req, res) => {
    try {
      const sessoes = await Sessao.findAll({
        where: {
          dataInicio: {
            [Op.gt]: new Date(),
          },
        },
        order: [['id', 'asc']],
      });

      if (!sessoes.length) {
        return trataError.badRequest(res, 'Nenhuma sessão disponivel para a compra!');
      }

      const sessoesFiltradas = sessoes.filter((a) => {
        const lugares = a.lugares.filter((b) => !b.vendido);
        if (lugares.length) {
          return true;
        }
        return false;
      }).map((item) => {
        const itemFormatado = item.toJSON();
        itemFormatado.dataFim = dateAux.formatDate(itemFormatado.dataFim);
        itemFormatado.dataInicio = dateAux.formatDate(itemFormatado.dataInicio);
        return itemFormatado;
      });

      return res.status(200).send({ message: 'Dados resgatados com sucesso', data: sessoesFiltradas });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };
}
