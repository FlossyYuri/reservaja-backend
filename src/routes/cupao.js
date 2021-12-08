const express = require("express");
const router = express.Router();
const CupaoController = require("../controllers/cupao");
const { authenticateToken, isAdmin } = require("../config/authValidation");

router.post("/",authenticateToken,CupaoController.Insert);
router.get("/",authenticateToken,CupaoController.SearchAll);
router.put("/validar/:codigo", CupaoController.validate);
router.put("/:id",authenticateToken, CupaoController.update);


module.exports = router;
