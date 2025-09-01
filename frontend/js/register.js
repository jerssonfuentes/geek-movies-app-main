// js/register.js

// La URL base de tu API. Asegúrate de que el puerto (4000) sea el correcto.
const API_URL = "http://localhost:4000/api/auth";

// --- ELEMENTOS DEL DOM ---
const registerForm = document.getElementById('registerForm');
const messageElement = document.getElementById('message');

// --- EVENT LISTENER PARA EL ENVÍO DEL FORMULARIO ---
registerForm.addEventListener('submit', async (e) => {
  // Prevenimos el comportamiento por defecto del formulario (recargar la página).
  e.preventDefault();

  // --- OBTENCIÓN DE DATOS ---
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Feedback visual para el usuario.
  messageElement.textContent = 'Registrando...';
  messageElement.style.color = 'gray';

  // --- PETICIÓN A LA API (BACKEND) ---
  try {
    // Usamos fetch para enviar los datos al endpoint '/register'.
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        // Le decimos al servidor que estamos enviando datos en formato JSON.
        'Content-Type': 'application/json',
      },
      // Convertimos el objeto de JavaScript a una cadena de texto JSON.
      body: JSON.stringify({ username, email, password }),
    });

    // Leemos la respuesta del servidor y la convertimos de JSON a un objeto de JavaScript.
    const data = await response.json();

    // --- MANEJO DE LA RESPUESTA ---
    // 'response.ok' es true si el código de estado es 200-299.
    if (response.ok) {
      messageElement.textContent = data.message;
      messageElement.style.color = 'green';
      
      // Redirigimos al login después de un registro exitoso para que el usuario inicie sesión.
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } else {
      // Si el backend envía un error (ej. 400 por email duplicado), lo mostramos.
      const errorMessage = data.message || (data.errors && data.errors[0].msg) || "Ocurrió un error.";
      messageElement.textContent = errorMessage;
      messageElement.style.color = 'red';
    }

  } catch (error) {
    // Este bloque se ejecuta si hay un error de RED (el servidor no responde).
    // Este es el error que estás viendo actualmente.
    console.error('Error de conexión al registrar:', error);
    messageElement.textContent = 'Error de conexión con el servidor. Inténtalo más tarde.';
    messageElement.style.color = 'red';
  }
});