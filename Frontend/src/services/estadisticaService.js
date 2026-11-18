import api from './api';

export async function obtenerResumen(desde, hasta) {
  const respuesta = await api.get('/estadisticas', {
    params: { desde: desde || undefined, hasta: hasta || undefined }
  });
  return respuesta.data;
}