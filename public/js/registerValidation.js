/**
 * Validación del formulario de registro en el cliente.
 * Replica las reglas del middleware del servidor e impide el envío si hay errores.
 */
(function () {
  const SITE_NAME = 'Mi Ecommerce';
  const MIN_PASSWORD_LENGTH = 8;
  const FORBIDDEN_PASSWORDS = ['password', '1234', 'qwerty'];
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const form = document.getElementById('register-form');

  if (!form) {
    return;
  }

  /**
   * Normaliza texto para comparaciones (sin acentos, espacios ni mayúsculas).
   * @param {string} value Texto a normalizar.
   * @returns {string} Texto normalizado.
   */
  function normalizeText(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  /**
   * Valida un campo obligatorio sin espacios al inicio o al final.
   * @param {string} value Valor ingresado.
   * @param {string} label Etiqueta del campo.
   * @returns {string} Mensaje de error o cadena vacía.
   */
  function validateRequiredName(value, label) {
    if (!value.trim()) {
      return label + ' es obligatorio.';
    }

    if (value !== value.trim()) {
      return label + ' no debe tener espacios al inicio o al final.';
    }

    return '';
  }

  /**
   * Valida el email ingresado.
   * @param {string} value Email ingresado.
   * @returns {string} Mensaje de error o cadena vacía.
   */
  function validateEmail(value) {
    if (!value.trim()) {
      return 'El email es obligatorio.';
    }

    if (!EMAIL_PATTERN.test(value.trim())) {
      return 'El email debe tener un formato válido.';
    }

    return '';
  }

  /**
   * Valida la contraseña según las reglas del sprint.
   * @param {string} password Contraseña ingresada.
   * @param {{ firstName: string, lastName: string, email: string }} context Datos del formulario.
   * @returns {string} Mensaje de error o cadena vacía.
   */
  function validatePassword(password, context) {
    if (password.length < MIN_PASSWORD_LENGTH) {
      return 'La contraseña debe tener al menos ' + MIN_PASSWORD_LENGTH + ' caracteres.';
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
    const forbiddenValues = FORBIDDEN_PASSWORDS.concat([
      SITE_NAME,
      context.firstName,
      context.lastName,
      context.email,
    ])
      .map(normalizeText)
      .filter(Boolean);

    const isForbidden = forbiddenValues.some(function (forbidden) {
      return normalizedPassword === forbidden || normalizedPassword.indexOf(forbidden) !== -1;
    });

    if (isForbidden) {
      return 'La contraseña no puede contener valores comunes, el nombre del sitio, tu nombre ni tu email.';
    }

    return '';
  }

  /**
   * Muestra el mensaje de error de un campo.
   * @param {string} field Nombre del campo.
   * @param {string} message Mensaje a mostrar.
   * @returns {void}
   */
  function showError(field, message) {
    const target = form.querySelector('[data-error-for="' + field + '"]');

    if (target) {
      target.textContent = message;
    }
  }

  form.addEventListener('submit', function (event) {
    const values = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
    };

    const errors = {
      firstName: validateRequiredName(values.firstName, 'El nombre'),
      lastName: validateRequiredName(values.lastName, 'El apellido'),
      email: validateEmail(values.email),
      password: validatePassword(values.password, values),
    };

    Object.keys(errors).forEach(function (field) {
      showError(field, errors[field]);
    });

    const hasErrors = Object.keys(errors).some(function (field) {
      return errors[field] !== '';
    });

    if (hasErrors) {
      event.preventDefault();
    }
  });
})();
