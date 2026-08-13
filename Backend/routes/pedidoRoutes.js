const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

router.post('/', verificarToken, upload.array('archivos', 5), pedidoController.crear);

router.get('/mis-pedidos', verificarToken, pedidoController.misPedidos);

router.get('/', verificarToken, esAdmin, pedidoController.todos);

router.put('/:id/confirmar', verificarToken, esAdmin, pedidoController.confirmar);

router.put('/:id/estado', verificarToken, esAdmin, pedidoController.actualizarEstado);

router.put('/:id/cancelar', verificarToken, pedidoController.cancelar);

module.exports = router;