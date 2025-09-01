// frontend/js/movies.js
class MoviesManager {
  constructor() {
    this.currentPage = 1;
    this.currentFilters = {};
    this.loading = false;
    this.init();
  }

  // Inicializar la página de películas
  async init() {
    await this.loadCategories();
    await this.loadMovies();
    this.setupEventListeners();
  }

  // Cargar películas con filtros actuales
  async loadMovies(page = 1) {
    if (this.loading) return;

    this.showLoading(true);
    this.loading = true;

    try {
      const params = {
        page,
        limit: 12,
        ...this.currentFilters
      };

      const response = await api.getMovies(params);
      
      if (response.success) {
        this.renderMovies(response.data.movies);
        this.renderPagination(response.data.pagination);
        this.currentPage = page;
      } else {
        this.showError('Error al cargar las películas');
      }
    } catch (error) {
      console.error('Error loading movies:', error);
      this.showError('Error al cargar las películas: ' + error.message);
    } finally {
      this.showLoading(false);
      this.loading = false;
    }
  }

  // Cargar categorías para el filtro
  async loadCategories() {
    try {
      const response = await api.getCategories();
      if (response.success) {
        this.renderCategoryFilter(response.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  // Renderizar lista de películas
  renderMovies(movies) {
    const container = document.getElementById('movies-container');
    if (!container) return;

    if (!movies || movies.length === 0) {
      container.innerHTML = `
        <div class="no-movies">
          <h3>No se encontraron películas</h3>
          <p>Intenta cambiar los filtros de búsqueda</p>
        </div>
      `;
      return;
    }

    const moviesHTML = movies.map(movie => this.createMovieCard(movie)).join('');
    container.innerHTML = moviesHTML;
  }

  // Crear card de película
  createMovieCard(movie) {
    const defaultImage = 'assets/img/placeholder-movie.jpg';
    const imageUrl = movie.image || defaultImage;
    
    return `
      <div class="movie-card" data-movie-id="${movie._id}">
        <div class="movie-image">
          <img src="${imageUrl}" alt="${movie.title}" loading="lazy" onerror="this.src='${defaultImage}'">
          <div class="movie-overlay">
            <button class="btn-view-details" onclick="viewMovieDetails('${movie._id}')">
              Ver Detalles
            </button>
          </div>
        </div>
        <div class="movie-info">
          <h3 class="movie-title">${this.escapeHtml(movie.title)}</h3>
          <p class="movie-year">${movie.year}</p>
          <div class="movie-stats">
            <div class="rating">
              <span class="rating-star">⭐</span>
              <span class="rating-value">${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
            </div>
            <div class="review-count">
              <span>${movie.reviewCount || 0} reseñas</span>
            </div>
          </div>
          <p class="movie-description">${this.truncateText(movie.description, 100)}</p>
        </div>
      </div>
    `;
  }

  // Renderizar paginación
  renderPagination(pagination) {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    const { page, pages, hasNext, hasPrev } = pagination;

    let paginationHTML = '<div class="pagination">';

    if (hasPrev) {
      paginationHTML += `
        <button class="pagination-btn" onclick="moviesManager.loadMovies(${page - 1})">
          Anterior
        </button>
      `;
    }

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(pages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      const activeClass = i === page ? 'active' : '';
      paginationHTML += `
        <button class="pagination-btn ${activeClass}" onclick="moviesManager.loadMovies(${i})">
          ${i}
        </button>
      `;
    }

    if (hasNext) {
      paginationHTML += `
        <button class="pagination-btn" onclick="moviesManager.loadMovies(${page + 1})">
          Siguiente
        </button>
      `;
    }

    paginationHTML += '</div>';
    container.innerHTML = paginationHTML;
  }

  // Renderizar filtro de categorías
  renderCategoryFilter(categories) {
    const select = document.getElementById('category-filter');
    if (!select) return;

    let optionsHTML = '<option value="">Todas las categorías</option>';
    categories.forEach(category => {
      optionsHTML += `<option value="${category._id}">${this.escapeHtml(category.name)}</option>`;
    });

    select.innerHTML = optionsHTML;
  }

  // Configurar event listeners
  setupEventListeners() {
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', (e) => {
        this.currentFilters.category = e.target.value;
        this.loadMovies(1);
      });
    }

    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.loadMovies(1);
      });
    }

    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
      const performSearch = () => {
        const query = searchInput.value.trim();
        if (query !== this.currentFilters.search) {
          this.currentFilters.search = query || undefined;
          this.loadMovies(1);
        }
      };

      searchBtn.addEventListener('click', performSearch);
      
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          performSearch();
        }
      });

      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          const query = searchInput.value.trim();
          if (query.length === 0 || query.length >= 3) {
            this.currentFilters.search = query || undefined;
            this.loadMovies(1);
          }
        }, 500);
      });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearFilters();
      });
    }
  }

  clearFilters() {
    this.currentFilters = {};
    
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');

    if (categoryFilter) categoryFilter.value = '';
    if (sortFilter) sortFilter.value = 'rating';
    if (searchInput) searchInput.value = '';

    this.loadMovies(1);
  }

  showLoading(show) {
    const loader = document.getElementById('loading-indicator');
    const container = document.getElementById('movies-container');
    
    if (loader) loader.style.display = show ? 'block' : 'none';
    if (container && show) {
      container.innerHTML = '<div class="loading-movies">Cargando películas...</div>';
    }
  }

  showError(message) {
    const container = document.getElementById('movies-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>Error</h3>
          <p>${message}</p>
          <button onclick="moviesManager.loadMovies()" class="btn-retry">
            Reintentar
          </button>
        </div>
      `;
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

// Función global para ver detalles
async function viewMovieDetails(movieId) {
  localStorage.setItem('currentMovieId', movieId);
  window.location.href = 'detail.html';
}

// Index: cargar populares
async function loadPopularMovies() {
  try {
    const response = await api.getPopularMovies(6);
    if (response.success) {
      renderPopularMovies(response.data);
    }
  } catch (error) {
    console.error('Error loading popular movies:', error);
  }
}

// Index: cargar recientes
async function loadRecentMovies() {
  try {
    const response = await api.getRecentMovies(6);
    if (response.success) {
      renderRecentMovies(response.data);
    }
  } catch (error) {
    console.error('Error loading recent movies:', error);
  }
}

// Render populares
function renderPopularMovies(movies) {
  const container = document.getElementById('popular-movies-container');
  if (!container || !movies.length) return;
  container.innerHTML = movies.map(movie => createIndexMovieCard(movie)).join('');
}

// Render recientes
function renderRecentMovies(movies) {
  const container = document.getElementById('recent-movies-container');
  if (!container || !movies.length) return;
  container.innerHTML = movies.map(movie => createIndexMovieCard(movie)).join('');
}

// Card en index
function createIndexMovieCard(movie) {
  const defaultImage = 'assets/img/placeholder-movie.jpg';
  const imageUrl = movie.image || defaultImage;
  
  return `
    <div class="index-movie-card" onclick="viewMovieDetails('${movie._id}')">
      <div class="movie-poster">
        <img src="${imageUrl}" alt="${movie.title}" onerror="this.src='${defaultImage}'">
      </div>
      <div class="movie-info">
        <h4>${movie.title}</h4>
        <div class="movie-rating">
          <span class="rating-star">⭐</span>
          <span>${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
        </div>
      </div>
    </div>
  `;
}

// Inicializar
let moviesManager;
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('movies-container')) {
    moviesManager = new MoviesManager();
  }
  if (document.getElementById('popular-movies-container') || document.getElementById('recent-movies-container')) {
    loadPopularMovies();
    loadRecentMovies();
  }
});
