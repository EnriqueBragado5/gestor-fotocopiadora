const express = require('express');
const router = express.Router();
const configuracionController = require('../controllers/configuracionController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, configuracionController.obtener);
router.put('/', verificarToken, esAdmin, configuracionController.actualizar);

module.exports = router;