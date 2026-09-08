const db = require('../config/db');

async function crear({ id_usuario, id_pedido, monto }) {
  const [resultado] = await db.query(
    'INSERT INTO Deudas (id_usuario, id_pedido, monto) VALUES (?, ?, ?)',
    [id_usuario, id_pedido, monto]
  );
  return resultado.insertId;
}

async function buscarTodas() {
  const [rows] = await db.query(
    `SELECT d.*, u.nombre, u.apellido, u.email
     FROM Deudas d
     JOIN Usuarios u ON d.id_usuario = u.id_usuario
     ORDER BY d.fecha DESC`
  );
  return rows;
}

async function buscarPorUsuario(id_usuario) {
  const [rows] = await db.query(
    'SELECT * FROM Deudas WHERE id_usuario = ? ORDER BY fecha DESC',
    [id_usuario]
  );
  return rows;
}

async function marcarComoPagada(id_deuda) {
  await db.query(`UPDATE Deudas SET estado = 'pagada' WHERE id_deuda = ?`, [id_deuda]);
}

module.exports = { crear, buscarTodas, buscarPorUsuario, marcarComoPagada };