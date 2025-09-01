// backend/controllers/movie.controller.js
const { validationResult } = require('express-validator');
const MovieModel = require('../models/movie.model');
const CategoryModel = require('../models/category.model');
const ReviewModel = require('../models/review.model');
const { successResponse, errorResponse } = require('../utils/response');

class MovieController {
  constructor(db) {
    this.movieModel = new MovieModel(db);
    this.categoryModel = new CategoryModel(db);
    this.reviewModel = new ReviewModel(db);
  }

  // Obtener todas las películas (público)
  async getMovies(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        sortBy = 'rating',
        search
      } = req.query;

      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        category,
        approved: true,
        sortBy,
        sortOrder: -1,
        search
      };

      const result = await this.movieModel.findAll(options);
      
      successResponse(res, 200, 'Películas obtenidas exitosamente', result);
    } catch (error) {
      console.error('Error al obtener películas:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Obtener película por ID
  async getMovieById(req, res) {
    try {
      const { id } = req.params;
      const movie = await this.movieModel.findById(id);

      if (!movie) {
        return errorResponse(res, 404, 'Película no encontrada');
      }

      // Obtener reseñas de la película
      const reviews = await this.reviewModel.findByMovieId(id);

      successResponse(res, 200, 'Película obtenida exitosamente', {
        ...movie,
        reviews
      });
    } catch (error) {
      console.error('Error al obtener película:', error);
      if (error.message === 'ID inválido') {
        return errorResponse(res, 400, 'ID de película inválido');
      }
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Crear nueva película (requiere autenticación)
  async createMovie(req, res) {
    try {
      // Validar errores de express-validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'Datos inválidos', errors.array());
      }

      const { title, description, category, year, image } = req.body;

      // Verificar si la película ya existe
      const existingMovie = await this.movieModel.findByTitle(title);
      if (existingMovie) {
        return errorResponse(res, 409, 'Ya existe una película con ese título');
      }

      // Verificar que la categoría existe
      const categoryExists = await this.categoryModel.findById(category);
      if (!categoryExists) {
        return errorResponse(res, 400, 'La categoría especificada no existe');
      }

      const movieData = {
        title,
        description,
        category,
        year: parseInt(year),
        image: image || null,
        createdBy: req.user.userId
      };

      const movie = await this.movieModel.create(movieData);

      successResponse(res, 201, 'Película creada exitosamente', movie);
    } catch (error) {
      console.error('Error al crear película:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Actualizar película (requiere autenticación)
  async updateMovie(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return errorResponse(res, 400, 'Datos inválidos', errors.array());
      }

      const { id } = req.params;
      const { title, description, category, year, image } = req.body;

      const movie = await this.movieModel.findById(id);
      if (!movie) {
        return errorResponse(res, 404, 'Película no encontrada');
      }

      // Verificar permisos (solo admin o creador)
      if (req.user.role !== 'admin' && movie.createdBy !== req.user.userId) {
        return errorResponse(res, 403, 'No tienes permisos para editar esta película');
      }

      // Si cambió el título, verificar que no existe otro con el mismo
      if (title && title !== movie.title) {
        const existingMovie = await this.movieModel.findByTitle(title);
        if (existingMovie && existingMovie._id.toString() !== id) {
          return errorResponse(res, 409, 'Ya existe una película con ese título');
        }
      }

      const updateData = {};
      if (title) updateData.title = title;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (year) updateData.year = parseInt(year);
      if (image !== undefined) updateData.image = image;

      const updated = await this.movieModel.update(id, updateData);

      if (!updated) {
        return errorResponse(res, 404, 'Película no encontrada');
      }

      successResponse(res, 200, 'Película actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar película:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Eliminar película (solo admin)
  async deleteMovie(req, res) {
    try {
      const { id } = req.params;

      if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Solo los administradores pueden eliminar películas');
      }

      const deleted = await this.movieModel.delete(id);

      if (!deleted) {
        return errorResponse(res, 404, 'Película no encontrada');
      }

      successResponse(res, 200, 'Película eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar película:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Aprobar película (solo admin)
  async approveMovie(req, res) {
    try {
      const { id } = req.params;

      if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Solo los administradores pueden aprobar películas');
      }

      const approved = await this.movieModel.approve(id);

      if (!approved) {
        return errorResponse(res, 404, 'Película no encontrada');
      }

      successResponse(res, 200, 'Película aprobada exitosamente');
    } catch (error) {
      console.error('Error al aprobar película:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Obtener películas populares
  async getPopularMovies(req, res) {
    try {
      const { limit = 6 } = req.query;
      const movies = await this.movieModel.getPopular(parseInt(limit));
      
      successResponse(res, 200, 'Películas populares obtenidas exitosamente', movies);
    } catch (error) {
      console.error('Error al obtener películas populares:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Obtener películas recientes
  async getRecentMovies(req, res) {
    try {
      const { limit = 6 } = req.query;
      const movies = await this.movieModel.getRecent(parseInt(limit));
      
      successResponse(res, 200, 'Películas recientes obtenidas exitosamente', movies);
    } catch (error) {
      console.error('Error al obtener películas recientes:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }

  // Obtener películas pendientes de aprobación (solo admin)
  async getPendingMovies(req, res) {
    try {
      if (req.user.role !== 'admin') {
        return errorResponse(res, 403, 'Solo los administradores pueden ver películas pendientes');
      }

      const options = {
        approved: false,
        sortBy: 'newest'
      };

      const result = await this.movieModel.findAll(options);
      
      successResponse(res, 200, 'Películas pendientes obtenidas exitosamente', result);
    } catch (error) {
      console.error('Error al obtener películas pendientes:', error);
      errorResponse(res, 500, 'Error interno del servidor');
    }
  }
}

module.exports = MovieController;