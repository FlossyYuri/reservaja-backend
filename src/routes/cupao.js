const express = require("express");
const router = express.Router();
const CupaoController = require("../controllers/cupao");
const { authenticateToken, isAdmin } = require("../config/authValidation");

router.post("/",CupaoController.Insert);
router.get("/",CupaoController.SearchAll);
router.put("/validar/:codigo", CupaoController.validate);
router.put("/:id", CupaoController.update);




module.exports = router;
