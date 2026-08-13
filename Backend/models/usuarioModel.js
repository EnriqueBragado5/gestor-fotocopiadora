const db = require('../config/db');

async function buscarPorEmail(email) {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE email = ?', [email]);
  return rows[0]; 
}

async function crear({ nombre, apellido, email, contrasena, telefono }) {
  const [resultado] = await db.query(
    `INSERT INTO Usuarios (nombre, apellido, email, contrasena, rol, telefono)
     VALUES (?, ?, ?, ?, 'cliente', ?)`,
    [nombre, apellido, email, contrasena, telefono]
  );
  return resultado.insertId;
}

module.exports = { buscarPorEmail, crear };