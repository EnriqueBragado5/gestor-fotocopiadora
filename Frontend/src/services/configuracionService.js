import api from './api';

export async function obtenerLimite() {
  const respuesta = await api.get('/configuracion');
  return respuesta.data;
}

export async function actualizarLimite(limite_deuda) {
  const respuesta = await api.put('/configuracion', { limite_deuda });
  return respuesta.data;
}