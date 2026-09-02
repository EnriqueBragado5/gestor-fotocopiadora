import { useState, useEffect } from 'react';
import { obtenerTodosLosPedidos, confirmarPedido, actualizarEstadoPedido, cancelarPedido } from '../services/pedidoService';

function PanelAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [precios, setPrecios] = useState({});

  async function cargarPedidos() {
    try {
      const datos = await obtenerTodosLosPedidos();
      setPedidos(datos);
    } catch (err) {
      setError('No se pudieron cargar los pedidos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  async function manejarConfirmar(id) {
    const precio = precios[id];
    if (!precio) {
      alert('Ingresá un precio antes de confirmar');
      return;
    }
    try {
      await confirmarPedido(id, precio);
      cargarPedidos();
    } catch (err) {
      alert('Error al confirmar el pedido');
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      cargarPedidos();
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  }

  async function manejarCancelar(id) {
    try {
      await cancelarPedido(id);
      cargarPedidos();
    } catch (err) {
      alert('Error al cancelar el pedido');
    }
  }

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Panel de Administrador — Todos los pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos todavía.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido} style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>
              <div>
                Pedido #{pedido.id_pedido} — Cliente: {pedido.nombre} {pedido.apellido} ({pedido.email})
              </div>
              <div>
                {pedido.tipo_trabajo} — {pedido.cantidad_copias} copias — Estado: <strong>{pedido.estado}</strong>
                {pedido.precio && <span> — ${pedido.precio}</span>}
              </div>

              {pedido.estado === 'pendiente' && (
                <div>
                  <input
                    type="number"
                    placeholder="Precio"
                    onChange={(e) => setPrecios({ ...precios, [pedido.id_pedido]: e.target.value })}
                  />
                  <button onClick={() => manejarConfirmar(pedido.id_pedido)}>Confirmar</button>
                </div>
              )}

              {pedido.estado === 'confirmado' && (
                <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'listo')}>Marcar como listo</button>
              )}

              {pedido.estado === 'listo' && (
                <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'entregado')}>Marcar como entregado</button>
              )}

              {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado') && (
                <button onClick={() => manejarCancelar(pedido.id_pedido)} style={{ marginLeft: '0.5rem', color: 'red' }}>
                  Cancelar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PanelAdmin;