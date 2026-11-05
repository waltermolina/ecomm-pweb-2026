const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const BCRYPT_ROUNDS = 12;

const usersService = {
  async create({ name, email, password }) {
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || !password) {
      throw createError(400, 'Nombre, email y contraseña son obligatorios');
    }

    if (userModel.findByEmail(normalizedEmail)) {
      throw createError(409, 'El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    try {
      return userModel.create({ name: normalizedName, email: normalizedEmail, passwordHash });
    } catch (error) {
      if (String(error.code).startsWith('SQLITE_CONSTRAINT_UNIQUE')) {
        throw createError(409, 'El email ya está registrado');
      }
      throw error;
    }
  },

  findByEmail(email) {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    return normalizedEmail ? userModel.findByEmail(normalizedEmail) : undefined;
  },
};

function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = usersService;
