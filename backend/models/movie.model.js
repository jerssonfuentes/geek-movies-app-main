// backend/models/movie.model.js
// =====================================
// MODELO DE PELÍCULAS (sin mongoose)
// Usamos el driver oficial de MongoDB.
// =====================================

/**
 * Este modelo define un helper para obtener la colección "movies"
 * desde la base de datos MongoDB usando el driver oficial.
 * 
 * ⚠️ IMPORTANTE:
 * - Asegúrate de haber llamado a connectDB() en server.js
 *   antes de usar este modelo, para inicializar la conexión.
 */

const { getDb } = require('../config/db'); // ✅ Importamos con D mayúscula

// Nombre de la colección en la base de datos
const MOVIE_COLLECTION = 'movies';

/**
 * Obtiene la colección de películas desde la base de datos.
 * 
 * @returns {Collection} Objeto de la colección de MongoDB
 * @throws {Error} si la base de datos no está inicializada
 */
function getMovieCollection() {
  try {
    const db = getDb(); // ✅ Usar la función correcta (camelCase)
    return db.collection(MOVIE_COLLECTION);
  } catch (error) {
    console.error("❌ Error al obtener la colección de películas:", error);
    throw error;
  }
}

// Exportamos el helper
module.exports = { getMovieCollection };
