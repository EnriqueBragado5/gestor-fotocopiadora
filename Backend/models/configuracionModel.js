const db = require('../config/db');

async function obtenerLimiteDeuda() {
  const [rows] = await db.query('SELECT limite_deuda FROM Configuracion WHERE id_configuracion = 1');
  return rows[0].limite_deuda;
}

async function actualizarLimiteDeuda(nuevoLimite) {
  await db.query('UPDATE Configuracion SET limite_deuda = ? WHERE id_configuracion = 1', [nuevoLimite]);
}

module.exports = { obtenerLimiteDeuda, actualizarLimiteDeuda };