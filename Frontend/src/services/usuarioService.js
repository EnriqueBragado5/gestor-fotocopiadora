import api from './api';

export async function login(email, contrasena) {
  const respuesta = await api.post('/usuarios/login', { email, contrasena });
  return respuesta.data;
}

export async function registrar(datosUsuario) {
  const respuesta = await api.post('/usuarios/registro', datosUsuario);
  return respuesta.data;
}

export async function crearAdmin(datosAdmin) {
  const respuesta = await api.post('/usuarios/crear-admin', datosAdmin);
  return respuesta.data;
}

export async function obtenerAdmins() {
  const respuesta = await api.get('/usuarios/admins');
  return respuesta.data;
}

export async function actualizarAdmin(id, datos) {
  const respuesta = await api.put(`/usuarios/admins/${id}`, datos);
  return respuesta.data;
}

export async function cambiarEstadoAdmin(id, activo) {
  const respuesta = await api.put(`/usuarios/admins/${id}/estado`, { activo });
  return respuesta.data;
}