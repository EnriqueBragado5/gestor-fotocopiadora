const db = require('../config/db');

async function crear({ id_pedido, nombre_archivo, ruta_archivo }) {
  const [resultado] = await db.query(
    'INSERT INTO Archivos_Pedido (id_pedido, nombre_archivo, ruta_archivo) VALUES (?, ?, ?)',
    [id_pedido, nombre_archivo, ruta_archivo]
  );
  return resultado.insertId;
}

async function buscarPorPedido(id_pedido) {
  const [rows] = await db.query(
    'SELECT * FROM Archivos_Pedido WHERE id_pedido = ?',
    [id_pedido]
  );
  return rows;
}

module.exports = { crear, buscarPorPedido };