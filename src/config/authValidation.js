const jwt = require("jsonwebtoken");
const status = require("http-status");
const Usuario = require("../models/usuario");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err)
      console.log(err);
    if (err) return res.status(status.UNAUTHORIZED).send({ inspiredToken: true })
    else {
      Usuario.findByPk(user.id)
        .then((usuario) => {
          if (usuario) {
            req.user = usuario;
            next();
          } else {
            res.status(status.FORBIDDEN).send();
          }
        })
        .catch((error) => next(error));
    }
  });
};

exports.isVendedor = (req, res, next) => {
  if (req.user && req.user.funcao === 'vendedor') {
    next();
  } else {
    res.sendStatus(401);
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.funcao === 'admin') {
    next();
  } else {
    res.sendStatus(401);
  }
};