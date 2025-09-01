// admin.js - Panel de administración CRUD de películas

const adminForm = document.getElementById("adminForm");
const adminList = document.getElementById("adminList");
const token = localStorage.getItem("token");

// Renderizar lista
function renderAdminMovies(movies) {
  adminList.innerHTML = movies.map(
    (m) => `
      <div class="admin-card">
        <h3>${m.title}</h3>
        <button onclick="deleteMovie('${m._id}')">Eliminar</button>
      </div>
    `
  ).join("");
}

// Cargar todas
async function loadAdminMovies() {
  try {
    const movies = await apiRequest("/movies", "GET", null, token);
    renderAdminMovies(movies);
  } catch (err) {
    console.error("Error cargando admin movies", err);
  }
}

// Crear
if (adminForm) {
  adminForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const genre = e.target.genre.value;
    const year = e.target.year.value;
    const poster = e.target.poster.value;
    const description = e.target.description.value;

    try {
      await apiRequest("/movies", "POST", { title, genre, year, poster, description }, token);
      loadAdminMovies();
      adminForm.reset();
    } catch (err) {
      alert("Error creando película");
    }
  });
}

// Eliminar
async function deleteMovie(id) {
  try {
    await apiRequest(`/movies/${id}`, "DELETE", null, token);
    loadAdminMovies();
  } catch (err) {
    alert("Error eliminando película");
  }
}

if (adminList) loadAdminMovies();
