import Teste from "../models/Teste.js";

export default class testeController {
  static get = async (req, res) => {
    try {
      let response = null;
      const { id } = req.params;

      if (id) {
        response = await Teste.findOne({
          where: {
            id,
          },
        });
      }

      response = await Teste.findAll();

      res.status(200).send({ message: response.length ? 'Busca feita com sucesso' : 'Nenhum usuário encontrado', response });
    } catch (error) {
      res.status(500).send({ message: 'Ops, ocorreu um erro!', error: error.message });
    }
  };
}
