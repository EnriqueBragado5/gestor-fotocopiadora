const pedidoModel = require('../models/pedidoModel');
const archivoModel = require('../models/archivoModel');

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
      await archivoModel.crear({
        id_pedido,
        nombre_archivo: file.originalname,
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
    const pedidos = await pedidoModel.buscarPorUsuario(id_usuario);

    const pedidosConArchivos = await Promise.all(
      pedidos.map(async (pedido) => {
        const archivos = await archivoModel.buscarPorPedido(pedido.id_pedido);
        return { ...pedido, archivos };
      })
    );

    res.json(pedidosConArchivos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
}

async function todos(req, res) {
  try {
    const pedidos = await pedidoModel.buscarTodos();

    const pedidosConArchivos = await Promise.all(
      pedidos.map(async (pedido) => {
        const archivos = await archivoModel.buscarPorPedido(pedido.id_pedido);
        return { ...pedido, archivos };
      })
    );

    res.json(pedidosConArchivos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message });
  }
}

async function confirmar(req, res) {
  try {
    const { id } = req.params;
    const { precio } = req.body;

    if (!precio) {
      return res.status(400).json({ mensaje: 'Debe indicar un precio para confirmar el pedido' });
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