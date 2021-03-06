const Usuario = require("../models/usuario");
const status = require("http-status");
const { fetchPaginatedData, defaultErrorHandler, cloneObject } = require("../utils");
const { Op } = require("sequelize");
const Empresa = require("../models/cupao");
const Activador = require("../models/activador");

exports.Insert = (req, res) => {
  const activador = req.body;
  activador.ativo = 1;
  Activador.create(activador)
    .then((activador) => {
      if (activador) {
        res.status(status.OK).send(activador);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => defaultErrorHandler(res, error));
};

exports.SearchAll = (req, res) => {
  const {nome,numero} = req.query;

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
 
  include = {
    model: Usuario,
    attributes: {
      exclude: ['senha']
    },
    where: usuarioWhere
  }
  fetchPaginatedData(req, res, Activador, where, undefined, include)
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


