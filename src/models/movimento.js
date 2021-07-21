const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Movimento = sequelize.define("movimento", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  tipo: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  descricao: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  respondida: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
  },
});

module.exports = Movimento;
