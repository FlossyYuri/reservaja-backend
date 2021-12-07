const Sequelize = require("sequelize");
const sequelize = require("../database/database");
//const { generateHash } = require("../utils");

const Cupao = sequelize.define("cupao", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  quantidade: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
  codigo: {
    allowNull: false,
    type: Sequelize.STRING,
  },

  validacoes: {
    allowNull: false,
    type: Sequelize.INTEGER,
    default: 0,
  },

  pagamento: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  }
});

module.exports = Cupao;
