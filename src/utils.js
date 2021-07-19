const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Usuario = require("./models/usuario");
const saltRounds = 12;

exports.generateToken = (id) => {
  const refreshToken = jwt.sign(
    { random: Math.random() * 1000000 },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "2 days",
    }
  );
  return jwt.sign({ id, refreshToken }, process.env.TOKEN_SECRET, {
    expiresIn: 15 * 60,
  });
};
exports.decodeToken = (token) => jwt.decode(token);

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.status(403).sendStatus(403);
    else {
      Usuario.findByPk(user.id)
        .then((usuario) => {
          if (usuario) {
            req.user = usuario;
            next();
          } else {
            res.status(status.NOT_FOUND).send();
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

exports.verifyToken = (token, callback) => {
  jwt.verify(token, process.env.TOKEN_SECRET, callback);
};

exports.generateHash = (senha) => bcrypt.hashSync(senha, saltRounds);
exports.compareHash = (senha, hash) => bcrypt.compare(senha, hash);

exports.sanitizeEmpresa = (empresa) => {
  empresa.horario_comercial = JSON.parse(empresa.horario_comercial)
  return empresa
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 20;
  const offset = page ? page * limit : 0;
  return { limit, offset };
};
exports.getPaginatedData = (data, page, limit) => {
  const { count: totalItems, rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, items, totalPages, currentPage };
};

