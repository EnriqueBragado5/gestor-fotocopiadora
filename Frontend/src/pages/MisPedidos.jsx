import { useState, useEffect } from 'react';
import { obtenerMisPedidos } from '../services/pedidoService';
import { Link } from 'react-router-dom';

function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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
    cargarPedidos();
  }, []);

  if (cargando) return <p>Cargando pedidos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Mis Pedidos</h2>
      <Link to="/nuevo-pedido">+ Nuevo pedido</Link>
      {pedidos.length === 0 ? (
        <p>Todavía no realizaste ningún pedido.</p>
      ) : (
        <ul>
          {pedidos.map((pedido) => (
            <li key={pedido.id_pedido}>
              Pedido #{pedido.id_pedido} — {pedido.tipo_trabajo} — {pedido.cantidad_copias} copias — Estado: <strong>{pedido.estado}</strong>
              {pedido.precio && <span> — ${pedido.precio}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisPedidos;