const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

async function registrar(req, res) {
  try {
    const { nombre, apellido, email, contrasena, telefono } = req.body;

    if (!nombre || !apellido || !email || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const usuarioExistente = await usuarioModel.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ mensaje: 'Ya existe un usuario registrado con ese email' });
    }

    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    const idUsuario = await usuarioModel.crear({
      nombre,
      apellido,
      email,
      contrasena: contrasenaHasheada,
      telefono
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: idUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
    }

    const usuario = await usuarioModel.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
}

module.exports = { registrar, login };