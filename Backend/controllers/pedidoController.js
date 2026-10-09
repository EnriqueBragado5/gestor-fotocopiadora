const pedidoModel = require('../models/pedidoModel');
const archivoModel = require('../models/archivoModel');
const configuracionModel = require('../models/configuracionModel');
const deudaModel = require('../models/deudaModel');

async function crear(req, res) {
  try {
    const { tipo_trabajo, tamano_hoja, color, faz, cantidad_copias, descripcion } = req.body;
    const id_usuario = req.usuario.id;

    if (!tipo_trabajo || !tamano_hoja || !cantidad_copias) {
      return res.status(400).json({ mensaje: 'Faltan datos obligatorios del pedido' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: 'Debe adjuntar al menos un archivo PDF' });
    }
    const deudaActual = await deudaModel.sumarDeudaPendiente(id_usuario);
    const limite = await configuracionModel.obtenerLimiteDeuda();

    if (Number(deudaActual) >= Number(limite)) {
      return res.status(409).json({
        mensaje: `No podés realizar nuevos pedidos porque tu deuda pendiente ($${deudaActual}) alcanzó el límite permitido ($${limite}). Por favor, regularizá tu situación.`
      });
    }

    const id_pedido = await pedidoModel.crear({
      id_usuario,
      tipo_trabajo,
      tamano_hoja,
      color,
      faz,
      cantidad_copias,
      descripcion
    });

    for (const file of req.files) {
  const nombreCorregido = Buffer.from(file.originalname, 'latin1').toString('utf8');
  await archivoModel.crear({
    id_pedido,
    nombre_archivo: nombreCorregido,
    ruta_archivo: file.path
  });
}

    res.status(201).json({ mensaje: 'Pedido creado correctamente', id: id_pedido });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear el pedido', error: error.message });
  }
}

async function misPedidos(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
    const limite = Math.min(Math.max(parseInt(req.query.limite) || 10, 1), 50);
    const offset = (pagina - 1) * limite;

    const [pedidos, total] = await Promise.all([
      pedidoModel.buscarPorUsuarioPaginado(id_usuario, limite, offset),
      pedidoModel.contarPorUsuario(id_usuario)
    ]);

    const pedidosConArchivos = await Promise.all(
      pedidos.map(async (pedido) => {
        const archivos = await archivoModel.buscarPorPedido(pedido.id_pedido);
        return { ...pedido, archivos };
      })
    );

    res.json({
      pedidos: pedidosConArchivos,
      total,
      pagina,
      totalPaginas: Math.max(Math.ceil(total / limite), 1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
}

async function todos(req, res) {
  try {
    const pagina = Math.max(parseInt(req.query.pagina) || 1, 1);
    const limite = Math.min(Math.max(parseInt(req.query.limite) || 10, 1), 50);
    const offset = (pagina - 1) * limite;

    const [pedidos, total] = await Promise.all([
      pedidoModel.buscarTodosPaginado(limite, offset),
      pedidoModel.contarTodos()
    ]);

    const pedidosConArchivos = await Promise.all(
      pedidos.map(async (pedido) => {
        const archivos = await archivoModel.buscarPorPedido(pedido.id_pedido);
        return { ...pedido, archivos };
      })
    );

    res.json({
      pedidos: pedidosConArchivos,
      total,
      pagina,
      totalPaginas: Math.max(Math.ceil(total / limite), 1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
}

async function confirmar(req, res) {
  try {
    const { id } = req.params;
    const { precio } = req.body;


    if (!precio || Number(precio) <= 0) {
      return res.status(400).json({ mensaje: 'Debe poner un número mayor a 0' });
    }

    const pedido = await pedidoModel.buscarPorId(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    await pedidoModel.confirmar(id, precio);
    res.json({ mensaje: 'Pedido confirmado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al confirmar el pedido', error: error.message });
  }
}

async function actualizarEstado(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['listo', 'entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido' });
    }

    const pedido = await pedidoModel.buscarPorId(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    await pedidoModel.actualizarEstado(id, estado);
    res.json({ mensaje: `Pedido actualizado a estado: ${estado}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado', error: error.message });
  }
}

async function cancelar(req, res) {
  try {
    const { id } = req.params;

    const pedido = await pedidoModel.buscarPorId(id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (req.usuario.rol !== 'admin' && pedido.id_usuario !== req.usuario.id) {
      return res.status(403).json({ mensaje: 'No tiene permiso para cancelar este pedido' });
    }

    await pedidoModel.actualizarEstado(id, 'cancelado');
    res.json({ mensaje: 'Pedido cancelado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cancelar el pedido', error: error.message });
  }
}

module.exports = { crear, misPedidos, todos, confirmar, actualizarEstado, cancelar };