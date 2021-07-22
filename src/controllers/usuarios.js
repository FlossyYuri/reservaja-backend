const Usuario = require("../models/usuario");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, cloneObject } = require("../utils");
const { Op } = require("sequelize");

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
  if (startDate) {
    where.createdAt = { [Op.gt]: new Date(startDate) }
  }
  if (endDate) {
    where.createdAt = { [Op.lt]: new Date(endDate) }
  }
  fetchPaginatedData(req, res, Usuario, where)
};
exports.SearchOne = (req, res) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
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
