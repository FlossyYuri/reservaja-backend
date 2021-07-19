const express = require("express");
const router = express.Router();
const ficheiros = require("./ficheiros");
const usuarios = require("./usuarios");
const empresas = require("./empresas");
const auth = require("./auth");
const { authenticateToken } = require("../utils");

router.use("/ficheiros", ficheiros);
router.use("/usuarios", usuarios);
router.use("/empresas", authenticateToken, empresas);
router.use("/auth", auth);
router.use("/*", (_, res) => res.send("OK!"));

module.exports = router;
