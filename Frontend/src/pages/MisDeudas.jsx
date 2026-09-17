import { useState, useEffect } from 'react';
import { obtenerMisDeudas } from '../services/deudaService';

function MisDeudas() {
  const [deudas, setDeudas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerMisDeudas();
        setDeudas(datos);
      } catch (err) {
        setError('No se pudieron cargar las deudas');
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  if (cargando) return <p className="text-center text-gray-500 mt-8">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  const deudasPendientes = deudas.filter((d) => d.estado === 'pendiente');

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Mis Deudas</h2>
      {deudasPendientes.length === 0 ? (
        <p className="text-gray-500">No tenés deudas pendientes.</p>
      ) : (
        <div className="space-y-2">
          {deudasPendientes.map((deuda) => (
            <div key={deuda.id_deuda} className="bg-white border border-red-200 rounded-lg p-4 shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-700">Pedido #{deuda.id_pedido}</span>
              <span className="text-red-600 font-semibold">${deuda.monto}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MisDeudas;