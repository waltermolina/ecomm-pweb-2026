const ordersService = require('../services/ordersService');

const ordersController = {
  list(req, res) {
    res.render('pages/orders', {
      title: 'Mis pedidos',
      orders: ordersService.getByUserId(req.user.id),
    });
  },
};

module.exports = ordersController;
