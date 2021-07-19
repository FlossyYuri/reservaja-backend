const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Empresa = sequelize.define("empresa", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  nome: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  tipo: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  pacote: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  descricao: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  endereco: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  contacto: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  ativo: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  website: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  tempo_minimo: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  horario_comercial: {
    allowNull: false,
    type: Sequelize.TEXT,
  },
  documentoId: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  logotipoId: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
});

module.exports = Empresa;
