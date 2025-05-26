Aquí tienes un **README.md completo y profesional** para tu proyecto, basado en toda la arquitectura que has descrito:

---

```markdown
# 🎧 MoodBeat

**MoodBeat** es una aplicación web que analiza el estado emocional del usuario a partir de un texto en español y le recomienda playlists de Spotify adecuadas a su emoción. Combina procesamiento de lenguaje natural (NLP), autenticación JWT, una API backend en Node.js y un microservicio en Python con modelos de HuggingFace.

---

## 🧠 Características principales

- 🔐 Registro e inicio de sesión con autenticación JWT
- 🧾 Historial de análisis emocional y recomendaciones por usuario
- 💬 Análisis de emociones usando modelos de HuggingFace (Flask)
- 🌍 Traducción automática del español al inglés para mayor precisión
- 🎵 Recomendaciones musicales basadas en emociones usando la API de Spotify
- ☁️ Almacenamiento en MongoDB

---

## 📁 Estructura del proyecto

```

📦 backend/
├── app.js                     # Archivo principal del servidor Express
├── .env                       # Variables de entorno
├── database/
│   └── mongoose.js            # Conexión a MongoDB
├── middleware/
│   └── authMiddleware.js      # Middleware para verificar JWT
├── models/
│   ├── History.js             # Modelo de historial de emociones
│   └── Users.js               # Modelo de usuario
├── routes/
│   ├── authRoutes.js          # Rutas de autenticación
│   ├── historyRoutes.js       # Rutas para historial de usuario
│   └── musicRoutes.js         # Rutas para recomendación musical
├── services/
│   ├── emotionService.js      # Llamadas al microservicio Flask
│   └── spotifyService.js      # Lógica de recomendaciones usando Spotify

```
```

📦 microservicio-emociones/
└── app.py                     # Microservicio Flask para análisis de emociones

````

---

## ⚙️ Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/moodbeat.git
cd moodbeat
````

### 2. Configura las variables de entorno

Crea un archivo `.env` en la raíz del backend:

```env
PORT=3000
API_URL=http://localhost:5000

SPOTIFY_CLIENT_ID=TU_CLIENT_ID
SPOTIFY_CLIENT_SECRET=TU_CLIENT_SECRET

JWT_SECRET=gzsVg3MMXirrQEYEHKvGST3uftuTvcVa6v3Xrt6BtkoHJCn4flhZeFUgTlTLZsOiphFH0XrGuAqWVNNXVLRwkhAjh4ducxTJa04oUuCrxDmXEsba2qnUrc4GRUCyGcrAT2EJqqARMhTgOeK70YxwYMhpjbkMR0NvEmgjD2HIZllgqfo8FBLsJrkH3a4478knmjcjR45qnjp5Fc96qD2smVSR3DK09SXXfjm1iLygbL144JzpaJeEQxYL9WQWmzdJ


```


---

## 🚀 Cómo ejecutar el proyecto

### 1. Backend (Node.js)

```bash
cd backend
npm install
node app.js
```

### 2. Microservicio de emociones (Flask)

Instala dependencias y ejecuta:

```bash
cd microservicio-emociones
pip install -r requirements.txt
python app.py
```

> Este servicio estará corriendo en `http://localhost:5000/predict_emotion`

---

## 🔌 Endpoints principales

### Autenticación (`/auth`)

* `POST /register` — Registrar nuevo usuario
* `POST /login` — Iniciar sesión y recibir JWT en cookie
* `POST /logout` — Cerrar sesión
* `GET /verify` — Verificar sesión activa

### Análisis de emociones y música (`/recommend`)

* `POST /` — Enviar texto y recibir emoción + recomendaciones musicales
* `GET /personalizada` — Ruta protegida de prueba
* `POST /history` — Guardar una recomendación
* `GET /history` — Obtener historial del usuario logueado

### Historial (`/history`)

* `POST /` — Guardar entrada en el historial
* `GET /` — Obtener historial del usuario
* `DELETE /:id` — Eliminar entrada específica del historial

---

## 🧠 Microservicio Flask

`app.py` hace uso de dos modelos de HuggingFace:

* [`pysentimiento/bertweet-base-emotion`](https://huggingface.co/pysentimiento/bertweet-base-emotion) — Clasificador de emociones
* [`Helsinki-NLP/opus-mt-es-en`](https://huggingface.co/Helsinki-NLP/opus-mt-es-en) — Traductor español a inglés

### Endpoint disponible

* `POST /predict_emotion` — Recibe `{ text }` en español y devuelve la emoción detectada.

---

## 🧪 Ejemplo de flujo completo

1. Un usuario escribe: **"Me siento muy triste y sin motivación"**
2. Se traduce automáticamente a inglés.
3. Se detecta la emoción: `tristeza`
4. Se buscan playlists relacionadas en Spotify: `sad`
5. Se devuelve una lista de recomendaciones y se guarda el historial.

---

## 🛡 Seguridad

* Contraseñas hasheadas con **bcrypt**
* Autenticación con **JWT en cookies HTTP-only**
* Verificación de identidad en rutas protegidas

---

## 📌 Dependencias clave

### Backend (Node.js)

* express
* mongoose
* bcryptjs
* jsonwebtoken
* dotenv
* cors
* cookie-parser
* axios

### Microservicio (Python)

* flask
* flask-cors
* torch
* transformers
* pysentimiento
* sentencepiece

---

## 📬 Contacto

Desarrollado por \Marina Barceló Gómez

* 📧 Email: marinabarcelogomez4@gmail.com
* 🧠 Basado en modelos de HuggingFace + Spotify API

---

## 🖼️ Capturas o video (opcional)


