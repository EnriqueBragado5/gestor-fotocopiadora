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

  return (
    <div>
      <h2>Crear cuenta</h2>
      <form onSubmit={manejarSubmit}>
        <div>
          <label>Nombre</label>
          <input name="nombre" value={formulario.nombre} onChange={manejarCambio} required />
        </div>
        <div>
          <label>Apellido</label>
          <input name="apellido" value={formulario.apellido} onChange={manejarCambio} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={formulario.email} onChange={manejarCambio} required />
        </div>
        <div>
          <label>Contraseña</label>
          <input type="password" name="contrasena" value={formulario.contrasena} onChange={manejarCambio} required />
        </div>
        <div>
          <label>Teléfono</label>
          <input name="telefono" value={formulario.telefono} onChange={manejarCambio} />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {exito && <p style={{ color: 'green' }}>¡Cuenta creada! Redirigiendo al login...</p>}
        <button type="submit">Registrarme</button>
      </form>
      <p>¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link></p>
    </div>
  );
}

export default Registro;