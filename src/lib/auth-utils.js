// Authentication utilities

/**
 * Generate a secure 6-digit code for password reset
 * @returns {string} 6-digit numeric code
 */
export function generatePasswordResetCode() {
    // Generate a random 6-digit number
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Ensure it's exactly 6 digits (padding with leading zeros if needed)
    return code.padStart(6, '0');
}

/**
 * Generate a secure token for password reset (fallback)
 * @returns {string} Random token
 */
export function generatePasswordResetToken() {
    return require('crypto').randomBytes(32).toString('hex');
}

/**
 * Check if a code/token has expired
 * @param {Date} expiresAt - Expiration date
 * @returns {boolean} True if expired
 */
export function isExpired(expiresAt) {
    return new Date() > new Date(expiresAt);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}