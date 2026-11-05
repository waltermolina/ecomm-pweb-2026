const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authorization = req.get('authorization') || '';
  const match = authorization.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    res.status(401).json({ error: 'Se requiere un token Bearer válido' });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    next(new Error('La variable JWT_SECRET es obligatoria'));
    return;
  }

  try {
    req.user = jwt.verify(match[1], secret);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verifyToken;
