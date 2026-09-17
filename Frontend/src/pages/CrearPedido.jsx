import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPedido } from '../services/pedidoService';

function CrearPedido() {
  const [formulario, setFormulario] = useState({
    tipo_trabajo: 'impresion',
    tamano_hoja: 'A4',
    color: 'blanco_y_negro',
    faz: 'simple',
    cantidad_copias: 1,
    descripcion: ''
  });
  const [archivos, setArchivos] = useState([]);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  function manejarArchivos(e) {
    setArchivos(e.target.files);
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');

    if (archivos.length === 0) {
      setError('Debés adjuntar al menos un archivo PDF');
      return;
    }

    const datosFormulario = new FormData();
    Object.keys(formulario).forEach((clave) => {
      datosFormulario.append(clave, formulario[clave]);
    });
    for (let i = 0; i < archivos.length; i++) {
      datosFormulario.append('archivos', archivos[i]);
    }

    setEnviando(true);
    try {
      await crearPedido(datosFormulario);
      navigate('/');
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al crear el pedido';
      setError(mensaje);
    } finally {
      setEnviando(false);
    }
  }

  const estiloInput =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500';
  const estiloLabel = 'block text-sm text-gray-600 mb-1';

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Nuevo Pedido</h2>
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className={estiloLabel}>Tipo de trabajo</label>
            <select name="tipo_trabajo" value={formulario.tipo_trabajo} onChange={manejarCambio} className={estiloInput}>
              <option value="impresion">Impresión</option>
              <option value="fotocopiado">Fotocopiado</option>
              <option value="encuadernado">Encuadernado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={estiloLabel}>Tamaño de hoja</label>
              <select name="tamano_hoja" value={formulario.tamano_hoja} onChange={manejarCambio} className={estiloInput}>
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="oficio">Oficio</option>
                <option value="carta">Carta</option>
              </select>
            </div>
            <div>
              <label className={estiloLabel}>Color</label>
              <select name="color" value={formulario.color} onChange={manejarCambio} className={estiloInput}>
                <option value="blanco_y_negro">Blanco y negro</option>
                <option value="color">Color</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={estiloLabel}>Faz</label>
              <select name="faz" value={formulario.faz} onChange={manejarCambio} className={estiloInput}>
                <option value="simple">Simple</option>
                <option value="doble">Doble</option>
              </select>
            </div>
            <div>
              <label className={estiloLabel}>Cantidad de copias</label>
              <input
                type="number"
                name="cantidad_copias"
                min="1"
                value={formulario.cantidad_copias}
                onChange={manejarCambio}
                required
                className={estiloInput}
              />
            </div>
          </div>

          <div>
            <label className={estiloLabel}>Descripción (opcional)</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Ej: imprimir solo de la página 5 a la 12"
              rows="3"
              className={estiloInput}
            />
          </div>

          <div>
            <label className={estiloLabel}>Archivos PDF (máximo 5, hasta 25 MB cada uno)</label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              onChange={manejarArchivos}
              required
              className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 file:cursor-pointer"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? 'Enviando...' : 'Crear pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CrearPedido;