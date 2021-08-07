const Empresa = require("../models/empresa");
const status = require("http-status");
const { defaultErrorHandler } = require("../utils");
const { Op } = require("sequelize");

exports.SearchAll = async (req, res) => {
  const { tipo, pacote, aprovado, startDate, endDate } = req.query;

  const where = {}
  if (req.user.funcao === 'vendedor') {
    where.usuarioId = req.user.id
  }
  if (tipo) {
    where.tipo = tipo
  }
  if (pacote) {
    where.pacote = pacote
  }
  if (startDate && endDate) {
    where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] }
  } else if (startDate) {
    where.createdAt = { [Op.gte]: new Date(startDate) }
  } else if (endDate) {
    where.createdAt = { [Op.lte]: new Date(endDate) }
  }
  try {
    const todas = await Empresa.count({
      where,
    })
    const trial = await Empresa.count({
      where: { ...where, expiracaoTrial: { [Op.gt]: new Date() } },
    })
    const contratos = await Empresa.count({
      where: { ...where, aprovado: true },
    })
    res.status(status.OK).send({ todas, trial, contratos, naoAprovado: todas - contratos })
  } catch (error) {
    defaultErrorHandler(res, error)
  }

};