function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: 'Se requieren permisos de administrador' });
    return;
  }

  next();
}

module.exports = requireAdmin;
