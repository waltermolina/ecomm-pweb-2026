const db = require('../../db/database');

const userModel = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE').get(email);
  },

  create({ name, email, passwordHash }) {
    const result = db.prepare(`
      INSERT INTO users (name, email, password_hash)
      VALUES (@name, @email, @passwordHash)
    `).run({ name, email, passwordHash });

    return db.prepare(`
      SELECT id, name, email, role, created_at AS createdAt
      FROM users WHERE id = ?
    `).get(Number(result.lastInsertRowid));
  },
};

module.exports = userModel;
