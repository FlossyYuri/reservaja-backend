const Sequelize = require("sequelize");
const sequelize = require("../database/database");
const { generateHash } = require("../utils");

const Usuario = sequelize.define("usuario", {
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
    },
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  contacto: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  senha: {
    allowNull: false,
    type: Sequelize.STRING,
    set(value) {
      this.setDataValue('senha', generateHash(value));
    },
  },
  funcao: {
    allowNull: false,
    type: Sequelize.STRING,
  },
  ativo: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = Usuario;
