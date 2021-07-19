const Empresa = require("../models/empresa");
const status = require("http-status");
const { sanitizeEmpresa } = require("../utils");

exports.Insert = (req, res, next) => {
  const data = req.body;
  data.ativo = false;
  data.usuarioId = req.user.id;
  data.horario_comercial = JSON.stringify(data.horario_comercial)
  Empresa.create(req.body)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(empresa);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.SearchAll = (req, res, next) => {
  Empresa.findAll()
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(empresa.map((item) => sanitizeEmpresa(item)));
      }
    })
    .catch((error) => next(error));
};
exports.SearchOne = (req, res, next) => {
  const id = req.params.id;

  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        res.status(status.OK).send(sanitizeEmpresa(empresa));
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};

exports.Update = (req, res, next) => {
  const id = req.params.id;
  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        empresa
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
  Empresa.findByPk(id)
    .then((empresa) => {
      if (empresa) {
        empresa
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
