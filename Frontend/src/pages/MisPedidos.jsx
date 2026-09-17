import { useState, useEffect } from 'react';
import { obtenerMisPedidos, cancelarPedido } from '../services/pedidoService';
import { Link } from 'react-router-dom';
import { formatearEstado, formatearTipoTrabajo, urlArchivo } from '../utils/formato';

const coloresEstado = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-700',
  cancelado: 'bg-red-100 text-red-700',
  no_retirado: 'bg-red-100 text-red-700'
};

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

  if (cargando) return <p className="text-center text-gray-500 mt-8">Cargando pedidos...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Mis Pedidos</h2>
        <div className="flex gap-3 text-sm">
          <Link to="/nuevo-pedido" className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
            + Nuevo pedido
          </Link>
          <Link to="/mis-deudas" className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors">
            Ver mis deudas
          </Link>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-gray-500">Todavía no realizaste ningún pedido.</p>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => (
            <div key={pedido.id_pedido} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-800">Pedido #{pedido.id_pedido}</span>
                  <span className="text-gray-500 ml-2">
                    {formatearTipoTrabajo(pedido.tipo_trabajo)} — {pedido.cantidad_copias} copias
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${coloresEstado[pedido.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {formatearEstado(pedido.estado)}
                </span>
              </div>

              {pedido.precio && (
                <p className="text-sm text-gray-600 mt-1">Precio: ${pedido.precio}</p>
              )}

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

              {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado' || pedido.estado === 'listo') && (
                <button
                  onClick={() => manejarCancelar(pedido.id_pedido)}
                  className="mt-3 text-sm px-3 py-1 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisPedidos;