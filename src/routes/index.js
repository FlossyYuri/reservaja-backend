const express = require("express");
const router = express.Router();
const usuarios = require("./usuarios");
const empresas = require("./empresas");
const movimentos = require("./movimentos");
const dashboard = require("./dashboard");
const activadores = require("./activador");
const cupoes = require("./cupao");
const auth = require("./auth");
const { authenticateToken } = require("../config/authValidation");

router.use("/usuarios", usuarios);
router.use("/empresas", authenticateToken, empresas);
router.use("/movimentos", authenticateToken, movimentos);
router.use("/dashboard", authenticateToken, dashboard);
router.use("/auth", auth);
//Rotas para Activadores, Clientes e Cupoes.
router.use("/activadores", authenticateToken, activadores);
router.use("/cupoes", cupoes);



router.use("/*", (_, res) => res.send("OK!"));

module.exports = router;