const Movimento = require("../models/movimento");
const status = require("http-status");
const { fetchPaginatedData } = require("../utils");

exports.Insert = (tipo, descricao, idUsuario, idEmpresa) => new Promise((resolve, reject) => {
  const movimento = { tipo, descricao, idUsuario, respondida: false }
  if (idEmpresa)
    movimento.idEmpresa = idEmpresa
  Movimento.create(movimento)
    .then((movimento) => {
      if (movimento) {
        resolve(movimento)
      } else {
        resolve(status.NOT_FOUND)
      }
    })
    .catch((error) => reject(error));
});

exports.SearchAll = (req, res) => {
  fetchPaginatedData(req, res, Movimento)
};

exports.SearchTransactions = (req, res) => {
  const where = {}
  where[Op.or] = [{ tipo: "pagamento" }, { tipo: "oferta" }, { tipo: "teste" }]
  fetchPaginatedData(req, res, Movimento, where)
};
exports.SearchNotifications = (req, res) => {
  const where = { tipo: "cadastrar-empresa" }
  fetchPaginatedData(req, res, Movimento, where)
};
exports.SearchOne = (req, res, next) => {
  const { id } = req.params;

  Movimento.findByPk(id)
    .then((movimento) => {
      if (movimento) {
        res.status(status.OK).send(movimento);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.Update = (req, res, next) => {
  const { id } = req.params;

  Movimento.findByPk(id)
    .then((movimento) => {
      if (movimento) {
        movimento
          .update(req.body, {
            where: { id },
          })
          .then(() => {
            res.status(status.OK).send();
          })
          .catch((error) => next(error));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.Delete = (req, res, next) => {
  const { id } = req.params;
  Movimento.findByPk(id)
    .then((movimento) => {
      if (movimento) {
        movimento
          .destroy({
            where: { id },
          })
          .then(() => {
            res.status(status.OK).send();
          })
          .catch((error) => next(error));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
