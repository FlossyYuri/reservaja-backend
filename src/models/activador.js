const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const { generateHash } = require("../utils");

const Activador = sequelize.define("activador", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  nome: {
    allowNull: false,
    type: Sequelize.STRING,
    validate: {
      len: [3, 100],
    }},
  contacto: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  
  ativo: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Activador;
