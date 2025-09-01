const moviesRow = document.getElementById("moviesRow");
const adminBtn = document.getElementById("adminBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Verificar token y rol (si backend lo devuelve en payload)
const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "login.html";
}

async function fetchMovies() {
  try {
    const res = await fetch("http://localhost:4000/api/movies", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Error al obtener películas");

    const movies = await res.json();

    moviesRow.innerHTML = movies.map(m => `
      <div class="movie-card" onclick="goDetail('${m._id}')">
        <img src="${m.imageUrl || 'assets/img/placeholder.jpg'}" alt="${m.title}">
        <p>${m.title}</p>
      </div>
    `).join("");
  } catch (err) {
    console.error(err);
    moviesRow.innerHTML = "<p>Error cargando películas</p>";
  }
}

function goDetail(id) {
  localStorage.setItem("movieId", id);
  window.location.href = "detail.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

fetchMovies();
