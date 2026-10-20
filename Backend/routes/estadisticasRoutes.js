const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticasController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, esAdmin, estadisticasController.resumen);

module.exports = router;