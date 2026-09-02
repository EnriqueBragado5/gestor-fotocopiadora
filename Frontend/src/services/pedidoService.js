import api from './api';

export async function obtenerMisPedidos() {
  const respuesta = await api.get('/pedidos/mis-pedidos');
  return respuesta.data;
}

export async function obtenerTodosLosPedidos() {
  const respuesta = await api.get('/pedidos');
  return respuesta.data;
}

export async function crearPedido(formData) {
  const respuesta = await api.post('/pedidos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return respuesta.data;
}

export async function confirmarPedido(id, precio) {
  const respuesta = await api.put(`/pedidos/${id}/confirmar`, { precio });
  return respuesta.data;
}

export async function actualizarEstadoPedido(id, estado) {
  const respuesta = await api.put(`/pedidos/${id}/estado`, { estado });
  return respuesta.data;
}

export async function cancelarPedido(id) {
  const respuesta = await api.put(`/pedidos/${id}/cancelar`);
  return respuesta.data;
}