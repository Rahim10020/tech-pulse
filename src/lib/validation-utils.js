/**
 * Validation utilities for API parameters
 */

/**
 * Safely parse and validate pagination parameters
 * @param {URLSearchParams} searchParams - URL search parameters
 * @param {Object} defaults - Default values for page and limit
 * @returns {Object} Validated pagination parameters
 */
export function validatePaginationParams(searchParams, defaults = { page: 1, limit: 10 }) {
  const page = Math.max(1, parseInt(searchParams.get('page')) || defaults.page);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit')) || defaults.limit));

  return { page, limit };
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function validateEmail(email) {
  // Improved regex that requires at least 2 characters in TLD
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitize and validate string input
 * @param {string} input - Input to sanitize
 * @param {number} maxLength - Maximum length allowed
 * @returns {string|null} Sanitized string or null if invalid
 */
export function sanitizeString(input, maxLength = 1000) {
  if (typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (trimmed.length === 0 || trimmed.length > maxLength) return null;

  return trimmed;
}

/**
 * Validate positive integer
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value (default: 1)
 * @param {number} max - Maximum value (default: Number.MAX_SAFE_INTEGER)
 * @returns {number|null} Validated integer or null
 */
export function validatePositiveInt(value, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const parsed = parseInt(value);
  if (isNaN(parsed) || parsed < min || parsed > max) {
    return null;
  }
  return parsed;
}
