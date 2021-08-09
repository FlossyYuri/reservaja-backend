const express = require("express");
const { authenticateToken } = require("../config/authValidation");
const router = express.Router();
const MovimentoController = require("../controllers/movimentos");

router.get("/notificacoes", authenticateToken, MovimentoController.SearchNotifications);
router.get("/transacoes", authenticateToken, MovimentoController.SearchTransactions);
router.get("/faturamento/:empresaId", authenticateToken, MovimentoController.Faturamento);
router.get("/", authenticateToken, MovimentoController.SearchAll);
router.get("/:id", authenticateToken, MovimentoController.SearchOne);
router.delete("/:id", authenticateToken, MovimentoController.Delete);

module.exports = router;
