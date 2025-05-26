const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const History = require('../models/History');

// ✅ Guardar historial
router.post('/', verifyToken, async (req, res) => {
  const { prompt, emotion, recommendations } = req.body;

  try {
    const historyEntry = new History({
      email: req.user.email,
      prompt,
      emotion,
      recommendations
    });

    await historyEntry.save();
    res.status(201).json({ message: 'Historial guardado correctamente' });
  } catch (error) {
    console.error('❌ Error al guardar historial:', error);
    res.status(500).json({ message: 'Error al guardar historial' });
  }
});

// 🧾 Obtener historial del usuario autenticado
router.get('/', verifyToken, async (req, res) => {
  try {
    const history = await History.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error('❌ Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial' });
  }
});

// ❌ Eliminar una entrada del historial
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  console.log(req.params)
 console.log("🗑️ Entrando en DELETE con user:", req.user);
  const userEmail = req.user.email;
  const entryId = req.params.id;
  console.log("🔎 Eliminando ID:", entryId, "para el usuario:", userEmail);

  try {
    const deleted = await History.findOneAndDelete({
      _id: id,
      email: req.user.email // Asegura que solo se elimine si pertenece al usuario autenticado
    });


    if (!deleted) return res.status(404).json({ message: 'Entrada no encontrada' });

    res.json({ message: 'Entrada eliminada correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar historial:', error);
      console.log("🔐 Email autenticado:", req.user.email); 
    res.status(500).json({ message: 'Error al eliminar historial' });
  }
});


module.exports = router;
