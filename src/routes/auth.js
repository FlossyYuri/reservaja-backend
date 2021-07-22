const express = require("express");
const { authenticateToken } = require("../config/authValidation");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/", authController.Login);
router.get("/me", authenticateToken, authController.ME);
router.patch("/", authController.Refresh);

module.exports = router;
