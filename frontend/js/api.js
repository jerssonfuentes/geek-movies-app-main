// api.js - Configuración base para llamadas al backend

const API_URL = "http://localhost:4000/api"; // Cambia al endpoint real de tu backend

// Función genérica para hacer peticiones
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) options.body = JSON.stringify(data);
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
