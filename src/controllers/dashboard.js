const Empresa = require("../models/empresa");
const status = require("http-status");
const { defaultErrorHandler } = require("../utils");
const { Op } = require("sequelize");

exports.SearchAll = async (req, res) => {
  const { tipo, pacote, aprovado } = req.query;

  const where = {}
  if (req.user.funcao === 'vendedor') {
    where.usuarioId = req.user.id
  }
  if (aprovado) {
    if (aprovado === 'true')
      where.aprovado = 1
    if (aprovado === 'false')
      where.aprovado = 0
  }
  if (tipo) {
    where.tipo = tipo
  }
  if (pacote) {
    where.pacote = pacote
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