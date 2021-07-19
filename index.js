const http = require("http");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const status = require("http-status");
const sequelize = require("./src/database/database");
const Empresa = require("./src/models/empresa");
const Usuario = require("./src/models/usuario");
const app = express();
const routes = require("./src/routes");

Usuario.hasMany(Empresa);
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

global.__basedir = __dirname;
app.use(express.static("/uploads/files"));
app.use(cors());

app.use(routes);

app.use((req, res, next) => {
  res.status.apply(status.NOT_FOUND).send("Pagina nao encontrada");
});

app.use((req, res, next) => {
  res.status.apply(status.INTERNAL_SERVER_ERROR).json({ error });
});

sequelize.sync({ force: false }).then(() => {
  const port = 5000;
  app.set("port", port);
  const server = http.createServer(app);
  server.listen(port);
});
