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

    if (!usuario.activo) {
    return res.status(403).json({ mensaje: 'Esta cuenta se encuentra desactivada' });
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

async function crearAdmin(req, res) {
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

    const idUsuario = await usuarioModel.crearAdmin({
      nombre,
      apellido,
      email,
      contrasena: contrasenaHasheada,
      telefono
    });

    res.status(201).json({ mensaje: 'Administrador creado correctamente', id: idUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el administrador', error: error.message });
  }
}

async function listarAdmins(req, res) {
  try {
    const admins = await usuarioModel.listarAdmins();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los administradores', error: error.message });
  }
}

async function actualizarAdmin(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono } = req.body;

    const usuario = await usuarioModel.buscarPorId(id);
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }

    await usuarioModel.actualizar(id, { nombre, apellido, telefono });
    res.json({ mensaje: 'Administrador actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el administrador', error: error.message });
  }
}

async function cambiarEstadoAdmin(req, res) {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const usuario = await usuarioModel.buscarPorId(id);
    if (!usuario || usuario.rol !== 'admin') {
      return res.status(404).json({ mensaje: 'Administrador no encontrado' });
    }

    if (Number(id) === req.usuario.id) {
      return res.status(400).json({ mensaje: 'No podés desactivar tu propia cuenta' });
    }

    await usuarioModel.cambiarEstadoActivo(id, activo);
    res.json({ mensaje: activo ? 'Administrador reactivado' : 'Administrador desactivado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar el estado del administrador', error: error.message });
  }
}

module.exports = { registrar, login, crearAdmin, listarAdmins, actualizarAdmin, cambiarEstadoAdmin };