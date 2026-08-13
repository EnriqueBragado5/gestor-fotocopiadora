const db = require('../config/db');

async function crear({ id_usuario, tipo_trabajo, tamano_hoja, color, faz, cantidad_copias, descripcion }) {
  const [resultado] = await db.query(
    `INSERT INTO Pedidos (id_usuario, tipo_trabajo, tamano_hoja, color, faz, cantidad_copias, descripcion)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id_usuario, tipo_trabajo, tamano_hoja, color, faz, cantidad_copias, descripcion]
  );
  return resultado.insertId;
}


async function buscarPorUsuario(id_usuario) {
  const [rows] = await db.query(
    'SELECT * FROM Pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC',
    [id_usuario]
  );
  return rows;
}

async function buscarTodos() {
  const [rows] = await db.query(
    `SELECT p.*, u.nombre, u.apellido, u.email
     FROM Pedidos p
     JOIN Usuarios u ON p.id_usuario = u.id_usuario
     ORDER BY p.fecha_pedido DESC`
  );
  return rows;
}

async function buscarPorId(id_pedido) {
  const [rows] = await db.query('SELECT * FROM Pedidos WHERE id_pedido = ?', [id_pedido]);
  return rows[0];
}

async function confirmar(id_pedido, precio) {
  await db.query(
    `UPDATE Pedidos SET estado = 'confirmado', precio = ? WHERE id_pedido = ?`,
    [precio, id_pedido]
  );
}

async function actualizarEstado(id_pedido, estado) {
  await db.query('UPDATE Pedidos SET estado = ? WHERE id_pedido = ?', [estado, id_pedido]);
}

module.exports = { crear, buscarPorUsuario, buscarTodos, buscarPorId, confirmar, actualizarEstado };