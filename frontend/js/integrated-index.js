// frontend/js/integrated-index.js
document.addEventListener('DOMContentLoaded', async () => {
  const popularContainer = document.getElementById('popular-movies-container');
  const recentContainer = document.getElementById('recent-movies-container');

  // Cargar películas populares
  try {
    const response = await api.getPopularMovies(6);
    if (response.success && response.data.length > 0) {
      renderMovies(response.data, popularContainer);
    } else {
      popularContainer.innerHTML = '<p>No hay películas populares.</p>';
    }
  } catch (err) {
    console.error('Error cargando populares:', err);
  }

  // Cargar películas recientes
  try {
    const response = await api.getRecentMovies(6);
    if (response.success && response.data.length > 0) {
      renderMovies(response.data, recentContainer);
    } else {
      recentContainer.innerHTML = '<p>No hay películas recientes.</p>';
    }
  } catch (err) {
    console.error('Error cargando recientes:', err);
  }
});

// Renderizar cards de películas
function renderMovies(movies, container) {
  container.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <img src="${movie.image || 'assets/img/placeholder-movie.jpg'}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <p>${movie.year}</p>
      </div>
    </div>
  `).join('');
}
