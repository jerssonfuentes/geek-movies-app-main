// =====================================
// CONTROLADOR DE PELÍCULAS
// Aquí manejamos la lógica de negocio
// y comunicación con MongoDB.
// =====================================

const { ObjectId } = require('mongodb');
const { getMovieCollection } = require('../models/movie.model');

// ✅ Obtener todas las películas
async function getMovies(req, res) {
  try {
    const movies = await getMovieCollection().find().toArray();
    res.status(200).json(movies);
  } catch (err) {
    console.error('❌ Error al obtener películas:', err);
    res.status(500).json({ error: 'Error al obtener películas' });
  }
}

// ✅ Obtener película por ID
async function getMovieById(req, res) {
  try {
    const { id } = req.params;

    // Validar que el id sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const movie = await getMovieCollection().findOne({ _id: new ObjectId(id) });

    if (!movie) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    res.status(200).json(movie);
  } catch (err) {
    console.error('❌ Error al obtener película:', err);
    res.status(500).json({ error: 'Error al obtener película' });
  }
}

// ✅ Crear una nueva película (solo admin debería usar esto)
async function createMovie(req, res) {
  try {
    const { title, description, category, year, imageUrl } = req.body;

    if (!title || !description || !category || !year) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const newMovie = {
      title,
      description,
      category,
      year,
      imageUrl: imageUrl || null,
      createdAt: new Date(),
    };

    const result = await getMovieCollection().insertOne(newMovie);
    res.status(201).json({ message: 'Película creada', id: result.insertedId });
  } catch (err) {
    console.error('❌ Error al crear película:', err);
    res.status(500).json({ error: 'Error al crear película' });
  }
}

// ✅ Actualizar película por ID
async function updateMovie(req, res) {
  try {
    const { id } = req.params;
    const { title, description, category, year, imageUrl } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await getMovieCollection().updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, description, category, year, imageUrl } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    res.status(200).json({ message: 'Película actualizada' });
  } catch (err) {
    console.error('❌ Error al actualizar película:', err);
    res.status(500).json({ error: 'Error al actualizar película' });
  }
}

// ✅ Eliminar película por ID
async function deleteMovie(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const result = await getMovieCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }

    res.status(200).json({ message: 'Película eliminada' });
  } catch (err) {
    console.error('❌ Error al eliminar película:', err);
    res.status(500).json({ error: 'Error al eliminar película' });
  }
}

module.exports = {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
