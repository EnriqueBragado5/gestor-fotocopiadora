const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig');

function manejarSubidaArchivos(req, res, next) {
  upload.array('archivos', 5)(req, res, (error) => {
    if (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ mensaje: 'Uno de los archivos supera el tamaño máximo permitido (25 MB)' });
      }
      return res.status(400).json({ mensaje: error.message || 'Error al subir los archivos' });
    }
    next();
  });
}

router.post('/', verificarToken, manejarSubidaArchivos, pedidoController.crear);

router.get('/mis-pedidos', verificarToken, pedidoController.misPedidos);

router.get('/', verificarToken, esAdmin, pedidoController.todos);

router.put('/:id/confirmar', verificarToken, esAdmin, pedidoController.confirmar);

router.put('/:id/estado', verificarToken, esAdmin, pedidoController.actualizarEstado);

router.put('/:id/cancelar', verificarToken, pedidoController.cancelar);

module.exports = router;