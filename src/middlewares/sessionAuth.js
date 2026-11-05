function sessionAuth(req, res, next) {
  req.user = req.session.user || null;
  res.locals.user = req.user;
  next();
}

function requireLogin(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  next();
}

function requireAdminSession(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).render('pages/403', { title: 'Acceso denegado' });
    return;
  }

  next();
}

function guestOnly(req, res, next) {
  if (req.user) {
    res.redirect('/');
    return;
  }

  next();
}

module.exports = { sessionAuth, requireLogin, requireAdminSession, guestOnly };
