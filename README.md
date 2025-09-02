// README.md - placeholder

# 🎬 Proyecto Gestión de Películas y Reseñas

## 📌 Descripción del Proyecto

Este proyecto es una aplicación **Fullstack** para la gestión de
películas, series y reseñas.\
Incluye funcionalidades de autenticación con JWT, gestión de usuarios y
roles, sugerencia y aprobación de películas, reseñas con ratings y
likes/dislikes, además de un ranking ponderado.\
El backend está desarrollado en **Node.js + Express.js** con **MongoDB**
como base de datos, y el frontend con **HTML, CSS y JavaScript**.

------------------------------------------------------------------------

## ⚙️ Requerimientos de Instalación

### 🔧 Tecnologías necesarias:

-   Node.js (v18 o superior)
-   MongoDB (v6 o superior)
-   npm o yarn como gestor de paquetes
-   Git para clonar el repositorio

### 📥 Instalación:

``` bash
# Clonar el repositorio
git clone https://github.com/usuario/proyecto-peliculas.git
cd proyecto-peliculas

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend (si aplica librerías)
cd ../frontend
npm install
```

------------------------------------------------------------------------

## 🔐 Variables de Entorno

En el archivo `.env` dentro de la carpeta **backend** deben configurarse
las siguientes variables:

``` env
PORT=4000
MONGO_URI=mongodb://localhost:27017/peliculasDB
JWT_SECRET=mi_secreto_super_seguro
JWT_EXPIRES_IN=1d
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

------------------------------------------------------------------------

## 🚀 Ejecución del Proyecto

### Backend:

``` bash
cd backend
npm run dev
```

### Frontend:

Abrir el archivo `index.html` en un navegador o servirlo con una
extensión/live server.

El backend correrá en `http://localhost:4000` y el frontend en
`http://localhost:3000` (si se usa un servidor local).

------------------------------------------------------------------------

## 📑 Ejemplos de Endpoints

### 🔐 Autenticación

-   **Registro de usuario**

``` http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Rafael Osorio",
  "email": "rafael@example.com",
  "password": "123456"
}
```

-   **Inicio de sesión**

``` http
POST /api/auth/login
Content-Type: application/json

{
  "email": "rafael@example.com",
  "password": "123456"
}
```

Respuesta:

``` json
{
  "token": "JWT_GENERADO_AQUI"
}
```

------------------------------------------------------------------------

### 🎬 Películas

-   **Sugerir película (usuario autenticado)**

``` http
POST /api/peliculas
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "titulo": "Matrix",
  "descripcion": "Un clásico de ciencia ficción",
  "categoria": "Acción"
}
```

-   **Aprobar película (solo admin)**

``` http
PATCH /api/peliculas/:id/aprobar
Authorization: Bearer TOKEN_ADMIN
```

------------------------------------------------------------------------

### 📝 Reseñas

-   **Crear reseña**

``` http
POST /api/reseñas
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "peliculaId": "64b2f2e6d3d8a1c9f6c12345",
  "titulo": "Excelente",
  "comentario": "Me encantó la historia y efectos especiales",
  "calificacion": 9
}
```

-   **Dar like a reseña**

``` http
POST /api/reseñas/:id/like
Authorization: Bearer TOKEN
```

------------------------------------------------------------------------

## 🧪 Cómo Probar los Endpoints

1. Instalar **Postman** o **Insomnia**.\

2. Configurar una colección con la URL base:
   `http://localhost:4000/api`.\

3. Crear un usuario con `/auth/register`.\

4. Iniciar sesión con `/auth/login` y copiar el token JWT.\

5. Probar endpoints protegidos agregando en Headers:

       Authorization: Bearer TOKEN

6. Probar el flujo completo:

   -   Registro/Login\
   -   Sugerir película\
   -   Aprobar película (admin)\
   -   Crear reseña y dar like/dislike

------------------------------------------------------------------------

## 📑 Documentación de la API

La documentación completa de la API está disponible en:\
`http://localhost:4000/api-docs` gracias a **Swagger**.

------------------------------------------------------------------------

## 👨‍💻 Autores

-   Jersson Fuentes\
-   Rafael Osorio
