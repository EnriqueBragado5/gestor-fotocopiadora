const db = require('../config/db');

async function crear({ id_pedido, nombre_archivo, ruta_archivo }) {
  const [resultado] = await db.query(
    'INSERT INTO Archivos_Pedido (id_pedido, nombre_archivo, ruta_archivo) VALUES (?, ?, ?)',
    [id_pedido, nombre_archivo, ruta_archivo]
  );
  return resultado.insertId;
}

module.exports = { crear };