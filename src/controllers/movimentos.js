const Movimento = require("../models/movimento");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler } = require("../utils");

exports.Insert = (tipo, descricao, usuarioId, empresaId) => new Promise((resolve, reject) => {
  const movimento = { tipo, descricao, usuarioId, respondida: false }
  if (empresaId)
    movimento.empresaId = empresaId
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
exports.SearchOne = (req, res) => {
  const { id } = req.params;

  Movimento.findByPk(id)
    .then((movimento) => {
      if (movimento) {
        res.status(status.OK).send(movimento);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};

exports.Delete = (req, res) => {
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
          .catch((error) => defaultErrorHandler(res, error));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};
