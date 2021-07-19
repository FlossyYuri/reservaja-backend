const Ficheiro = require("../models/ficheiro");
const status = require("http-status");

exports.Upload = (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }
  const {
    filename: ficheiro,
    originalname: nome,
    mimetype: tipo,
    path: rota,
    size: tamanho,
  } = file;
  Ficheiro.create({ nome, tipo, rota, tamanho, ficheiro })
    .then((ficheiro) => {
      if (ficheiro) {
        res.status(status.OK).send({
          id: ficheiro.id,
        });
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
exports.GET = (req, res, next) => {
  const id = req.params.id;
  Ficheiro.findByPk(id)
    .then((ficheiro) => {
      if (ficheiro) {
        const file = `${__basedir}\\${ficheiro.rota}`;
        res.sendFile(file);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
exports.Download = (req, res, next) => {
  const id = req.params.id;
  Ficheiro.findByPk(id)
    .then((ficheiro) => {
      if (ficheiro) {
        const file = `${__basedir}\\${ficheiro.rota}`;
        res.download(file);
      } else {
        res.status(status.NOT_FOUND).send();
      }
    })
    .catch((error) => next(error));
};
