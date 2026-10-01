const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.post('/crear-admin', verificarToken, esAdmin, usuarioController.crearAdmin);

module.exports = router;