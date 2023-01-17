export default class Erro {
  static internalError = (res, error) => res.status(500).send({ message: 'Ops, ocorreu um erro!', data: error.message });

  static badRequest = (res, message) => res.status(400).send({ message, data: [] });
}
