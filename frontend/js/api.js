// frontend/js/api.js
// API Client para GeekMovies
// Se encarga de centralizar todas las llamadas HTTP al backend

const API_URL = "http://localhost:4000/api"; // Cambiar si tu backend está en otro puerto/host

const api = {
  /* =========================
   *  AUTHENTICATION
   * ========================= */
  
  // Registrar usuario
  async register(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  // Login usuario
  async login(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return res.json();
  },

  // Perfil del usuario autenticado
  async getProfile(token) {
    const res = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return res.json();
  },

  /* =========================
   *  MOVIES
   * ========================= */
  
  // Obtener películas con filtros
  async getMovies(params = {}) {
    const url = new URL(`${API_URL}/movies`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    const res = await fetch(url);
    return res.json();
  },

  // Obtener película por ID
  async getMovieById(id) {
    const res = await fetch(`${API_URL}/movies/${id}`);
    return res.json();
  },

  // Crear nueva película (requiere token)
  async createMovie(movieData, token) {
    const res = await fetch(`${API_URL}/movies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
    return res.json();
  },

  // Actualizar película
  async updateMovie(id, movieData, token) {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
    return res.json();
  },

  // Eliminar película
  async deleteMovie(id, token) {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  },

  // Películas populares
  async getPopularMovies(limit = 6) {
    const res = await fetch(`${API_URL}/movies/popular?limit=${limit}`);
    return res.json();
  },

  // Películas recientes
  async getRecentMovies(limit = 6) {
    const res = await fetch(`${API_URL}/movies/recent?limit=${limit}`);
    return res.json();
  },

  /* =========================
   *  CATEGORIES
   * ========================= */
  
  // Obtener todas las categorías
  async getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    return res.json();
  },

  // Crear categoría
  async createCategory(categoryData, token) {
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  // Actualizar categoría
  async updateCategory(id, categoryData, token) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(categoryData)
    });
    return res.json();
  },

  // Eliminar categoría
  async deleteCategory(id, token) {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  }
};
