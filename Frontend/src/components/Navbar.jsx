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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Gestor de Fotocopiadora</Link>

      <div>
        {usuario ? (
          <>
            <span>Hola, {usuario.nombre} ({usuario.rol})</span>
            <button onClick={manejarCerrarSesion} style={{ marginLeft: '1rem' }}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro" style={{ marginLeft: '1rem' }}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;