const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.post('/crear-admin', verificarToken, esAdmin, usuarioController.crearAdmin);
router.get('/admins', verificarToken, esAdmin, usuarioController.listarAdmins);
router.put('/admins/:id', verificarToken, esAdmin, usuarioController.actualizarAdmin);
router.put('/admins/:id/estado', verificarToken, esAdmin, usuarioController.cambiarEstadoAdmin);

module.exports = router;