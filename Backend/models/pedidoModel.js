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

async function buscarTodosPaginado(limite, offset, filtros = {}) {
  const { where, valores } = armarFiltros(filtros);
  const [rows] = await db.query(
    `SELECT p.*, u.nombre, u.apellido, u.email
     FROM Pedidos p
     JOIN Usuarios u ON p.id_usuario = u.id_usuario
     ${where}
     ORDER BY p.fecha_pedido DESC, p.id_pedido DESC
     LIMIT ? OFFSET ?`,
    [...valores, limite, offset]
  );
  return rows;
}

async function contarTodos(filtros = {}) {
  const { where, valores } = armarFiltros(filtros);
  const [rows] = await db.query(
    `SELECT COUNT(*) AS total
     FROM Pedidos p
     JOIN Usuarios u ON p.id_usuario = u.id_usuario
     ${where}`,
    valores
  );
  return rows[0].total;
}

async function buscarPorUsuarioPaginado(id_usuario, limite, offset) {
  const [rows] = await db.query(
    `SELECT * FROM Pedidos
     WHERE id_usuario = ?
     ORDER BY fecha_pedido DESC, id_pedido DESC
     LIMIT ? OFFSET ?`,
    [id_usuario, limite, offset]
  );
  return rows;
}

async function contarPorUsuario(id_usuario) {
  const [rows] = await db.query(
    'SELECT COUNT(*) AS total FROM Pedidos WHERE id_usuario = ?',
    [id_usuario]
  );
  return rows[0].total;
}

function armarFiltros({ busqueda, estado }) {
  const condiciones = [];
  const valores = [];

  if (busqueda) {
    const patron = `%${busqueda}%`;
    condiciones.push('(u.nombre LIKE ? OR u.apellido LIKE ? OR u.email LIKE ? OR p.id_pedido = ?)');
    valores.push(patron, patron, patron, Number(busqueda) || 0);
  }

  if (estado) {
    condiciones.push('p.estado = ?');
    valores.push(estado);
  }

  const where = condiciones.length ? 'WHERE ' + condiciones.join(' AND ') : '';
  return { where, valores };
}

module.exports = { crear, buscarPorUsuario, buscarTodos, buscarPorId, confirmar, actualizarEstado, buscarTodosPaginado, contarTodos, buscarPorUsuarioPaginado, contarPorUsuario, armarFiltros };