// backend/models/movie.model.js
const { ObjectId } = require('mongodb');

class MovieModel {
  constructor(db) {
    this.collection = db.collection('movies');
    this.reviewsCollection = db.collection('reviews');
  }

  // Crear índices para optimizar búsquedas
  async createIndexes() {
    await this.collection.createIndex({ title: 1 }, { unique: true });
    await this.collection.createIndex({ category: 1 });
    await this.collection.createIndex({ year: 1 });
    await this.collection.createIndex({ rating: -1 });
    await this.collection.createIndex({ createdAt: -1 });
  }

  // Crear película
  async create(movieData) {
    const movie = {
      ...movieData,
      rating: 0,
      reviewCount: 0,
      likeCount: 0,
      approved: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await this.collection.insertOne(movie);
    return { ...movie, _id: result.insertedId };
  }

  // Obtener todas las películas con paginación y filtros
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 12,
      category = null,
      approved = true,
      sortBy = 'rating',
      sortOrder = -1,
      search = null
    } = options;

    const skip = (page - 1) * limit;
    const filter = { approved };

    // Filtro por categoría
    if (category) {
      filter.category = category;
    }

    // Filtro por búsqueda en título
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    // Opciones de ordenamiento
    let sort = {};
    if (sortBy === 'rating') {
      sort = { rating: sortOrder, reviewCount: -1 };
    } else if (sortBy === 'year') {
      sort = { year: sortOrder };
    } else if (sortBy === 'title') {
      sort = { title: sortOrder };
    } else if (sortBy === 'newest') {
      sort = { createdAt: -1 };
    }

    const [movies, total] = await Promise.all([
      this.collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.collection.countDocuments(filter)
    ]);

    return {
      movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  // Obtener película por ID
  async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  // Obtener película por título
  async findByTitle(title) {
    return await this.collection.findOne({ 
      title: { $regex: `^${title}$`, $options: 'i' } 
    });
  }

  // Actualizar película
  async update(id, updateData) {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          updatedAt: new Date() 
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  // Eliminar película
  async delete(id) {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  // Aprobar película (solo admin)
  async approve(id) {
    return await this.update(id, { approved: true });
  }

  // Actualizar rating y estadísticas
  async updateStats(id, rating, reviewCount, likeCount) {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID inválido');
    }

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          rating: parseFloat(rating.toFixed(1)), 
          reviewCount, 
          likeCount,
          updatedAt: new Date()
        } 
      }
    );

    return result.modifiedCount > 0;
  }

  // Obtener películas populares (más reseñas y mejor rating)
  async getPopular(limit = 6) {
    return await this.collection
      .find({ approved: true, reviewCount: { $gt: 0 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(limit)
      .toArray();
  }

  // Obtener películas recientes
  async getRecent(limit = 6) {
    return await this.collection
      .find({ approved: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
  }

  // Obtener estadísticas generales
  async getStats() {
    const [totalMovies, totalApproved, totalPending] = await Promise.all([
      this.collection.countDocuments({}),
      this.collection.countDocuments({ approved: true }),
      this.collection.countDocuments({ approved: false })
    ]);

    return { totalMovies, totalApproved, totalPending };
  }
}

module.exports = MovieModel;