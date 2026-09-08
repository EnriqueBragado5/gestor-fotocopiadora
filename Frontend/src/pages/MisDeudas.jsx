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

  if (cargando) return <p>Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const deudasPendientes = deudas.filter((d) => d.estado === 'pendiente');

  return (
    <div>
      <h2>Mis Deudas</h2>
      {deudasPendientes.length === 0 ? (
        <p>No tenés deudas pendientes.</p>
      ) : (
        <ul>
          {deudasPendientes.map((deuda) => (
            <li key={deuda.id_deuda}>
              Pedido #{deuda.id_pedido} — ${deuda.monto} — Pendiente de pago
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisDeudas;