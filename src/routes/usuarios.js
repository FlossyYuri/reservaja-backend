const express = require("express");
const router = express.Router();
const UsuarioController = require("../controllers/usuarios");
const { authenticateToken, isAdmin } = require("../utils");

router.post("/", UsuarioController.Insert);
router.get("/", authenticateToken, isAdmin, UsuarioController.SearchAll);
router.get("/:id", authenticateToken, isAdmin, UsuarioController.SearchOne);
router.put("/:id", authenticateToken, isAdmin, UsuarioController.Update);
router.delete("/:id", authenticateToken, isAdmin, UsuarioController.Delete);

module.exports = router;
