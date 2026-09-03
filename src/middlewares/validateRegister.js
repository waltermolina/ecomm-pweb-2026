const SITE_NAME = 'Mi Ecommerce';
const MIN_PASSWORD_LENGTH = 8;
const FORBIDDEN_PASSWORDS = ['password', '1234', 'qwerty'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normaliza un texto para comparaciones (sin acentos, en minúsculas y sin espacios).
 * @param {string} value Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

/**
 * Valida un campo de texto obligatorio sin espacios al inicio o al final.
 * @param {string} value Valor ingresado.
 * @param {string} label Etiqueta legible del campo.
 * @returns {string|null} Mensaje de error o `null` si es válido.
 */
function validateRequiredName(value, label) {
  const rawValue = String(value ?? '');

  if (!rawValue.trim()) {
    return `${label} es obligatorio.`;
  }

  if (rawValue !== rawValue.trim()) {
    return `${label} no debe tener espacios al inicio o al final.`;
  }

  return null;
}

/**
 * Valida el email: obligatorio y con formato correcto.
 * @param {string} value Email ingresado.
 * @returns {string|null} Mensaje de error o `null` si es válido.
 */
function validateEmail(value) {
  const rawValue = String(value ?? '').trim();

  if (!rawValue) {
    return 'El email es obligatorio.';
  }

  if (!EMAIL_PATTERN.test(rawValue)) {
    return 'El email debe tener un formato válido.';
  }

  return null;
}

/**
 * Valida la contraseña según las reglas de seguridad del sprint.
 * @param {string} value Contraseña ingresada.
 * @param {{ firstName?: string, lastName?: string, email?: string }} context Datos del formulario.
 * @returns {string|null} Mensaje de error o `null` si es válida.
 */
function validatePassword(value, context = {}) {
  const password = String(value ?? '');

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if (!/[a-zA-Z]/.test(password)) {
    return 'La contraseña debe incluir al menos una letra.';
  }

  if (!/\d/.test(password)) {
    return 'La contraseña debe incluir al menos un número.';
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    return 'La contraseña debe incluir al menos un carácter especial.';
  }

  const normalizedPassword = normalizeText(password);
  const forbiddenValues = [
    ...FORBIDDEN_PASSWORDS,
    SITE_NAME,
    context.firstName,
    context.lastName,
    context.email,
  ]
    .map(normalizeText)
    .filter(Boolean);

  const isForbidden = forbiddenValues.some(
    (forbidden) => normalizedPassword === forbidden || normalizedPassword.includes(forbidden),
  );

  if (isForbidden) {
    return 'La contraseña no puede contener valores comunes, el nombre del sitio, tu nombre ni tu email.';
  }

  return null;
}

/**
 * Valida los datos del formulario de registro.
 * @param {{ firstName?: string, lastName?: string, email?: string, password?: string }} data Datos enviados.
 * @returns {Object<string, string>} Diccionario de errores por campo (vacío si todo es válido).
 */
function validateRegisterData(data = {}) {
  const errors = {};

  const firstNameError = validateRequiredName(data.firstName, 'El nombre');
  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  const lastNameError = validateRequiredName(data.lastName, 'El apellido');
  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password, data);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

/**
 * Middleware de validación del registro.
 * Deja los errores en `req.registerErrors` y los datos en `req.registerData`.
 * @param {import('express').Request} req Request de Express.
 * @param {import('express').Response} res Response de Express.
 * @param {import('express').NextFunction} next Función para continuar la cadena.
 * @returns {void}
 */
function validateRegister(req, res, next) {
  const data = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  };

  req.registerData = data;
  req.registerErrors = validateRegisterData(data);
  next();
}

module.exports = { validateRegister, validateRegisterData, SITE_NAME, MIN_PASSWORD_LENGTH };
