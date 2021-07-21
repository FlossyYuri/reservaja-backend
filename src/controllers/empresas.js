const Empresa = require("../models/empresa");
const status = require("http-status");
const { sanitizeEmpresa, fetchPaginatedData, updateRow, cloneObject, getRow } = require("../utils");
const { Op } = require("sequelize");
const Movimentos = require("../controllers/movimentos");

exports.Insert = (req, res, next) => {
  const data = req.body;
  data.aprovado = false;
  data.usuarioId = req.user.id;
  data.horario_comercial = JSON.stringify(data.horario_comercial)
  data.expiracaoTrial = new Date().toJSON()
  data.expiracaoPagamento = new Date().toJSON()
  Empresa.create(req.body)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(empresa);
        Movimentos.Insert(
          'cadastrar-empresa',
          `O ${req.user.nome} cadastrou a empresa ${empresa.nome}`,
          req.user.id, empresa.id
        )
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
exports.SearchAll = (req, res, next) => {
  const { nome, tipo, pacote, ativo } = req.query;

  const where = {}
  if (req.user.funcao === 'vendedor') {
    where.usuarioId = req.user.id
  }
  if (nome) {
    where.nome = {
      [Op.substring]: nome
    }
  }
  if (ativo) {
    if (ativo === 'true')
      where.ativo = 1
    if (ativo === 'false')
      where.ativo = 0
  }
  if (tipo) {
    where.tipo = tipo
  }
  if (pacote) {
    where.pacote = pacote
  }
  fetchPaginatedData(req, res, Empresa, where, sanitizeEmpresa)
};
exports.SearchOne = (req, res, next) => {
  const id = req.params.id;

  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(sanitizeEmpresa(empresa));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.Update = (req, res) => {
  const { descricao, contacto, website, tempo_minimo, logotipoId } = req.body
  updateRow(req, res, Empresa, cloneObject(
    { descricao, contacto, website, tempo_minimo, logotipoId, pacote })
  ).then((data) => {
    if (typeof data === 'string') res.status(status.NOT_FOUND).send();
    else res.status(status.OK).send(data);
  }).catch((err => res.status(500).send(err)))
};

exports.Add1MonthTrial = (req, res) => {
  getRow(req, res, Empresa).then((data) => {
    const now = new Date()
    const expiracaoTrial = new Date(data.expiracaoTrial)
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

      }).catch((err => res.status(500).send(err)))
  })
};

exports.Add1MonthPayment = (req, res) => {
  getRow(req, res, Empresa).then((data) => {
    const now = new Date()
    const expiracaoPagamento = new Date(data.expiracaoPagamento)
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
            `A ${empresa.nome} pagou +1 mês do pacote ${empresa.pacote}`,
            req.user.id, empresa.id
          )
        }

      }).catch((err => res.status(500).send(err)))
  })
};

exports.Delete = (req, res, next) => {
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
    .catch((error) => next(error));
};
