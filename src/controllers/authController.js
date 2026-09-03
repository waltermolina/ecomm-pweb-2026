/**
 * Controlador de autenticación visual.
 * No implementa autenticación real: solo renderiza formularios y valida el registro.
 */
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
   * Procesa el envío del login. No existe autenticación real en este sprint,
   * por lo que solo se informa que la funcionalidad llegará más adelante.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  login(req, res) {
    res.render('pages/login', {
      title: 'Login',
      notice: 'Login disponible en el próximo sprint.',
    });
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
  register(req, res) {
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

    res.render('pages/register', {
      title: 'Register',
      errors: {},
      values: { firstName: '', lastName: '', email: '' },
      success: true,
    });
  },
};

module.exports = authController;
