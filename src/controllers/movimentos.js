const Movimento = require("../models/movimento");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, updateRow } = require("../utils");
const Empresa = require("../models/empresa");
const Usuario = require("../models/usuario");
const { Op } = require("sequelize");

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
  const { startDate, endDate } = req.query;
  if (startDate) {
    where.createdAt = { [Op.gt]: new Date(startDate) }
  }
  if (endDate) {
    where.createdAt = { [Op.lt]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Movimento, where)
};

exports.SearchTransactions = (req, res) => {
  const { startDate, endDate } = req.query;
  const where = {}
  where = {
    tipo: {
      [Op.ne]: "cadastrar-empresa",
    }
  }
  if (startDate) {
    where.createdAt = { [Op.gt]: new Date(startDate) }
  }
  if (endDate) {
    where.createdAt = { [Op.lt]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Movimento, where)
};
exports.SearchNotifications = (req, res) => {
  const { startDate, endDate, tipo, pacote } = req.query;
  const where = { tipo: "cadastrar-empresa", respondida: 0 }
  if (startDate) {
    where.createdAt = { [Op.gt]: new Date(startDate) }
  }
  if (endDate) {
    where.createdAt = { [Op.lt]: new Date(endDate) }
  }
  const empresaWhere = {}
  if (tipo) {
    empresaWhere.tipo = tipo
  }
  if (pacote) {
    empresaWhere.pacote = pacote
  }
  include = [{ model: Empresa, where: empresaWhere }, {
    model: Usuario, attributes: {
      exclude: ['senha']
    }
  }]
  fetchPaginatedData(req, res, Movimento, where, undefined, include)
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

exports.Responder = (id) => new Promise((resolve, reject) => {
  console.log("ID to respond ===>", id)
  updateRow(undefined, undefined, Movimento, { respondida: 1 }, id)
    .then((movimento) => {
      console.log(movimento)
      if (typeof movimento === 'string') resolve(false)
      else {
        resolve(true)
      }
    }).catch((err => reject(err)))
});

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
