// js/integrated-index.js
// =====================================
// SCRIPT PRINCIPAL PARA INDEX.HTML INTEGRADO
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos del DOM ---
  const popularMoviesContainer = document.getElementById('popular-movies-container');
  const recentMoviesContainer = document.getElementById('recent-movies-container');
  const loadingMessage = document.getElementById('loading-message');
  const recentLoadingMessage = document.getElementById('recent-loading-message');

  // Navbar - enlaces de autenticación
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');
  const adminLink = document.getElementById('admin-link');

  // --- Inicialización ---
  updateAuthUI();
  fetchAndDisplayMovies();

  // --- Función para actualizar UI según autenticación ---
  function updateAuthUI() {
    if (api.isAuthenticated()) {
      const user = api.getUserFromToken();
      
      // Ocultar login/register, mostrar logout
      loginLink.classList.add('hidden');
      registerLink.classList.add('hidden');
      logoutLink.classList.remove('hidden');
      
      // Mostrar admin link si es admin
      if (api.isAdmin()) {
        adminLink.classList.remove('hidden');
      }
      
      // Actualizar texto del logout con nombre de usuario
      if (user && user.username) {
        logoutLink.textContent = `Logout (${user.username})`;
      }
    } else {
      // Mostrar login/register, ocultar logout y admin
      loginLink.classList.remove('hidden');
      registerLink.classList.remove('hidden');
      logoutLink.classList.add('hidden');
      adminLink.classList.add('hidden');
    }
  }

  // --- Función para obtener y mostrar películas ---
  const fetchAndDisplayMovies = async () => {
    // Cargar películas populares
    await loadPopularMovies();
    // Cargar películas recientes
    await loadRecentMovies();
  };

  // --- Cargar películas populares ---
  const loadPopularMovies = async () => {
    try {
      if (loadingMessage) {
        loadingMessage.style.display = 'block';
      }
      popularMoviesContainer.innerHTML = '';

      const response = await api.getPopularMovies(6);
      
      if (response.success && response.data.length > 0) {
        displayMovies(response.data, popularMoviesContainer);
        if (loadingMessage) {
          loadingMessage.style.display = 'none';
        }
      } else {
        // Si no hay películas populares, cargar cualquier película
        await loadFallbackMovies(popularMoviesContainer, loadingMessage);
      }
    } catch (error) {
      console.error('Error loading popular movies:', error);
      await loadFallbackMovies(popularMoviesContainer, loadingMessage);
    }
  };

  // --- Cargar películas recientes ---
  const loadRecentMovies = async () => {
    try {
      if (recentLoadingMessage) {
        recentLoadingMessage.style.display = 'block';
      }
      recentMoviesContainer.innerHTML = '';

      const response = await api.getRecentMovies(6);
      
      if (response.success && response.data.length > 0) {
        displayMovies(response.data, recentMoviesContainer);
        if (recentLoadingMessage) {
          recentLoadingMessage.style.display = 'none';
        }
      } else {
        if (recentLoadingMessage) {
          recentLoadingMessage.textContent = 'No hay películas recientes disponibles.';
        }
      }
    } catch (error) {
      console.error('Error loading recent movies:', error);
      if (recentLoadingMessage) {
        recentLoadingMessage.textContent = 'Error al cargar películas recientes.';
      }
    }
  };

  // --- Función fallback para cargar cualquier película ---
  const loadFallbackMovies = async (container, loadingMsg) => {
    try {
      const response = await api.getMovies({ limit: 6, page: 1 });
      
      if (response.success && response.data.movies.length > 0) {
        displayMovies(response.data.movies, container);
        if (loadingMsg) {
          loadingMsg.textContent = 'Películas destacadas:';
          loadingMsg.style.display = 'block';
        }
      } else {
        if (loadingMsg) {
          loadingMsg.textContent = 'No hay películas disponibles aún.';
        }
        container.innerHTML = `
          <div class="no-movies-message">
            <p>¡Sé el primero en agregar películas a nuestra colección!</p>
            ${api.isAuthenticated() ? '<a href="movies.html" class="btn-red">Agregar Película</a>' : '<a href="login.html" class="btn-red">Iniciar Sesión</a>'}
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading fallback movies:', error);
      if (loadingMsg) {
        loadingMsg.textContent = 'No se pudieron cargar las películas 😢';
      }
    }
  };

  // --- Función para renderizar películas en la UI ---
  const displayMovies = (movies, container) => {
    if (!container || movies.length === 0) return;

    // Limpiar container
    container.innerHTML = '';

    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';
      movieCard.setAttribute('data-movie-id', movie._id);
      
      // Crear el card con la estructura de tu diseño original
      movieCard.innerHTML = `
        <img src="${movie.image || 'assets/img/placeholder.png'}" 
             alt="Póster de ${movie.title}"
             onerror="this.src='assets/img/placeholder.png'">
        <div class="movie-info">
          <h3>${escapeHtml(movie.title)}</h3>
          <p class="movie-year">${movie.year}</p>
          <div class="movie-stats">
            <span class="rating">⭐ ${movie.rating ? movie.rating.toFixed(1) : 'N/A'}</span>
            <span class="reviews">${movie.reviewCount || 0} reseñas</span>
          </div>
        </div>
        <div class="movie-overlay">
          <button class="btn-view" onclick="viewMovieDetails('${movie._id}')">
            Ver Detalles
          </button>
        </div>
      `;

      // Agregar evento click para ver detalles
      movieCard.addEventListener('click', () => viewMovieDetails(movie._id));
      
      container.appendChild(movieCard);
    });
  };

  // --- Función para ver detalles de película ---
  window.viewMovieDetails = (movieId) => {
    // Guardar ID para la página de detalles
    localStorage.setItem('currentMovieId', movieId);
    window.location.href = `detail.html?id=${movieId}`;
  };

  // --- Función para escapar HTML ---
  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  // --- Función para mostrar toast ---
  function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.className = `toast ${type}`;
      toast.classList.remove('hidden');
      
      // Auto-hide después de 3 segundos
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3000);
    }
  }

  // --- Acción de logout ---
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Remover token y datos de usuario
    api.removeToken();
    
    // Actualizar UI
    updateAuthUI();
    
    // Mostrar mensaje
    showToast('Sesión cerrada exitosamente', 'success');
    
    // Opcional: recargar página para limpiar estado
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });

  // --- Función para manejar errores de carga de imagen ---
  document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
      e.target.src = 'assets/img/placeholder.png';
    }
  }, true);

  // --- Funciones globales para compatibilidad ---
  window.api = api;
  window.showToast = showToast;
  window.updateAuthUI = updateAuthUI;
});