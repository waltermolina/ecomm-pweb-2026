const orderModel = require('../models/orderModel');

const ordersService = {
  getByUserId(userId) {
    return orderModel.findByUserId(userId);
  },
};

module.exports = ordersService;
