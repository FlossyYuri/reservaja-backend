const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Ficheiro = sequelize.define("ficheiro", {
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
  ficheiro: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  tipo: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  rota: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  tamanho: {
    allowNull: false,
    type: Sequelize.INTEGER,
  },
});

module.exports = Ficheiro;
