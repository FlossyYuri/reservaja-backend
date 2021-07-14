const express =require('express');
const router = express.Router();
const usuarios = require("./usuarios");
const empresas = require("./empresas");
const auth = require("./auth");

router.use('/usuarios', usuarios);
router.use('/empresas', empresas);
router.use('/auth', auth);
router.use('/*', (_,res)=>res.send("OK!"));


module.exports= router;