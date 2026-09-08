const express = require('express');
const router = express.Router();
const deudaController = require('../controllers/deudaController');
const { verificarToken, esAdmin } = require('../middlewares/authMiddleware');

router.put('/pedidos/:id/no-retirado', verificarToken, esAdmin, deudaController.marcarNoRetirado);
router.get('/', verificarToken, esAdmin, deudaController.todas);
router.get('/mis-deudas', verificarToken, deudaController.misDeudas);
router.put('/:id/pagada', verificarToken, esAdmin, deudaController.marcarPagada);

module.exports = router;