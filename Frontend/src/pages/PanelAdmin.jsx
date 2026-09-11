import { useState, useEffect } from 'react';
import { obtenerTodosLosPedidos, confirmarPedido, actualizarEstadoPedido, cancelarPedido, marcarNoRetirado } from '../services/pedidoService';
import { obtenerTodasLasDeudas, marcarDeudaPagada } from '../services/deudaService';
import { formatearEstado, formatearTipoTrabajo, formatearEstadoDeuda, urlArchivo } from '../utils/formato';

function PanelAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [precios, setPrecios] = useState({});

  async function cargarDatos() {
    try {
      const [datosPedidos, datosDeudas] = await Promise.all([
        obtenerTodosLosPedidos(),
        obtenerTodasLasDeudas()
      ]);
      setPedidos(datosPedidos);
      setDeudas(datosDeudas);
    } catch (err) {
      setError('No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  async function manejarConfirmar(id) {
    const precio = precios[id];
    if (!precio) {
      alert('Ingresá un precio antes de confirmar');
      return;
    }
    try {
      await confirmarPedido(id, precio);
      cargarDatos();
    } catch (err) {
      alert('Error al confirmar el pedido');
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      cargarDatos();
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  }

  async function manejarCancelar(id) {
    try {
      await cancelarPedido(id);
      cargarDatos();
    } catch (err) {
      alert('Error al cancelar el pedido');
    }
  }

  async function manejarNoRetirado(id) {
    const confirmar = window.confirm('¿Confirmás que este pedido no fue retirado? Se generará una deuda al cliente.');
    if (!confirmar) return;
    try {
      await marcarNoRetirado(id);
      cargarDatos();
    } catch (err) {
      alert('Error al marcar el pedido como no retirado');
    }
  }

  async function manejarMarcarPagada(id) {
    try {
      await marcarDeudaPagada(id);
      cargarDatos();
    } catch (err) {
      alert('Error al marcar la deuda como pagada');
    }
  }

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Panel de Administrador</h2>

      <h3>Pedidos</h3>
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
                {formatearTipoTrabajo(pedido.tipo_trabajo)} — {pedido.cantidad_copias} copias — Estado: <strong>{formatearEstado(pedido.estado)}</strong>
                {pedido.precio && <span> — ${pedido.precio}</span>}
              </div>
            
            {pedido.archivos && pedido.archivos.length > 0 && (
                <div>
                  Archivos:{' '}
                  {pedido.archivos.map((archivo) => (
                    <a
                      key={archivo.id_archivo}
                      href={urlArchivo(archivo.ruta_archivo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginRight: '0.5rem' }}
                    >
                      {archivo.nombre_archivo}
                    </a>
                  ))}
                </div>
              )}


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
                <>
                  <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'entregado')}>Marcar como entregado</button>
                  <button onClick={() => manejarNoRetirado(pedido.id_pedido)} style={{ marginLeft: '0.5rem' }}>
                    Marcar como no retirado
                  </button>
                </>
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

      <h3>Deudas</h3>
      {deudas.length === 0 ? (
        <p>No hay deudas registradas.</p>
      ) : (
        <ul>
          {deudas.map((deuda) => (
            <li key={deuda.id_deuda} style={{ marginBottom: '0.5rem' }}>
              {deuda.nombre} {deuda.apellido} ({deuda.email}) — Pedido #{deuda.id_pedido} — ${deuda.monto} — Estado: <strong>{formatearEstadoDeuda(deuda.estado)}</strong>
              {deuda.estado === 'pendiente' && (
                <button onClick={() => manejarMarcarPagada(deuda.id_deuda)} style={{ marginLeft: '0.5rem' }}>
                  Marcar como pagada
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