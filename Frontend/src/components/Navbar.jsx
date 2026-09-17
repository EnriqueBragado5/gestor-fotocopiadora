import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();

  function manejarCerrarSesion() {
    cerrarSesion();
    navigate('/login');
  }

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      <Link to="/" className="text-lg font-semibold text-gray-800">
        Gestor de <span className="text-red-600">Fotocopiadora</span>
      </Link>

      <div className="flex items-center gap-4">
        {usuario ? (
          <>
            <span className="text-sm text-gray-600">
              Hola, <span className="font-medium text-gray-800">{usuario.nombre}</span>{' '}
              <span className="text-red-600 text-xs uppercase font-semibold">({usuario.rol})</span>
            </span>
            <button
              onClick={manejarCerrarSesion}
              className="text-sm px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm text-gray-700 hover:text-red-600 transition-colors">
              Iniciar sesión
            </Link>
            <Link
              to="/registro"
              className="text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;