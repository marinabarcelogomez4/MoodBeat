const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const verifyToken = require('../middleware/authMiddleware');


// 👉 Registro de usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log(`📝 Intento de registro: ${email}`);

  if (!email || !password) {
    console.log('❌ Registro fallido: campos vacíos');
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`❌ Registro fallido: el usuario "${email}" ya existe`);
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    console.log(`✅ Usuario registrado y guardado en MongoDB: ${email}`);
    res.status(201).json({ message: 'Usuario registrado correctamente' });

  } catch (err) {
    console.error(`❌ Error registrando a ${email}:`, err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// 👉 Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`🔐 Intento de login: ${email}`);
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log(`❌ Usuario no encontrado: ${email}`);
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`❌ Contraseña incorrecta para: ${email}`);
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
      }
  
      const token = jwt.sign({ email }, process.env.JWT_SECRET || 'moodbeat_secret', {
        expiresIn: '1h',
      });
  
      // 🧁 Enviar el token en una cookie HTTP-only
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // ⛔️ CAMBIA a true si usas HTTPS en producción
        sameSite: 'Lax', // o 'Strict' o 'None' dependiendo de tu frontend
        maxAge: 3600000 // 1 hora
      });

 
      console.log(`✅ Login exitoso: ${email}, token: ${token}`);
      res.status(200).json({ message: 'Login correcto', token });

  
    } catch (err) {
      console.error(`❌ Error durante login de ${email}:`, err.message);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

// 🛠 Ruta para listar usuarios desde MongoDB
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Oculta el campo de contraseña
    console.log('📃 Usuarios extraídos de MongoDB');
    res.json(users);
  } catch (err) {
    console.error('❌ Error listando usuarios:', err.message);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Sesión cerrada' });
  });

  router.get('/verify', verifyToken, (req, res) => {
  const { email } = req.user;
  console.log(`🔐Usuario: ${email}`);
  res.status(200).json({ message: 'Sesión válida', email });
});


module.exports = router;
