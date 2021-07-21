const express = require("express");
const router = express.Router();
const EmpresaController = require("../controllers/empresas");

router.post("/", EmpresaController.Insert);
router.get("/", EmpresaController.SearchAll);
router.get("/:id", EmpresaController.SearchOne);
router.put("/:id", EmpresaController.Update);
router.put("/trial/:id", EmpresaController.Add1MonthTrial);
router.put("/pagamento:id", EmpresaController.Add1MonthPayment);
router.delete("/:id", EmpresaController.Delete);

module.exports = router;