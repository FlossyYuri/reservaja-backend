const http = require("http");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const status = require("http-status");
const sequelize = require("./src/database/database");
const Empresa = require("./src/models/empresa");
const Usuario = require("./src/models/usuario");
const Movimento = require("./src/models/movimento");
const app = express();
const routes = require("./src/routes");
const Activador = require("./src/models/activador");
const Cupao = require("./src/models/cupao");

Usuario.hasMany(Empresa);
Empresa.belongsTo(Usuario)
Usuario.hasMany(Movimento, {
  foreignKey: {
    allowNull: true
  }
});
Movimento.belongsTo(Usuario)
Empresa.hasMany(Movimento);
Movimento.belongsTo(Empresa)

//Relacionamento entre Usuario e Activador
Usuario.hasMany(Activador);
Activador.belongsTo(Usuario);

//Relacionamento entre entidade activador e cupao
Activador.hasMany(Cupao);
Cupao.belongsTo(Activador);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

global.__basedir = __dirname;
app.use(cors());

app.use(routes);

app.use((req, res, next) => {
  res.status.apply(status.NOT_FOUND).send("Pagina nao encontrada");
});

app.use((req, res, next) => {
  res.status.apply(status.INTERNAL_SERVER_ERROR).json({ error });
});

sequelize.sync({ force: false }).then(() => {
  const port = process.env.PORT || 5000;
  app.set("port", port);
  const server = http.createServer(app);
  server.listen(port);
});
