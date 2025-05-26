const jwt = require('jsonwebtoken');
function verifyToken(req, res, next) {
    const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  console.log("🔍 Header Authorization:", req.headers['authorization']);
console.log("🔍 Cookie Token:", req.cookies.token);

    if (!token) {
      return res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'moodbeat_secret');
      console.log("✅ Usuario decodificado:", decoded);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }
  

module.exports = verifyToken;
