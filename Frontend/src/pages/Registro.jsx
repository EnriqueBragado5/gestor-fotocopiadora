import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registrar } from '../services/usuarioService';

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const navigate = useNavigate();

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await registrar(formulario);
      setExito(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const mensaje = err.response?.data?.mensaje || 'Error al registrarse';
      setError(mensaje);
    }
  }

  const estiloInput =
    'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500';

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Crear cuenta</h2>
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input name="nombre" value={formulario.nombre} onChange={manejarCambio} required className={estiloInput} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Apellido</label>
            <input name="apellido" value={formulario.apellido} onChange={manejarCambio} required className={estiloInput} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" name="email" value={formulario.email} onChange={manejarCambio} required className={estiloInput} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <input type="password" name="contrasena" value={formulario.contrasena} onChange={manejarCambio} required className={estiloInput} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
            <input name="telefono" value={formulario.telefono} onChange={manejarCambio} className={estiloInput} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {exito && <p className="text-sm text-green-600">¡Cuenta creada! Redirigiendo al login...</p>}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Registrarme
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registro;