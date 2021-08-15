const Movimento = require("../models/movimento");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, updateRow } = require("../utils");
const Empresa = require("../models/empresa");
const Usuario = require("../models/usuario");
const { Op } = require("sequelize");

exports.Insert = (tipo, descricao, usuarioId, empresaId, valor) => new Promise((resolve, reject) => {
  const movimento = { tipo, descricao, usuarioId, respondida: false, valor }
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
  const where = {}
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Movimento, where)
};

exports.SearchPerMonth = (where = {}, month) => new Promise((resolve, reject) => {
  {
    let today = new Date(new Date().setHours(0, 0, 0));
    const withMonth = new Date(month ? today.setMonth(month) : new Date().setHours(0, 0, 0))
    const firstDay = new Date(withMonth.setDate(1))
    const lastDay = new Date(new Date(withMonth.getFullYear(), today.getMonth() + 1, 0).setHours(23, 59));
    where.createdAt = { [Op.between]: [firstDay, lastDay] }
    Movimento.findAll({
      where
    })
      .then((data) => {
        if (data) {
          resolve(data)
        }
      })
      .catch((error) => reject(error));
  }
});
exports.Faturamento = async (req, res) => {
  try {
    const total = await Movimento.sum('valor',
      {
        where: {
          tipo: { [Op.or]: ['pagamento', 'cadastrar-empresa'] },
          empresaId: req.params.empresaId
        }
      })
    res.status(status.OK).json({ total })
  } catch (error) {
    defaultErrorHandler(res, error)
  }
}

exports.SearchTransactions = (req, res) => {
  const { startDate, endDate, tipo, empresaId } = req.query;

  const where = {}
  if (tipo) {
    if (typeof tipo === 'string')
      where.tipo = tipo
    else
      where.tipo = {
        [Op.or]: tipo
      }
  }
  if (empresaId) {
    where.empresaId = empresaId
  }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
  }
  include = [{ model: Empresa }, {
    model: Usuario, attributes: {
      exclude: ['senha']
    }
  }]
  fetchPaginatedData(req, res, Movimento, where, undefined, include)
};
exports.SearchNotifications = (req, res) => {
  const { startDate, endDate, tipo, pacote } = req.query;
  const where = { tipo: "cadastrar-empresa", respondida: 0 }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
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
  updateRow(undefined, undefined, Movimento, { respondida: 1 }, id)
    .then((movimento) => {
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
