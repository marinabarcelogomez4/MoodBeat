const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./database/mongoose');
const cookieParser = require('cookie-parser'); // <--- Añadido aquí

dotenv.config(); // ✅ Primero cargamos las variables de entorno

const app = express();

// ✅ Conectamos a la base de datos
connectDB();

// ✅ Configuración de CORS con origen y credenciales permitidas
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));

app.use(cookieParser());  // <--- Ya funciona correctamente

// ✅ Middleware para leer JSON
app.use(express.json());

// ✅ Importación de rutas
const authRoutes = require('./routes/authroutes.js'); 
const musicRoutes = require('./routes/musicRoutes');  
const historyRoutes = require('./routes/historyRoutes');

// ✅ Uso de rutas
app.use('/auth', authRoutes);
app.use('/recommend', musicRoutes);
app.use('/history', historyRoutes);


// ✅ Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
