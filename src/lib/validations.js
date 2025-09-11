export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

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