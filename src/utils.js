const status = require("http-status");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 12;

exports.genToken = (data, time) => {
  return jwt.sign(data, process.env.TOKEN_SECRET, {
    expiresIn: time || 2 * 60 * 60,
  });
};

exports.generateToken = (id) => {
  const refreshToken = jwt.sign(
    { random: Math.random() * 1000000 },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "30 days",
    }
  );
  return jwt.sign({ id, refreshToken }, process.env.TOKEN_SECRET, {
    expiresIn: '7 days',
  });
};
exports.decodeToken = (token) => jwt.decode(token);

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

exports.fetchPaginatedData = (req, res, Model, where = {}, sanitizer, include) => {
  const { page = 0, size = 20 } = req.query;
  const { limit, offset } = this.getPagination(page, size);
  Model.findAndCountAll({
    limit, offset, where, include, attributes: {
      exclude: ['senha']
    },
  })
    .then((data) => {
      if (data) {
        if (sanitizer)
          data.rows = data.rows.map((item) => sanitizer(item))
        res.status(status.OK).send(this.getPaginatedData(data, page, limit));
      }
    })
    .catch((error) => this.defaultErrorHandler(res, error));
}

exports.updateRow = (req, res, Model, body, incomeId) => new Promise((resolve, reject) => {
  const id = incomeId || req.params.id
  Model.findByPk(id)
    .then((data) => {
      if (data) {
        data
          .update(body, {
            where: { id },
          })
          .then(() => {
            resolve(data)
          })
          .catch((error) => reject(error));
      } else {
        resolve('empty')
      }
    })
    .catch((error) => reject(error));
})

exports.getRow = (req, res, Model, incomeId) => new Promise((resolve, reject) => {
  {
    const id = incomeId || req.params.id
    Model.findByPk(id)
      .then((data) => {
        resolve(data)
      })
      .catch((error) => reject(error));
  }
})

exports.cloneObject = (data = {}) => JSON.parse(JSON.stringify(data))
exports.addDays = (date, days) => date.setDate(date.getDate() + days)

exports.defaultErrorHandler = (res, error) => {
  console.log(error)
  res.status(status.INTERNAL_SERVER_ERROR).send()
}