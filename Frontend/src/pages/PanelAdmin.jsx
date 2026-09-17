import { useState, useEffect } from 'react';
import { obtenerTodosLosPedidos, confirmarPedido, actualizarEstadoPedido, cancelarPedido, marcarNoRetirado } from '../services/pedidoService';
import { obtenerTodasLasDeudas, marcarDeudaPagada } from '../services/deudaService';
import { formatearEstado, formatearTipoTrabajo, formatearEstadoDeuda, urlArchivo } from '../utils/formato';

const coloresEstado = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-700',
  cancelado: 'bg-red-100 text-red-700',
  no_retirado: 'bg-red-100 text-red-700'
};

const coloresDeuda = {
  pendiente: 'bg-red-100 text-red-700',
  pagada: 'bg-green-100 text-green-800'
};

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

  if (cargando) return <p className="text-center text-gray-500 mt-8">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  const botonAccion = 'text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors';
  const botonPrimario = 'text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Panel de Administrador</h2>

      <h3 className="text-lg font-medium text-gray-700 mb-3">Pedidos</h3>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos todavía.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {pedidos.map((pedido) => (
            <div key={pedido.id_pedido} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-800">Pedido #{pedido.id_pedido}</span>
                  <span className="text-gray-500 ml-2 text-sm">
                    {pedido.nombre} {pedido.apellido} ({pedido.email})
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${coloresEstado[pedido.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {formatearEstado(pedido.estado)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {formatearTipoTrabajo(pedido.tipo_trabajo)} — {pedido.cantidad_copias} copias
                {pedido.precio && ` — $${pedido.precio}`}
              </p>

              {pedido.archivos && pedido.archivos.length > 0 && (
                <div className="text-sm mt-2">
                  {pedido.archivos.map((archivo) => (
                    <a
                      key={archivo.id_archivo}
                      href={urlArchivo(archivo.ruta_archivo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline mr-3"
                    >
                      📄 {archivo.nombre_archivo}
                    </a>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {pedido.estado === 'pendiente' && (
                  <>
                    <input
                      type="number"
                      placeholder="Precio"
                      onChange={(e) => setPrecios({ ...precios, [pedido.id_pedido]: e.target.value })}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button onClick={() => manejarConfirmar(pedido.id_pedido)} className={botonPrimario}>
                      Confirmar
                    </button>
                  </>
                )}

                {pedido.estado === 'confirmado' && (
                  <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'listo')} className={botonAccion}>
                    Marcar como listo
                  </button>
                )}

                {pedido.estado === 'listo' && (
                  <>
                    <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'entregado')} className={botonAccion}>
                      Marcar como entregado
                    </button>
                    <button onClick={() => manejarNoRetirado(pedido.id_pedido)} className={botonAccion}>
                      Marcar como no retirado
                    </button>
                  </>
                )}

                {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado') && (
                  <button
                    onClick={() => manejarCancelar(pedido.id_pedido)}
                    className="text-sm px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className="text-lg font-medium text-gray-700 mb-3">Deudas</h3>
      {deudas.length === 0 ? (
        <p className="text-gray-500">No hay deudas registradas.</p>
      ) : (
        <div className="space-y-2">
          {deudas.map((deuda) => (
            <div key={deuda.id_deuda} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {deuda.nombre} {deuda.apellido} ({deuda.email}) — Pedido #{deuda.id_pedido} — <span className="font-medium">${deuda.monto}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${coloresDeuda[deuda.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {formatearEstadoDeuda(deuda.estado)}
                </span>
                {deuda.estado === 'pendiente' && (
                  <button onClick={() => manejarMarcarPagada(deuda.id_deuda)} className={botonAccion}>
                    Marcar como pagada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PanelAdmin;