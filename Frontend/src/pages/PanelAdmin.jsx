import { useState, useEffect } from 'react';
import { obtenerTodosLosPedidos, confirmarPedido, actualizarEstadoPedido, cancelarPedido, marcarNoRetirado } from '../services/pedidoService';
import { obtenerTodasLasDeudas, marcarDeudaPagada } from '../services/deudaService';
import { formatearEstado, formatearTipoTrabajo, formatearEstadoDeuda, urlArchivo } from '../utils/formato';
import { crearAdmin, obtenerAdmins, actualizarAdmin, cambiarEstadoAdmin } from '../services/usuarioService';
import { useAuth } from '../context/AuthContext';
import { obtenerLimite, actualizarLimite } from '../services/configuracionService';

const coloresEstado = {
  pendiente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-blue-100 text-blue-800',
  listo: 'bg-green-100 text-green-800',
  entregado: 'bg-gray-100 text-gray-700',
  cancelado: 'bg-red-100 text-red-700',
  no_retirado: 'bg-red-100 text-red-700'
};

const coloresDeuda = {
  pendiente: 'bg-red-100 text-red-700',
  pagada: 'bg-green-100 text-green-800'
};

function PanelAdmin() {
  const [pedidos, setPedidos] = useState([]);
  const [deudas, setDeudas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [precios, setPrecios] = useState({});
  const [mostrarFormAdmin, setMostrarFormAdmin] = useState(false);
  const [formAdmin, setFormAdmin] = useState({ nombre: '', apellido: '', email: '', contrasena: '', telefono: '' });
  const [errorAdmin, setErrorAdmin] = useState('');
  const [exitoAdmin, setExitoAdmin] = useState('');
  const { usuario } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicion, setFormEdicion] = useState({ nombre: '', apellido: '', telefono: '' });
  const [limiteInput, setLimiteInput] = useState('');
  const [mensajeLimite, setMensajeLimite] = useState('');
  const [pestana, setPestana] = useState('pedidos');
  
  async function cargarDatos() {
  try {
    const [datosPedidos, datosDeudas, datosAdmins, datosLimite] = await Promise.all([
      obtenerTodosLosPedidos(),
      obtenerTodasLasDeudas(),
      obtenerAdmins(),
      obtenerLimite()
    ]);
    setPedidos(datosPedidos);
    setDeudas(datosDeudas);
    setAdmins(datosAdmins);
    setLimiteInput(datosLimite.limite_deuda);
  } catch (err) {
    setError('No se pudieron cargar los datos');
  } finally {
    setCargando(false);
  }
}

  useEffect(() => {
    cargarDatos();
  }, []);

  async function manejarConfirmar(id) {
    const precio = precios[id];
    if (!precio || Number(precio) <= 0) {
      alert('Ingresá un precio mayor a 0 antes de confirmar');
      return;
    }
    try {
      await confirmarPedido(id, precio);
      cargarDatos();
    } catch (err) {
      alert('Error al confirmar el pedido');
    }
  }

  async function manejarCambioEstado(id, nuevoEstado) {
    try {
      await actualizarEstadoPedido(id, nuevoEstado);
      cargarDatos();
    } catch (err) {
      alert('Error al actualizar el estado');
    }
  }

  async function manejarCancelar(id) {
    try {
      await cancelarPedido(id);
      cargarDatos();
    } catch (err) {
      alert('Error al cancelar el pedido');
    }
  }

  async function manejarNoRetirado(id) {
    const confirmar = window.confirm('¿Confirmás que este pedido no fue retirado? Se generará una deuda al cliente.');
    if (!confirmar) return;
    try {
      await marcarNoRetirado(id);
      cargarDatos();
    } catch (err) {
      alert('Error al marcar el pedido como no retirado');
    }
  }

  async function manejarMarcarPagada(id) {
    try {
      await marcarDeudaPagada(id);
      cargarDatos();
    } catch (err) {
      alert('Error al marcar la deuda como pagada');
    }
  }
  function manejarCambioFormAdmin(e) {
  setFormAdmin({ ...formAdmin, [e.target.name]: e.target.value });
}

  async function manejarCrearAdmin(e) {
  e.preventDefault();
  setErrorAdmin('');
  setExitoAdmin('');
  try {
    await crearAdmin(formAdmin);
    setExitoAdmin('Administrador creado correctamente');
    setFormAdmin({ nombre: '', apellido: '', email: '', contrasena: '', telefono: '' });
    cargarDatos();
  } catch (err) {
    const mensaje = err.response?.data?.mensaje || 'Error al crear el administrador';
    setErrorAdmin(mensaje);
  }
}
  
  function iniciarEdicion(admin) {
  setEditandoId(admin.id_usuario);
  setFormEdicion({ nombre: admin.nombre, apellido: admin.apellido, telefono: admin.telefono || '' });
}

function cancelarEdicion() {
  setEditandoId(null);
}

async function guardarEdicion(id) {
  try {
    await actualizarAdmin(id, formEdicion);
    setEditandoId(null);
    cargarDatos();
  } catch (err) {
    alert('Error al actualizar el administrador');
  }
}

async function manejarCambiarEstado(id, estadoActual) {
  const accion = estadoActual ? 'desactivar' : 'reactivar';
  const confirmar = window.confirm(`¿Confirmás que querés ${accion} este administrador?`);
  if (!confirmar) return;
  try {
    await cambiarEstadoAdmin(id, !estadoActual);
    cargarDatos();
  } catch (err) {
    const mensaje = err.response?.data?.mensaje || `Error al ${accion} el administrador`;
    alert(mensaje);
  }
}


async function manejarGuardarLimite(e) {
  e.preventDefault();
  setMensajeLimite('');
  try {
    await actualizarLimite(limiteInput);
    setMensajeLimite('Límite actualizado correctamente');
    cargarDatos();
  } catch (err) {
    setMensajeLimite(err.response?.data?.mensaje || 'Error al actualizar el límite');
  }
}

  if (cargando) return <p className="text-center text-gray-500 mt-8">Cargando...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;

  const botonAccion = 'text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors';
  const botonPrimario = 'text-sm px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors';

  const pestanas = [
  { id: 'pedidos', nombre: 'Pedidos' },
  { id: 'deudas', nombre: 'Deudas' },
  { id: 'administradores', nombre: 'Administradores' },
  { id: 'configuracion', nombre: 'Configuración' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Panel de Administrador</h2>
    
    <div className="flex gap-1 border-b border-gray-200 mb-6">
      {pestanas.map((p) => (
        <button
          key={p.id}
          onClick={() => setPestana(p.id)}
          className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
            pestana === p.id
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          {p.nombre}
        </button>
      ))}
    </div>
{pestana === 'pedidos' && (
      <>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Pedidos</h3>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">No hay pedidos todavía.</p>
      ) : (
        <div className="space-y-3 mb-10">
          {pedidos.map((pedido) => (
            <div key={pedido.id_pedido} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-gray-800">Pedido #{pedido.id_pedido}</span>
                  <span className="text-gray-500 ml-2 text-sm">
                    {pedido.nombre} {pedido.apellido} ({pedido.email})
                  </span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${coloresEstado[pedido.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {formatearEstado(pedido.estado)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-1">
                {formatearTipoTrabajo(pedido.tipo_trabajo)} — {pedido.cantidad_copias} copias
                {pedido.precio && ` — $${pedido.precio}`}
              </p>

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

              <div className="flex flex-wrap gap-2 mt-3">
                {pedido.estado === 'pendiente' && (
                  <>
                    <input
                      type="number"
                      min = "1"
                      placeholder="Precio"
                      onChange={(e) => setPrecios({ ...precios, [pedido.id_pedido]: e.target.value })}
                      className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button onClick={() => manejarConfirmar(pedido.id_pedido)} className={botonPrimario}>
                      Confirmar
                    </button>
                  </>
                )}

                {pedido.estado === 'confirmado' && (
                  <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'listo')} className={botonAccion}>
                    Marcar como listo
                  </button>
                )}

                {pedido.estado === 'listo' && (
                  <>
                    <button onClick={() => manejarCambioEstado(pedido.id_pedido, 'entregado')} className={botonAccion}>
                      Marcar como entregado
                    </button>
                    <button onClick={() => manejarNoRetirado(pedido.id_pedido)} className={botonAccion}>
                      Marcar como no retirado
                    </button>
                  </>
                )}

                {(pedido.estado === 'pendiente' || pedido.estado === 'confirmado') && (
                  <button
                    onClick={() => manejarCancelar(pedido.id_pedido)}
                    className="text-sm px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </>
    )}

    {pestana === 'deudas' && (
      <>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Deudas</h3>
      {deudas.length === 0 ? (
        <p className="text-gray-500">No hay deudas registradas.</p>
      ) : (
        <div className="space-y-2">
          {deudas.map((deuda) => (
            <div key={deuda.id_deuda} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between items-center">
              <span className="text-sm text-gray-700">
                {deuda.nombre} {deuda.apellido} ({deuda.email}) — Pedido #{deuda.id_pedido} — <span className="font-medium">${deuda.monto}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${coloresDeuda[deuda.estado] || 'bg-gray-100 text-gray-700'}`}>
                  {formatearEstadoDeuda(deuda.estado)}
                </span>
                {deuda.estado === 'pendiente' && (
                  <button onClick={() => manejarMarcarPagada(deuda.id_deuda)} className={botonAccion}>
                    Marcar como pagada
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </>
    )}

    {pestana === 'administradores' && (
      <>
        <div className="mb-8">
        <button
          onClick={() => setMostrarFormAdmin(!mostrarFormAdmin)}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600 transition-colors"
        >
          {mostrarFormAdmin ? 'Ocultar formulario' : '+ Crear nuevo administrador'}
        </button>

        {mostrarFormAdmin && (
          <form onSubmit={manejarCrearAdmin} className="bg-white border border-gray-200 rounded-lg p-4 mt-3 shadow-sm space-y-3 max-w-sm">
            <input
              name="nombre"
              placeholder="Nombre"
              value={formAdmin.nombre}
              onChange={manejarCambioFormAdmin}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              name="apellido"
              placeholder="Apellido"
              value={formAdmin.apellido}
              onChange={manejarCambioFormAdmin}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formAdmin.email}
              onChange={manejarCambioFormAdmin}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formAdmin.contrasena}
              onChange={manejarCambioFormAdmin}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              name="telefono"
              placeholder="Teléfono"
              value={formAdmin.telefono}
              onChange={manejarCambioFormAdmin}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errorAdmin && <p className="text-sm text-red-600">{errorAdmin}</p>}
            {exitoAdmin && <p className="text-sm text-green-600">{exitoAdmin}</p>}
            <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium">
              Crear administrador
            </button>
          </form>
        )}
      </div>
        {admins.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Administradores</h3>
            <div className="space-y-2">
              {admins.map((admin) => (
                <div key={admin.id_usuario} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                  {editandoId === admin.id_usuario ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={formEdicion.nombre}
                          onChange={(e) => setFormEdicion({ ...formEdicion, nombre: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                          placeholder="Nombre"
                        />
                        <input
                          value={formEdicion.apellido}
                          onChange={(e) => setFormEdicion({ ...formEdicion, apellido: e.target.value })}
                          className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                          placeholder="Apellido"
                        />
                      </div>
                      <input
                        value={formEdicion.telefono}
                        onChange={(e) => setFormEdicion({ ...formEdicion, telefono: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                        placeholder="Teléfono"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => guardarEdicion(admin.id_usuario)} className={botonPrimario}>
                          Guardar
                        </button>
                        <button onClick={cancelarEdicion} className={botonAccion}>
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-gray-800">{admin.nombre} {admin.apellido}</span>
                        <span className="text-sm text-gray-500 ml-2">{admin.email}</span>
                        <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${admin.activo ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                          {admin.activo ? 'Activo' : 'Desactivado'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => iniciarEdicion(admin)} className={botonAccion}>
                          Editar
                        </button>
                        {admin.id_usuario !== usuario.id && (
                          <button
                            onClick={() => manejarCambiarEstado(admin.id_usuario, admin.activo)}
                            className="text-sm px-3 py-1.5 rounded-md border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            {admin.activo ? 'Desactivar' : 'Reactivar'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )}

    {pestana === 'configuracion' && (
      <>
        <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Límite de deuda por cliente</h3>
        <form onSubmit={manejarGuardarLimite} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-wrap items-center gap-3 max-w-md">
          <span className="text-sm text-gray-600">Bloquear nuevos pedidos desde $</span>
          <input
            type="number"
            min="0"
            value={limiteInput}
            onChange={(e) => setLimiteInput(e.target.value)}
            required
            className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button type="submit" className={botonPrimario}>Guardar</button>
          {mensajeLimite && <p className="w-full text-sm text-gray-600">{mensajeLimite}</p>}
        </form>
      </div>
      </>
    )}
  </div>

);
}
export default PanelAdmin;