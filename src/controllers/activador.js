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
  const { nome} = req.query;

  const where = {}
  const usuarioWhere = {}
  
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
  const { nome, contacto } = req.body

  Activador.findByPk(id)
    .then((activador) => {
      if (activador) {
        activador
          .update(cloneObject({ nome, contacto }), {
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
  Activador.findByPk(id)
    .then((activador) => {
      if (activador) {
        activador
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


