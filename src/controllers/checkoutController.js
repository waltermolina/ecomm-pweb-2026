/**
 * Controlador de checkout.
 * En este sprint solo muestra un mensaje informativo, sin lógica de negocio.
 */
const checkoutController = {
  /**
   * Renderiza la vista temporal de checkout.
   * @param {import('express').Request} req Request de Express.
   * @param {import('express').Response} res Response de Express.
   * @returns {void}
   */
  show(req, res) {
    res.render('pages/checkout', { title: 'Checkout' });
  },
};

module.exports = checkoutController;
