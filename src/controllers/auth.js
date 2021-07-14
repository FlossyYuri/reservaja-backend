const Usuario = require("../models/usuario");
const status = require("http-status");

exports.Login = (req, res, next) => {
  const { email, senha } = req.body;

  Usuario.findOne({ where: { email, senha } })
    .then((usuario) => {
      if (usuario) {
        res.status(status.OK).send(usuario);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
