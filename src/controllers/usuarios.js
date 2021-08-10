const Usuario = require("../models/usuario");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, cloneObject } = require("../utils");
const { Op } = require("sequelize");
const Empresa = require("../models/empresa");
const Movimento = require("../models/movimento");

exports.Insert = (req, res) => {
  const usuario = req.body;
  usuario.ativo = 1;
  Usuario.create(usuario)
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};

exports.SearchAll = (req, res) => {
  const { nome, funcao, ativo, startDate, endDate } = req.query;

  const where = {}
  if (nome) {
    where.nome = {
      [Op.substring]: nome
    }
  }
  if (ativo) {
    where.ativo = ativo
  }
  if (funcao) {
    where.funcao = funcao
  }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Usuario, where)
};
exports.SearchOne = (req, res) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then(async (usuario) => {
      if (usuario) {
        const empresas = await Empresa.count({
          where: { usuarioId: usuario.id },
        })
        const receita = await Movimento.sum('valor', {
          where: {
            tipo: { [Op.or]: ['pagamento', 'cadastrar-empresa'] },
            usuarioId: usuario.id
          },
        })
        res.status(status.OK).send({ ...usuario.dataValues, empresas, receita });
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};

exports.Update = (req, res) => {
  const id = req.params.id;
  const { ativo, contacto } = req.body

  Usuario.findByPk(id)
    .then((usuario) => {
      if (usuario) {
        usuario
          .update(cloneObject({ ativo, contacto }), {
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

exports.Delete = (req, res) => {
  const { id } = req.params;
  Usuario.findByPk(id)
    .then((usuario) => {
      if (usuario) {
        usuario
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
