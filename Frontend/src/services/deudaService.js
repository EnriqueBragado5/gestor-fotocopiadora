import api from './api';

export async function obtenerTodasLasDeudas() {
  const respuesta = await api.get('/deudas');
  return respuesta.data;
}

export async function obtenerMisDeudas() {
  const respuesta = await api.get('/deudas/mis-deudas');
  return respuesta.data;
}

export async function marcarDeudaPagada(id) {
  const respuesta = await api.put(`/deudas/${id}/pagada`);
  return respuesta.data;
}