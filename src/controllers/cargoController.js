import Cargo from '../models/Cargo.js';
import trataError from '../utils/trataError.js';

export default class CargoController {
  static #findCargoById = (id) => Cargo.findOne({ where: { id } });

  static #update = async (id, dados, res) => {
    const getCargo = await this.#findCargoById(id);

    if (!getCargo) {
      return trataError.badRequest(res, 'Nenhum registro encontrado para ser atualizado!');
    }

    Object.keys(dados).forEach((field) => getCargo[field] = dados[field]);
    await getCargo.save();

    return res.status(200).send({ message: `Cadastro de id: ${getCargo.id} atualizado com sucesso`, data: getCargo });
  };

  static #create = async (dados, res) => {
    const response = await Cargo.create(dados);
    return res.status(200).send({ message: 'Registro cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findCargoById(id) || [];
      } else {
        response = await Cargo.findAll({
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

      const response = await this.#findCargoById(id);

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
