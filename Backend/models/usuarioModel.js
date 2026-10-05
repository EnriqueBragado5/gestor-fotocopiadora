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

async function crearAdmin({ nombre, apellido, email, contrasena, telefono }) {
  const [resultado] = await db.query(
    `INSERT INTO Usuarios (nombre, apellido, email, contrasena, rol, telefono)
     VALUES (?, ?, ?, ?, 'admin', ?)`,
    [nombre, apellido, email, contrasena, telefono]
  );
  return resultado.insertId;
}

async function listarAdmins() {
  const [rows] = await db.query(
    `SELECT id_usuario, nombre, apellido, email, telefono, activo, fecha_registro
     FROM Usuarios WHERE rol = 'admin' ORDER BY fecha_registro DESC`
  );
  return rows;
}

async function buscarPorId(id_usuario) {
  const [rows] = await db.query('SELECT * FROM Usuarios WHERE id_usuario = ?', [id_usuario]);
  return rows[0];
}

async function actualizar(id_usuario, { nombre, apellido, telefono }) {
  await db.query(
    'UPDATE Usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id_usuario = ?',
    [nombre, apellido, telefono, id_usuario]
  );
}

async function cambiarEstadoActivo(id_usuario, activo) {
  await db.query('UPDATE Usuarios SET activo = ? WHERE id_usuario = ?', [activo, id_usuario]);
}

module.exports = { buscarPorEmail, crear, crearAdmin, listarAdmins, buscarPorId, actualizar, cambiarEstadoActivo };
