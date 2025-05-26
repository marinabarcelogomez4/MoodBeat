# 🎧 MoodBeat Assistant - Frontend

Este es el **frontend** de la aplicación web **MoodBeat Assistant**, una herramienta que analiza tu estado de ánimo y te recomienda música acorde a cómo te sientes, integrando una API de emociones y recomendaciones musicales.

---

## 🗂️ Estructura de Carpetas

```
frontend/
│
├── css/
│   ├── index.css           # Estilos principales del panel de usuario
│   ├── login.css           # Estilos de la página de login
│   └── register.css        # Estilos de la página de registro
│
├── scripts/
│   ├── index.js            # Lógica principal del frontend
│   ├── login.js            # Script de login (formulario)
│   └── register.js         # Script de registro de usuarios
│
├── index.html              # Página principal del usuario (después del login)
├── login.html              # Formulario de inicio de sesión
└── register.html           # Formulario de registro
```

---

## 🚀 ¿Cómo Funciona?

### 1. **Autenticación**

* El usuario debe registrarse (`register.html`) o iniciar sesión (`login.html`).
* Al iniciar sesión exitosamente, se guarda un **JWT** en `localStorage`.
* Se redirige al `index.html` para usar la app.

### 2. **Página Principal (`index.html`)**

* Al cargar la página:

  * Se verifica el token en `localStorage`.
  * Se consulta la validez del token con `/auth/verify`.
  * Si es válido, se obtiene el correo del usuario y se carga su historial.

### 3. **Recomendación de Música**

* El usuario escribe cómo se siente en el input.
* El sistema:

  1. Envía el texto al backend Flask para detectar la emoción.
  2. Usa esa emoción para pedir recomendaciones al backend Node.js.
  3. Muestra las playlists recomendadas.
  4. Guarda esta interacción en el historial del usuario.

### 4. **Historial**

* Cada recomendación se guarda junto a:

  * Prompt original
  * Emoción detectada
  * Playlists recomendadas
  * Fecha/hora
* Se puede visualizar y eliminar desde el historial.

---

## 🧠 Funciones y Archivos Clave

### `scripts/index.js`

Contiene toda la lógica del panel de usuario:

* Verificación de sesión
* Obtener emoción y recomendaciones
* Renderizar playlists
* Mostrar modales (Spotify, historial)
* Manejo de historial (cargar, eliminar)
* Logout

### `scripts/login.js`

* Envía credenciales al backend Node.
* Almacena token en `localStorage` si el login es exitoso.
* Redirige a `index.html`.

### `scripts/register.js`

* Valida campos.
* Envía datos al backend para crear una cuenta.
* Redirige a `login.html` tras registro exitoso.

---

## 🧪 Requisitos Previos

* Tener corriendo los **backends**:

  * Node.js (`http://localhost:3000`)
  * Flask (`http://localhost:5000`)
* Usar navegador moderno (Chrome, Firefox).

---

## ▶️ Cómo Usarlo

1. Abrir `login.html` en el navegador.
2. Iniciar sesión o registrarse.
3. Una vez dentro, escribir cómo te sientes.
4. Verás recomendaciones musicales y podrás:

   * Explorar playlists
   * Ver/modificar tu historial
   * Cerrar sesión

---

## 📸 Interfaz (Resumen Visual)

* Chat con animación (`Hola, ¿cómo te sientes hoy?`)
* Campo de texto + botón "🎵 Recomendar música"
* Resultados de emoción y playlists
* Historial lateral con entradas pasadas
* Modal de Spotify y modal de historial

---

## 🛠️ Tecnologías Utilizadas

* HTML5, CSS3
* JavaScript puro (Vanilla JS)
* LocalStorage (para token)
* Fetch API
* GSAP (animaciones)
* APIs internas (Node + Flask)

---

## 🧹 Pendientes o Mejoras Futuras

* Validación en tiempo real en formularios
* Filtros en historial (por emoción/fecha)
* Paginación en historial
* Notificaciones visuales (toasts)
* Soporte para más idiomas

