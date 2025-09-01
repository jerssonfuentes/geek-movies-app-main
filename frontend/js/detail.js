// detail.js - Manejo detalle de película

const detailContainer = document.getElementById("detailContainer");

// Obtener ID de query params
function getMovieId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Renderizar detalle
function renderDetail(movie) {
  detailContainer.innerHTML = `
    <div class="movie-detail">
      <img src="${movie.poster}" alt="${movie.title}">
      <h2>${movie.title}</h2>
      <p><strong>Género:</strong> ${movie.genre}</p>
      <p><strong>Año:</strong> ${movie.year}</p>
      <p>${movie.description}</p>
    </div>
  `;
}

// Cargar detalle
async function loadDetail() {
  try {
    const id = getMovieId();
    const movie = await apiRequest(`/movies/${id}`);
    renderDetail(movie);
  } catch (err) {
    console.error("Error cargando detalle", err);
  }
}

if (detailContainer) loadDetail();
