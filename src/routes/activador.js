const express = require("express");
    const router = express.Router();
    const ActivadorController = require("../controllers/activador");

    router.post("/",ActivadorController.Insert);

    router.get("/", ActivadorController.SearchAll);
    //router.get("/:id", ActivadorController.SearchOne);
    


    module.exports = router;
