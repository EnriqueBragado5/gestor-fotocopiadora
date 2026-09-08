import { useState, useEffect } from 'react';
import { obtenerMisPedidos, cancelarPedido } from '../services/pedidoService';
import { Link } from 'react-router-dom';

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  async function cargarPedidos() {
    try {
      const datos = await obtenerMisPedidos();
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

  async function manejarCancelar(id) {
    const confirmar = window.confirm('¿Seguro que querés cancelar este pedido?');
    if (!confirmar) return;

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
      <h2>Mis Pedidos</h2>
      <Link to="/nuevo-pedido">+ Nuevo pedido</Link>
      {' | '}
      <Link to="/mis-deudas">Ver mis deudas</Link>
      {pedidos.length === 0 ? (
        <p>Todavía no realizaste ningún pedido.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido} style={{ marginBottom: '0.75rem' }}>
              Pedido #{pedido.id_pedido} — {pedido.tipo_trabajo} — {pedido.cantidad_copias} copias — Estado: <strong>{pedido.estado}</strong>
              {pedido.precio && <span> — ${pedido.precio}</span>}

              {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado' || pedido.estado === 'listo') && (
                <button
                  onClick={() => manejarCancelar(pedido.id_pedido)}
                  style={{ marginLeft: '0.75rem', color: 'red' }}
                >
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

export default MisPedidos;