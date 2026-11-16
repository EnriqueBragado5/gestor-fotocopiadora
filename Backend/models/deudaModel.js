const db = require('../config/db');

async function crear({ id_usuario, id_pedido, monto }) {
  const [resultado] = await db.query(
    'INSERT INTO Deudas (id_usuario, id_pedido, monto) VALUES (?, ?, ?)',
    [id_usuario, id_pedido, monto]
  );
  return resultado.insertId;
}

async function buscarTodasPaginado(limite, offset) {
  const [rows] = await db.query(
    `SELECT d.*, u.nombre, u.apellido, u.email
     FROM Deudas d
     JOIN Usuarios u ON d.id_usuario = u.id_usuario
     ORDER BY d.fecha DESC, d.id_deuda DESC
     LIMIT ? OFFSET ?`,
    [limite, offset]
  );
  return rows;
}

async function contarTodas() {
  const [rows] = await db.query('SELECT COUNT(*) AS total FROM Deudas');
  return rows[0].total;
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

async function sumarDeudaPendiente(id_usuario) {
  const [rows] = await db.query(
    `SELECT COALESCE(SUM(monto), 0) AS total FROM Deudas WHERE id_usuario = ? AND estado = 'pendiente'`,
    [id_usuario]
  );
  return rows[0].total;
}

module.exports = { crear, buscarTodasPaginado, contarTodas, buscarPorUsuario, marcarComoPagada, sumarDeudaPendiente };