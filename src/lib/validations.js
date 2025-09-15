/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email format is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password based on security requirements
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates a username based on format and length requirements
 * @param {string} username - The username to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateUsername = (username) => {
  const errors = [];

  if (username.length < 3) {
    errors.push('Le nom d\'utilisateur doit contenir au moins 3 caractères');
  }

  if (username.length > 20) {
    errors.push('Le nom d\'utilisateur doit contenir moins de 20 caractères');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};