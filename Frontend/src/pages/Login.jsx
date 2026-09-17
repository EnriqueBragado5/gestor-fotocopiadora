import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  async function manejarSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const datos = await login(email, contrasena);
      iniciarSesion(datos);
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-sm p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">Iniciar sesión</h2>
        <form onSubmit={manejarSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            Ingresar
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          ¿No tenés cuenta?{' '}
          <Link to="/registro" className="text-red-600 hover:underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;