import Sessao from '../models/Sessao.js';
import Usuario from '../models/Usuario.js';
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

  static #create = async (dados, res) => {
    const response = await Usuario.create(dados);
    return res.status(200).send({ message: 'Registro cadastrado com sucesso', data: response });
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
        return trataError.badRequest(res, 'Informações inválidas');
      }

      const sessao = await Sessao.findOne({
        where: {
          id: dados.idSessao,
        },
      });

      if (sessao) {
        return trataError.badRequest(res, `Nenhuma sessão encontrada com o id ${dados.idSessao}`);
      }
    } catch (error) {
      return trataError.internalError(res, error);
    }
  };
}

// TO DO
// Comprar sessao;
// Validar descontos;
// Cancelar COmpra
