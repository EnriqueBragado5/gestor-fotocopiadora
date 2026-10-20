import api from './api';

export async function obtenerResumen() {
  const respuesta = await api.get('/estadisticas');
  return respuesta.data;
}