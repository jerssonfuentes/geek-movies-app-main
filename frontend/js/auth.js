// URL base de tu API de autenticación
const API_URL = "http://localhost:4000/api/auth";

// --- SELECCIÓN DE ELEMENTOS DEL DOM ---
// Buscamos los elementos que podríamos necesitar en las diferentes páginas.
const loginForm = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerBtn");
const adminBtn = document.getElementById("adminBtn");

// --- LÓGICA PARA EL LOGIN ---
// Verificamos si el formulario de login existe en la página actual.
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    // Prevenimos que la página se recargue al enviar el formulario.
    e.preventDefault();

    // Obtenemos los valores de los campos y el elemento para mensajes.
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const messageElement = document.getElementById("message");

    // Usamos try...catch para manejar posibles errores de red.
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // Mostramos el mensaje del servidor si el elemento existe.
      if (messageElement) {
        messageElement.innerText = data.message;
        // Cambiamos el color del texto si hubo un error.
        messageElement.style.color = response.ok ? "green" : "red";
      }

      // Si la respuesta fue exitosa (código 2xx).
      if (response.ok) {
        // Guardamos el token en el almacenamiento local.
        localStorage.setItem("token", data.token);

        // Redirigimos al usuario según su rol.
        if (data.role === "admin") {
          window.location.href = "admin.html"; // O la ruta a tu panel de admin
        } else {
          window.location.href = "index.html"; // O la ruta a la página principal
        }
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      // Si hay un error de red, lo mostramos en el elemento de mensajes.
      if (messageElement) {
        messageElement.innerText = "Error de conexión con el servidor. Inténtalo más tarde.";
        messageElement.style.color = "red";
      }
    }
  });
}

// --- LÓGICA PARA EL BOTÓN DE REGISTRO ---
// Verificamos si el botón de registro existe en la página actual.
if (registerBtn) {
  registerBtn.addEventListener("click", async () => {
    const email = prompt("Correo:");
    const username = prompt("Usuario:");
    const password = prompt("Contraseña:");

    // Validamos que el usuario no deje campos vacíos.
    if (!email || !username || !password) {
      alert("Todos los campos son requeridos.");
      return;
    }
    
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    alert(data.message);
  });
}

// --- LÓGICA PARA EL BOTÓN DE ADMIN ---
// Verificamos si el botón de admin existe.
if (adminBtn) {
  adminBtn.addEventListener("click", async () => {
    const email = prompt("Correo admin:");
    const password = prompt("Contraseña:");

    if (!email || !password) return;
    
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.role === "admin") {
      localStorage.setItem("token", data.token);
      window.location.href = "admin.html";
    } else {
      alert(data.message || "Credenciales incorrectas o no eres administrador.");
    }
  });
}