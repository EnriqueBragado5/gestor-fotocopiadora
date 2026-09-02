import api from './api';

export async function login(email, contrasena) {
  const respuesta = await api.post('/usuarios/login', { email, contrasena });
  return respuesta.data;
}

export async function registrar(datosUsuario) {
  const respuesta = await api.post('/usuarios/registro', datosUsuario);
  return respuesta.data;
}