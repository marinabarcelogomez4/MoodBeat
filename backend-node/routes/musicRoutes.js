const express = require('express');
const router = express.Router();
const emotionService = require('../services/emotionService');
const spotifyService = require('../services/spotifyService');
const verifyToken = require('../middleware/authMiddleware');
const User = require('../models/Users');
const History = require('../models/History');

router.post('/', async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const emotion = await emotionService.getEmotion(text);
    const recommendations = await spotifyService.getRecommendations(emotion);

    res.json({ emotion, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar recomendación' });
  }
});

// Ruta protegida solo como ejemplo
router.get('/personalizada', verifyToken, (req, res) => {
  const email = req.user.email;
  res.json({ message: `Hola ${email}, aquí tienes tu recomendación musical 🎶` });
});

// Guardar historial
router.post('/history', verifyToken, async (req, res) => {
  const { prompt, emotion, recommendations } = req.body;

  if (!prompt || !emotion || !recommendations) {
    return res.status(400).json({ message: 'Faltan campos requeridos' });
  }

  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const entry = new History({
      user: user._id,
      prompt,
      emotion,
      recommendations
    });

    await entry.save();
    res.status(201).json({ message: 'Historial guardado' });

  } catch (error) {
    console.error('❌ Error guardando historial:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// GET /recommend/history
router.get('/history', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const history = await History.find({ user: user._id }).sort({ createdAt: -1 });

    res.json(history);
  } catch (error) {
    console.error('❌ Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
});




module.exports = router;
