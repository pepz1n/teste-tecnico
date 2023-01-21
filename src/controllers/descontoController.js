import Desconto from '../models/Desconto.js';
import trataError from '../utils/trataError.js';

export default class DescontoController {
  static #findDescontoById = (id) => Desconto.findOne({ where: { id } });

  static #update = async (id, dados, res) => {
    const getDesconto = await this.#findDescontoById(id);

    if (!getDesconto) {
      return trataError.badRequest(res, 'Nenhum registro encontrado para ser atualizado!');
    }

    Object.keys(dados).forEach((field) => getDesconto[field] = dados[field]);
    await getDesconto.save();

    return res.status(200).send({ message: `Cadastro de id: ${getDesconto.id} atualizado com sucesso`, data: getDesconto });
  };

  static #create = async (dados, res) => {
    const response = await Desconto.create(dados);
    return res.status(201).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findDescontoById(id) || [];
      } else {
        response = await Desconto.findAll({
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

      const response = await this.#findDescontoById(id);

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
