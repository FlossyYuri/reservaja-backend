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
  if (aprovado) {
    where.aprovado = aprovado
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
    const todasEmpresas = await Empresa.count({
      where,
    })
    const empresasTrial = await Empresa.count({
      where: { ...where, expiracaoTrial: { [Op.gt]: new Date() } },
    })
    const empresasContrato = await Empresa.count({
      where: { ...where, expiracaoPagamento: { [Op.gt]: new Date() } },
    })
    res.status(status.OK).send({ todasEmpresas, empresasTrial, empresasContrato })
  } catch (error) {
    defaultErrorHandler(res, error)
  }

};