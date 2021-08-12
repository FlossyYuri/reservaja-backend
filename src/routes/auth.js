const express = require("express");
const { authenticateToken } = require("../config/authValidation");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/", authController.Login);
router.get("/me", authenticateToken, authController.ME);
router.post("/email", authController.Email2);
router.post("/recuperar", authController.Email);
router.post("/novasenha", authController.NovaSenha);
router.patch("/", authController.Refresh);

module.exports = router;
