// backend/seed.js
// =====================================
// Script de Seed para poblar la colección "movies"
// =====================================

/**
 * Este archivo inserta datos de prueba en la colección "movies".
 * Para ejecutarlo:
 * 
 *   node backend/seed.js
 * 
 * Requisitos:
 * - Tener el archivo .env con la variable MONGO_URI configurada.
 * - Haber creado la base de datos geek_movies (se crea sola si no existe).
 */

const { connectDB, getDb } = require('./config/db'); // ✅ Importar correctamente
require('dotenv').config();

async function seedMovies() {
  try {
    // Conectar a MongoDB
    await connectDB();
    const db = getDb();

    // Obtener la colección "movies"
    const moviesCollection = db.collection('movies');

    // Limpiar la colección antes de insertar
    await moviesCollection.deleteMany({});
    console.log("🗑️ Colección 'movies' limpiada.");

    // Datos de prueba
    const movies = [
      {
        title: "The Matrix",
        category: "Ciencia Ficción",
        ranking: 9.0,
        imageUrl: "https://m.media-amazon.com/images/I/51EG732BV3L.jpg",
        description: "Un hacker descubre la verdad sobre su realidad y su papel en la guerra contra sus controladores."
      },
      {
        title: "Inception",
        category: "Acción",
        ranking: 8.8,
        imageUrl: "https://m.media-amazon.com/images/I/5101wltD5XL._AC_SY445_.jpg",
        description: "Un ladrón que roba secretos a través de sueños debe implantar una idea en la mente de un CEO."
      },
      {
        title: "Interstellar",
        category: "Aventura",
        ranking: 8.6,
        imageUrl: "https://m.media-amazon.com/images/I/71n58aCRiML._AC_SY679_.jpg",
        description: "Un grupo de astronautas viaja a través de un agujero de gusano para salvar a la humanidad."
      }
    ];

    // Insertar datos
    await moviesCollection.insertMany(movies);
    console.log("✅ Películas insertadas correctamente en la colección 'movies'");

    process.exit(0); // Finalizar proceso
  } catch (error) {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  }
}

seedMovies();
