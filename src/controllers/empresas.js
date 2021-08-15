const Empresa = require("../models/empresa");
const status = require("http-status");
const { fetchPaginatedData, updateRow, cloneObject, getRow, defaultErrorHandler } = require("../utils");
const { Op, where } = require("sequelize");
const Movimentos = require("../controllers/movimentos");
const { pacotesObject, months } = require("../../data/constants");
const Usuario = require("../models/usuario");

exports.Insert = (req, res) => {
  const data = req.body;
  data.aprovado = false;
  data.usuarioId = req.user.id;
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
  const { nome, tipo, pacote, aprovado, startDate, endDate, usuarioNome } = req.query;

  const where = {}
  const usuarioWhere = {}
  if (req.user.funcao === 'vendedor') {
    where.usuarioId = req.user.id
  }
  if (nome) {
    where.nome = {
      [Op.substring]: nome
    }
  }
  if (usuarioNome) {
    usuarioWhere.nome = {
      [Op.substring]: usuarioNome
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
  include = {
    model: Usuario,
    attributes: {
      exclude: ['senha']
    },
    where: usuarioWhere
  }
  fetchPaginatedData(req, res, Empresa, where, undefined, include)
};
exports.SearchOne = (req, res) => {
  const id = req.params.id;
  Empresa.findByPk(id, {
    include: {
      model: Usuario,
      attributes: {
        exclude: ['senha']
      },
    }
  })
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
  const { pacote, descricao, endereco, contacto, email, website, horario_comercial, tempo_minimo, logotipo, documento } = req.body
  updateRow(req, res, Empresa, cloneObject(
    { pacote, descricao, endereco, contacto, email, website, horario_comercial, tempo_minimo, logotipo, documento })
  ).then((data) => {
    if (typeof data === 'string') res.status(status.NOT_FOUND).send();
    else res.status(status.OK).send(data);
  }).catch((err => defaultErrorHandler(res, err)))
};

exports.Aprovar = (req, res) => {
  const { movimentoId } = req.body
  getRow(req, res, Empresa).then((data) => {
    const now = new Date()
    if (!(data.expiracaoTrial instanceof Date && !isNaN(data.expiracaoTrial))) data.expiracaoTrial = new Date()
    const expiracaoTrial = new Date(data.expiracaoTrial || '')
    if (expiracaoTrial < now) {
      expiracaoTrial.setDate(now.getDate() + 30)
    } else {
      expiracaoTrial.setDate(expiracaoTrial.getDate() + 30)
    }
    updateRow(req, res, Empresa, { expiracaoTrial: expiracaoTrial.toJSON(), aprovado: 1 })
      .then((empresa) => {
        if (typeof empresa === 'string') res.status(status.NOT_FOUND).send();
        else {
          res.status(status.NO_CONTENT).send();
          Movimentos.Insert(
            'teste',
            `${req.user.nome} ofereceu 1 mês de teste à ${empresa.nome}`,
            req.user.id, empresa.id
          )
          Movimentos.Insert(
            'aprovar-empresa',
            `${req.user.nome} aprovou o contrato com a ${empresa.nome}`,
            req.user.id, empresa.id
          )
          if (movimentoId !== null)
            Movimentos.Responder(movimentoId)
        }
      }).catch((err => defaultErrorHandler(res, err)))
  })
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
          Movimentos.SearchPerMonth({ tipo: 'pagamento', empresaId: empresa.id }, new Date().getMonth())
            .then((data) => {
              if (data.length === 0) {
                Movimentos.Insert(
                  'pagamento',
                  `A ${empresa.nome} pagou o mês de ${months[now.getMonth()]} do pacote ${pacotesObject[empresa.pacote].label}.`,
                  req.user.id, empresa.id, pacotesObject[empresa.pacote].mensalidade
                )
                res.status(status.NO_CONTENT).send();
              } else {
                res.status(status.OK).send("Mês já foi pago!");
              }
            })

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
