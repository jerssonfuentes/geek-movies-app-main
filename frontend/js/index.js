// js/index.js
// =====================================
// SCRIPT PRINCIPAL PARA INDEX.HTML
// =====================================

document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = 'http://localhost:4000/api';

  // --- Elementos del DOM ---
  const moviesContainer = document.getElementById('movies-container');
  const loadingMessage = document.getElementById('loading-message');

  // Navbar - enlaces de autenticación
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');

  // --- Autenticación (UI) ---
  const token = localStorage.getItem('token');
  if (token) {
    // Si hay token => ocultar login/register y mostrar logout
    loginLink.classList.add('hidden');
    registerLink.classList.add('hidden');
    logoutLink.classList.remove('hidden');
  }

  // Acción de logout
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.reload();
  });

  // --- Función para obtener y mostrar películas ---
  const fetchAndDisplayMovies = async () => {
    try {
      loadingMessage.style.display = 'block';
      moviesContainer.innerHTML = '';

      const response = await fetch(`${API_BASE_URL}/movies`);
      if (!response.ok) throw new Error('Error al cargar películas.');

      const movies = await response.json();
      displayMovies(movies);
    } catch (error) {
      console.error(error);
      loadingMessage.textContent = 'No se pudieron cargar las películas 😢';
    }
  };

  // --- Función para renderizar películas en la UI ---
  const displayMovies = (movies) => {
    loadingMessage.style.display = 'none';

    if (movies.length === 0) {
      moviesContainer.innerHTML = '<p>No hay películas registradas aún.</p>';
      return;
    }

    movies.forEach(movie => {
      const movieCard = document.createElement('a');
      movieCard.className = 'movie-card';
      movieCard.href = `detail.html?id=${movie._id}`;

      movieCard.innerHTML = `
        <img src="${movie.image || 'assets/img/placeholder.png'}" alt="Póster de ${movie.title}">
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p>${movie.year}</p>
        </div>
      `;
      moviesContainer.appendChild(movieCard);
    });
  };

  // --- Carga inicial ---
  fetchAndDisplayMovies();
});
