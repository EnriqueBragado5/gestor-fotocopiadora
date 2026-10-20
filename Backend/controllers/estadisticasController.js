const estadisticasModel = require('../models/estadisticasModel');

async function resumen(req, res) {
  try {
    const datos = await estadisticasModel.obtenerResumen();

    res.json({
      total_pedidos: Number(datos.total_pedidos),
      pedidos_pendientes: Number(datos.pedidos_pendientes),
      ingresos_cobrados: Number(datos.ingresos_entregados) + Number(datos.ingresos_deudas_pagadas),
      deuda_pendiente: Number(datos.deuda_pendiente),
      clientes_registrados: Number(datos.clientes_registrados)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las estadísticas', error: error.message });
  }
}

module.exports = { resumen };