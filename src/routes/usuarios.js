const express =require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarios');

router.post('/', UsuarioController.Insert);
router.get('/', UsuarioController.SearchAll);
router.get('/:id', UsuarioController.SearchOne);
router.put('/:id', UsuarioController.Update);
router.delete('/:id', UsuarioController.Delete);

module.exports= router;