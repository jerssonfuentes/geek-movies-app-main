// =====================================
// PUNTO DE ENTRADA DEL SERVIDOR
// =====================================

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

// 🔌 Conexión a la base de datos
connectDB();

const app = express();

// =====================
// Middlewares globales
// =====================
app.use(cors()); // Habilitar peticiones desde cualquier origen (Frontend)
app.use(express.json()); // Parsear JSON en request.body

// =====================
// Rutas principales
// =====================
app.use('/api/auth', require('./routes/auth.routes'));   // Rutas de autenticación
app.use('/api/movies', require('./routes/movie.routes')); // Rutas de películas

// Ruta de prueba para verificar servidor
app.get('/', (req, res) => {
  res.send('✅ API de GeekMovies funcionando correctamente 🚀');
});

// =====================
// Arranque del servidor
// =====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
