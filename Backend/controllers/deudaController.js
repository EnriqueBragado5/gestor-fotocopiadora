const deudaModel = require('../models/deudaModel');
const pedidoModel = require('../models/pedidoModel');

async function marcarNoRetirado(req, res) {
  try {
    const { id } = req.params; 

    const pedido = await pedidoModel.buscarPorId(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedido.estado !== 'listo') {
      return res.status(400).json({ mensaje: 'Solo se puede marcar como no retirado un pedido en estado "listo"' });
    }

    await pedidoModel.actualizarEstado(id, 'no_retirado');
    const id_deuda = await deudaModel.crear({
      id_usuario: pedido.id_usuario,
      id_pedido: pedido.id_pedido,
      monto: pedido.precio
    });

    res.status(201).json({ mensaje: 'Pedido marcado como no retirado y deuda generada', id_deuda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al procesar la deuda', error: error.message });
  }
}

async function todas(req, res) {
  try {
    const deudas = await deudaModel.buscarTodas();
    res.json(deudas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las deudas', error: error.message });
  }
}

async function misDeudas(req, res) {
  try {
    const deudas = await deudaModel.buscarPorUsuario(req.usuario.id);
    res.json(deudas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las deudas', error: error.message });
  }
}

async function marcarPagada(req, res) {
  try {
    const { id } = req.params; 
    await deudaModel.marcarComoPagada(id);
    res.json({ mensaje: 'Deuda marcada como pagada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al marcar la deuda como pagada', error: error.message });
  }
}

module.exports = { marcarNoRetirado, todas, misDeudas, marcarPagada };