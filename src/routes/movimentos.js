const express = require("express");
const router = express.Router();
const MovimentoController = require("../controllers/movimentos");
const { authenticateToken, isAdmin } = require("../utils");

router.get("/notificacoes", authenticateToken, isAdmin, MovimentoController.SearchNotifications);
router.get("/transacoes", authenticateToken, isAdmin, MovimentoController.SearchTransactions);
router.get("/", authenticateToken, isAdmin, MovimentoController.SearchAll);
router.get("/:id", authenticateToken, isAdmin, MovimentoController.SearchOne);
router.delete("/:id", authenticateToken, isAdmin, MovimentoController.Delete);

module.exports = router;
