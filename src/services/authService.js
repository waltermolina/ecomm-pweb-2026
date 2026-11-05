const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersService = require('./usersService');

const authService = {
  async register({ name, email, password }) {
    return usersService.create({ name, email, password });
  },

  async login(email, password) {
    const safeUser = await authenticate(email, password);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('La variable JWT_SECRET es obligatoria');
    }

    const token = jwt.sign(
      { id: safeUser.id, email: safeUser.email, role: safeUser.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
    );

    return { user: safeUser, token };
  },

  authenticate,
};

async function authenticate(email, password) {
  const user = usersService.findByEmail(email);
  const passwordMatches =
    user && typeof password === 'string' && (await bcrypt.compare(password, user.password_hash));

  if (!passwordMatches) {
    const error = new Error('Email o contraseña incorrectos');
    error.status = 401;
    throw error;
  }

  return toPublicUser(user);
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

module.exports = authService;
