const db = require('../config/db');

function armarCondicion(columna, desde, hasta) {
  const condiciones = [];
  const params = [];
  if (desde) {
    condiciones.push(`${columna} >= ?`);
    params.push(desde);
  }
  if (hasta) {
    condiciones.push(`${columna} < DATE_ADD(?, INTERVAL 1 DAY)`);
    params.push(hasta);
  }
  return {
    sql: condiciones.length ? ' AND ' + condiciones.join(' AND ') : '',
    params
  };
}

async function obtenerResumen(desde, hasta) {
  const pedidos = armarCondicion('fecha_pedido', desde, hasta);
  const entregas = armarCondicion('fecha_actualizacion_estado', desde, hasta);
  const deudas = armarCondicion('fecha', desde, hasta);
  const pagos = armarCondicion('COALESCE(fecha_pago, fecha)', desde, hasta);

  const [rows] = await db.query(
    `SELECT
      (SELECT COUNT(*) FROM Pedidos WHERE 1=1${pedidos.sql}) AS total_pedidos,
      (SELECT COUNT(*) FROM Pedidos WHERE estado = 'pendiente'${pedidos.sql}) AS pedidos_pendientes,
      (SELECT COALESCE(SUM(precio), 0) FROM Pedidos WHERE estado = 'entregado'${entregas.sql}) AS ingresos_entregados,
      (SELECT COALESCE(SUM(monto), 0) FROM Deudas WHERE estado = 'pagada'${pagos.sql}) AS ingresos_deudas_pagadas,
      (SELECT COALESCE(SUM(monto), 0) FROM Deudas WHERE estado = 'pendiente'${deudas.sql}) AS deuda_pendiente`,
    [
      ...pedidos.params,
      ...pedidos.params,
      ...entregas.params,
      ...pagos.params,
      ...deudas.params
    ]
  );
  return rows[0];
}

module.exports = { obtenerResumen };