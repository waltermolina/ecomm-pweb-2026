const authService = require('../services/authService');

const authController = {
  /**
   * Renderiza el formulario de login.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  loginForm(req, res) {
    res.render('pages/login', { title: 'Login', notice: '' });
  },

  /**
   * Valida credenciales, renueva la sesión y redirige a la página principal.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  async login(req, res, next) {
    try {
      const user = await authService.authenticate(
        req.body.email || req.body.user,
        req.body.password,
      );
      await regenerateSession(req);
      req.session.user = user;
      await saveSession(req);
      res.redirect('/');
    } catch (error) {
      if (error.status === 401) {
        res.status(401).render('pages/login', {
          title: 'Login',
          notice: error.message,
        });
        return;
      }
      next(error);
    }
  },

  /**
   * Renderiza el formulario de registro vacío.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  registerForm(req, res) {
    res.render('pages/register', {
      title: 'Register',
      errors: {},
      values: { firstName: '', lastName: '', email: '' },
      success: false,
    });
  },

  /**
   * Procesa el envío del registro usando los errores calculados por el middleware.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  async register(req, res, next) {
    const errors = req.registerErrors;
    const values = {
      firstName: req.registerData.firstName ?? '',
      lastName: req.registerData.lastName ?? '',
      email: req.registerData.email ?? '',
    };

    if (Object.keys(errors).length > 0) {
      res.status(422).render('pages/register', {
        title: 'Register',
        errors,
        values,
        success: false,
      });
      return;
    }

    try {
      await authService.register({
        name: `${values.firstName} ${values.lastName}`.trim(),
        email: values.email,
        password: req.registerData.password,
      });
      res.render('pages/register', {
        title: 'Register',
        errors: {},
        values: { firstName: '', lastName: '', email: '' },
        success: true,
      });
    } catch (error) {
      if (error.status === 409) {
        res.status(409).render('pages/register', {
          title: 'Register',
          errors: { email: error.message },
          values,
          success: false,
        });
        return;
      }
      next(error);
    }
  },

  async registerApi(req, res, next) {
    try {
      const { name, email, password } = req.body || {};
      await authService.register({ name, email, password });
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
      next(error);
    }
  },

  async loginApi(req, res, next) {
    try {
      const { token } = await authService.login(req.body?.email, req.body?.password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  },

  logout(req, res, next) {
    req.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  },
};

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => (error ? reject(error) : resolve()));
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => (error ? reject(error) : resolve()));
  });
}

module.exports = authController;
