const Usuario = require("../models/usuario");
const status = require("http-status");
const { generateHash } = require("../utils");

exports.Insert = (req, res, next) => {
  const usuario = req.body;
  usuario.senha = generateHash(usuario.senha);
  Usuario.create(usuario)
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.SearchAll = (req, res, next) => {
  Usuario.findAll()
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
      }
    })
    .catch((error) => next(error));
};
exports.SearchOne = (req, res, next) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.Update = (req, res, next) => {
  const id = req.params.id;

  Usuario.findByPk(id)
    .then((usuario) => {
      if (usuario) {
        usuario
          .update(req.body, {
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

exports.Delete = (req, res, next) => {
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
          .catch((error) => next(error));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
