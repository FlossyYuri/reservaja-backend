const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario");
const status = require("http-status");
const { compareHash, generateToken, verifyToken } = require("../utils");

exports.Login = (req, res, next) => {
  const { email, senha } = req.body;

  Usuario.findOne({ where: { email } })
    .then(async (usuario) => {
      if (usuario) {
        const validPassword = await compareHash(senha, usuario.senha);
        if (validPassword) {
          if (usuario.ativo) {

            const token = generateToken(usuario.id);
            res.status(status.OK).send({ token });
          } else {
            res.status(status.UNAUTHORIZED).send("Usuário desativado, contacte o administrador!");
          }
        } else {
          res.status(status.UNAUTHORIZED).send("Senha incorreta!");
        }
      } else {
        res.status(status.NOT_FOUND).send("Nenhum usuário com esse email!");
      }
    })
    .catch((error) => next(error));
};
exports.ME = (req, res, next) => {
  res.status(status.OK).send(req.user);
};
exports.Refresh = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const decoded = jwt.decode(token);
  if (decoded) {
    verifyToken(decoded.refreshToken, (err, user) => {
      if (err) {
        res.status(status.NOT_FOUND).send(err);
      } else {
        const newToken = generateToken(decoded.id);
        res.status(status.OK).send({ token: newToken });
      }
    });
  }
  res.status(status.NOT_FOUND).send();
};
