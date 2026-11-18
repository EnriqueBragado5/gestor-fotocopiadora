const estadisticasModel = require('../models/estadisticasModel');

const formatoFecha = /^\d{4}-\d{2}-\d{2}$/;

async function resumen(req, res) {
  try {
    const desde = req.query.desde || '';
    const hasta = req.query.hasta || '';

    if ((desde && !formatoFecha.test(desde)) || (hasta && !formatoFecha.test(hasta))) {
      return res.status(400).json({ mensaje: 'Las fechas deben tener el formato AAAA-MM-DD' });
    }
    if (desde && hasta && desde > hasta) {
      return res.status(400).json({ mensaje: 'La fecha "desde" no puede ser posterior a "hasta"' });
    }

    const datos = await estadisticasModel.obtenerResumen(desde, hasta);

    res.json({
      total_pedidos: Number(datos.total_pedidos),
      pedidos_pendientes: Number(datos.pedidos_pendientes),
      ingresos_cobrados: Number(datos.ingresos_entregados) + Number(datos.ingresos_deudas_pagadas),
      deuda_pendiente: Number(datos.deuda_pendiente)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener las estadísticas', error: error.message });
  }
}

module.exports = { resumen };