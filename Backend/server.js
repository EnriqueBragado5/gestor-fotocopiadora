require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const usuarioRoutes = require('./routes/usuarioRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');
const deudaRoutes = require('./routes/deudaRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/deudas', deudaRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('El servidor de la fotocopiadora está funcionando');
});

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS resultado');
    res.json({ mensaje: 'Conexión a la base de datos exitosa', resultado: rows[0].resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al conectar con la base de datos', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});