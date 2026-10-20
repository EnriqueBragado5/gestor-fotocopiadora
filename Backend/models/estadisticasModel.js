const db = require('../config/db');

async function obtenerResumen() {
  const [rows] = await db.query(`
    SELECT
      (SELECT COUNT(*) FROM Pedidos) AS total_pedidos,
      (SELECT COUNT(*) FROM Pedidos WHERE estado = 'pendiente') AS pedidos_pendientes,
      (SELECT COALESCE(SUM(precio), 0) FROM Pedidos WHERE estado = 'entregado') AS ingresos_entregados,
      (SELECT COALESCE(SUM(monto), 0) FROM Deudas WHERE estado = 'pagada') AS ingresos_deudas_pagadas,
      (SELECT COALESCE(SUM(monto), 0) FROM Deudas WHERE estado = 'pendiente') AS deuda_pendiente,
      (SELECT COUNT(*) FROM Usuarios WHERE rol = 'cliente') AS clientes_registrados
  `);
  return rows[0];
}

module.exports = { obtenerResumen };