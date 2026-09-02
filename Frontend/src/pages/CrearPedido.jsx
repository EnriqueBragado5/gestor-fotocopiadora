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

  return (
    <div>
      <h2>Nuevo Pedido</h2>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Tipo de trabajo</label>
          <select name="tipo_trabajo" value={formulario.tipo_trabajo} onChange={manejarCambio}>
            <option value="impresion">Impresión</option>
            <option value="fotocopiado">Fotocopiado</option>
            <option value="encuadernado">Encuadernado</option>
          </select>
        </div>

        <div>
          <label>Tamaño de hoja</label>
          <select name="tamano_hoja" value={formulario.tamano_hoja} onChange={manejarCambio}>
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="oficio">Oficio</option>
            <option value="carta">Carta</option>
          </select>
        </div>

        <div>
          <label>Color</label>
          <select name="color" value={formulario.color} onChange={manejarCambio}>
            <option value="blanco_y_negro">Blanco y negro</option>
            <option value="color">Color</option>
          </select>
        </div>

        <div>
          <label>Faz</label>
          <select name="faz" value={formulario.faz} onChange={manejarCambio}>
            <option value="simple">Simple</option>
            <option value="doble">Doble</option>
          </select>
        </div>

        <div>
          <label>Cantidad de copias</label>
          <input
            type="number"
            name="cantidad_copias"
            min="1"
            value={formulario.cantidad_copias}
            onChange={manejarCambio}
            required
          />
        </div>

        <div>
          <label>Descripción (opcional)</label>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            placeholder="Ej: imprimir solo de la página 5 a la 12"
          />
        </div>

        <div>
          <label>Archivos PDF (máximo 5, hasta 25 MB cada uno)</label>
          <input type="file" accept="application/pdf" multiple onChange={manejarArchivos} required />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Crear pedido'}
        </button>
      </form>
    </div>
  );
}

export default CrearPedido;