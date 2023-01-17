import Teste from '../models/Teste.js';
import trataError from '../utils/trataError.js';

export default class testeController {
  static #findTesteById = (id) => Teste.findOne({ where: { id } });

  static #update = async (id, dados, res) => {
    const getTest = await this.#findTesteById(id);

    if (!getTest) {
      return trataError.badRequest(res, 'Nenhum Teste encontrado para ser atualizado!');
    }

    Object.keys(dados).forEach((field) => getTest[field] = dados[field]);
    await getTest.save();

    return res.status(200).send({ message: `Cadastro de id: ${getTest.id} atualizado com sucesso`, data: getTest });
  };

  static #create = async (dados, res) => {
    const response = await Teste.create(dados);
    return res.status(200).send({ message: 'Teste cadastrado com sucesso', data: response });
  };

  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await this.#findTesteById(id);
      }

      response = await Teste.findAll({
        order: [['id', 'asc']],
      });

      return res.status(200).send({ message: response.length ? 'Busca feita com sucesso' : 'Nenhum usuário encontrado', data: response });
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

      const teste = await this.#findTesteById(id);

      if (!teste) {
        return trataError.badRequest(res, 'Nenhum Teste encontrado para ser excluido!');
      }

      await teste.destroy();

      return res.status(200).send({ message: 'Teste excluido com sucesso', data: [] });
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };
}
