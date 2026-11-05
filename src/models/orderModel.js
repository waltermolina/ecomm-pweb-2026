const db = require('../../db/database');

const orderModel = {
  findByUserId(userId) {
    return db.prepare(`
      SELECT id, total, created_at AS createdAt
      FROM orders
      WHERE user_id = ?
      ORDER BY id DESC
    `).all(userId);
  },
};

module.exports = orderModel;
