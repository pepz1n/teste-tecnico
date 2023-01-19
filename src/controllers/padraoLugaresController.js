import PadraoLugares from '../models/PadraoLugares.js';
import trataError from '../utils/trataError.js';

export default class PadraoLugaresController {
  static #findPadraoLugaresById = (id) => PadraoLugares.findOne({ where: { id } });

  static #update = async (id, dados, res) => {
    const getPadraoLugares = await this.#findPadraoLugaresById(id);

    if (!getPadraoLugares) {
      return trataError.badRequest(res, 'Nenhum registro encontrado para ser atualizado!');
    }

    Object.keys(dados).forEach((field) => getPadraoLugares[field] = dados[field]);
    await getPadraoLugares.save();

    return res.status(200).send({ message: `Cadastro de id: ${getPadraoLugares.id} atualizado com sucesso`, data: getPadraoLugares });
  };

  static #create = async (dados, res) => {
    const response = await PadraoLugares.create(dados);
    return res.status(200).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findPadraoLugaresById(id) || [];
      } else {
        response = await PadraoLugares.findAll({
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

      const response = await this.#findPadraoLugaresById(id);

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
