const Empresa = require("../models/empresa");
const status = require("http-status");
const { fetchPaginatedData, updateRow, cloneObject, getRow, defaultErrorHandler } = require("../utils");
const { Op } = require("sequelize");
const Movimentos = require("../controllers/movimentos");
const { pacotesObject } = require("../../data/constants");

exports.Insert = (req, res) => {
  console.log('===========> ', req.body)
  const data = req.body;
  data.aprovado = false;
  data.usuarioId = req.user.id;
  console.log('===========> ', data)
  Empresa.create(data)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(empresa);
        Movimentos.Insert(
          'cadastrar-empresa',
          `O ${req.user.nome} cadastrou a empresa ${empresa.nome} com o pacote ${pacotesObject[empresa.pacote].label}`,
          req.user.id, empresa.id,
          pacotesObject[empresa.pacote].contrato
        )
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};
exports.SearchAll = (req, res) => {
  const { nome, tipo, pacote, aprovado, startDate, endDate } = req.query;

  const where = {}
  if (req.user.funcao === 'vendedor') {
    where.usuarioId = req.user.id
  }
  if (nome) {
    where.nome = {
      [Op.substring]: nome
    }
  }
  if (aprovado) {
    where.aprovado = aprovado
  }
  if (tipo) {
    where.tipo = tipo
  }
  if (pacote) {
    where.pacote = pacote
  }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Empresa, where)
};
exports.SearchOne = (req, res) => {
  const id = req.params.id;
  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(empresa);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};

exports.Update = (req, res) => {
  const { descricao, contacto, website, tempo_minimo, logotipoId, horario_comercial } = req.body
  updateRow(req, res, Empresa, cloneObject(
    { descricao, contacto, website, tempo_minimo, logotipoId, pacote, horario_comercial })
  ).then((data) => {
    if (typeof data === 'string') res.status(status.NOT_FOUND).send();
    else res.status(status.OK).send(data);
  }).catch((err => defaultErrorHandler(res, err)))
};

exports.Aprovar = (req, res) => {
  const { movimentoId } = req.body
  updateRow(req, res, Empresa, { aprovado: 1 })
    .then((empresa) => {
      if (typeof empresa === 'string') res.status(status.NOT_FOUND).send();
      else {
        res.status(status.NO_CONTENT).send();
        Movimentos.Insert(
          'aprovar-empresa',
          `${req.user.nome} aprovou o contrato com a ${empresa.nome}`,
          req.user.id, empresa.id
        )
        console.log("About to go", movimentoId)
        if (movimentoId !== null)
          Movimentos.Responder(movimentoId)
      }
    }).catch((err => defaultErrorHandler(res, err)))
};

exports.Reprovar = (req, res) => {
  const { movimentoId } = req.body
  updateRow(req, res, Empresa, { aprovado: 0 })
    .then((empresa) => {
      if (typeof empresa === 'string') res.status(status.NOT_FOUND).send();
      else {
        res.status(status.NO_CONTENT).send();
        Movimentos.Insert(
          'reprovar-empresa',
          `${req.user.nome} reprovou o contrato com a ${empresa.nome}`,
          req.user.id, empresa.id
        )
        if (movimentoId)
          Movimentos.Responder(movimentoId)
      }
    }).catch((err => defaultErrorHandler(res, err)))
};

exports.Add1MonthTrial = (req, res) => {
  getRow(req, res, Empresa).then((data) => {
    const now = new Date()
    if (!(data.expiracaoTrial instanceof Date && !isNaN(data.expiracaoTrial))) data.expiracaoTrial = new Date()
    const expiracaoTrial = new Date(data.expiracaoTrial || '')
    if (expiracaoTrial < now) {
      expiracaoTrial.setDate(now.getDate() + 30)
    } else {
      expiracaoTrial.setDate(expiracaoTrial.getDate() + 30)
    }
    updateRow(req, res, Empresa, { expiracaoTrial: expiracaoTrial.toJSON() })
      .then((empresa) => {
        if (typeof empresa === 'string') res.status(status.NOT_FOUND).send();
        else {
          res.status(status.NO_CONTENT).send();
          Movimentos.Insert(
            'teste',
            `${req.user.nome} ofereceu 1 mês de teste à ${empresa.nome}`,
            req.user.id, empresa.id
          )
        }

      }).catch((err => defaultErrorHandler(res, err)))
  })
};

exports.Add1MonthPayment = (req, res) => {
  getRow(req, res, Empresa).then((data) => {
    const now = new Date()
    if (!(data.expiracaoPagamento instanceof Date && !isNaN(data.expiracaoPagamento))) data.expiracaoPagamento = new Date()
    const expiracaoPagamento = new Date(data.expiracaoPagamento || '')
    if (expiracaoPagamento < now) {
      expiracaoPagamento.setDate(now.getDate() + 30)
    } else {
      expiracaoPagamento.setDate(expiracaoPagamento.getDate() + 30)
    }
    updateRow(req, res, Empresa, { expiracaoPagamento: expiracaoPagamento.toJSON() })
      .then((empresa) => {
        if (typeof empresa === 'string') res.status(status.NOT_FOUND).send();
        else {
          res.status(status.NO_CONTENT).send();
          Movimentos.Insert(
            'pagamento',
            `A ${empresa.nome} pagou +1 mês do pacote ${pacotesObject[empresa.pacote].label}.`,
            req.user.id, empresa.id, pacotesObject[empresa.pacote].mensalidade
          )
        }

      }).catch((err => defaultErrorHandler(res, err)))
  })
};

exports.Delete = (req, res) => {
  const { id } = req.params;
  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        empresa
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
    .catch((error) => defaultErrorHandler(res, error));
};
