const express = require("express");
const authController = require("../controllers/auth");
const { authenticateToken } = require("../utils");

const router = express.Router();

router.post("/", authController.Login);
router.get("/me", authenticateToken, authController.ME);
router.patch("/", authController.Refresh);

module.exports = router;
