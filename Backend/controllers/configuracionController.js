const configuracionModel = require('../models/configuracionModel');

async function obtener(req, res) {
  try {
    const limite_deuda = await configuracionModel.obtenerLimiteDeuda();
    res.json({ limite_deuda });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener la configuración', error: error.message });
  }
}

async function actualizar(req, res) {
  try {
    const { limite_deuda } = req.body;

    if (limite_deuda === undefined || limite_deuda < 0) {
      return res.status(400).json({ mensaje: 'El límite de deuda debe ser un número válido mayor o igual a 0' });
    }

    await configuracionModel.actualizarLimiteDeuda(limite_deuda);
    res.json({ mensaje: 'Límite de deuda actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar la configuración', error: error.message });
  }
}

module.exports = { obtener, actualizar };