// =====================================
// RUTAS DE PELÍCULAS
// =====================================

const express = require('express');
const router = express.Router();

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movie.controller');

// =====================
// Endpoints de Películas
// =====================

// Listar todas las películas
// GET /api/movies
router.get('/', getMovies);

// Obtener una película por ID
// GET /api/movies/:id
router.get('/:id', getMovieById);

// Crear película (futuro: proteger con middleware admin)
// POST /api/movies
router.post('/', createMovie);

// Actualizar película por ID
// PUT /api/movies/:id
router.put('/:id', updateMovie);

// Eliminar película por ID
// DELETE /api/movies/:id
router.delete('/:id', deleteMovie);

module.exports = router;
