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
  aprovado: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  expiracaoTrial: {
    allowNull: true,
    type: Sequelize.DATE,
  },
  expiracaoPagamento: {
    allowNull: true,
    type: Sequelize.DATE,
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
    get() {
      return JSON.parse(this.getDataValue('horario_comercial'))
    },
    set(value) {
      this.setDataValue('horario_comercial', JSON.stringify(value));
    }
  },
  documento: {
    allowNull: true,
    type: Sequelize.STRING,
  },
  logotipo: {
    allowNull: true,
    type: Sequelize.STRING,
  },
});

module.exports = Empresa;
