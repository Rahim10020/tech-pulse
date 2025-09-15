/**
 * Utilities for consistent API responses
 */
import { NextResponse } from 'next/server';

/**
 * Creates a standard success response
 * @param {Object} data - The data to include in the response
 * @param {string|null} message - Optional success message
 * @param {number} status - HTTP status code (default: 200)
 * @returns {NextResponse} The formatted success response
 */
export function successResponse(data, message = null, status = 200) {
    const response = { success: true, ...data };
    if (message) response.message = message;
    return NextResponse.json(response, { status });
}

/**
 * Creates a standard error response
 * @param {string} error - The error message
 * @param {string} code - The error code (default: 'INTERNAL_ERROR')
 * @param {number} status - HTTP status code (default: 500)
 * @returns {NextResponse} The formatted error response
 */
export function errorResponse(error, code = 'INTERNAL_ERROR', status = 500) {
    return NextResponse.json(
        {
            success: false,
            error,
            code
        },
        { status }
    );
}

/**
 * Creates a validation error response
 * @param {string} error - The validation error message
 * @param {string} code - The error code (default: 'VALIDATION_ERROR')
 * @returns {NextResponse} The formatted validation error response
 */
export function validationErrorResponse(error, code = 'VALIDATION_ERROR') {
    return errorResponse(error, code, 400);
}

/**
 * Creates an authentication error response
 * @param {string} error - The authentication error message (default: 'Non authentifié')
 * @param {string} code - The error code (default: 'UNAUTHORIZED')
 * @returns {NextResponse} The formatted authentication error response
 */
export function authErrorResponse(error = 'Non authentifié', code = 'UNAUTHORIZED') {
    return errorResponse(error, code, 401);
}

/**
 * Creates an authorization error response
 * @param {string} error - The authorization error message (default: 'Accès non autorisé')
 * @param {string} code - The error code (default: 'FORBIDDEN')
 * @returns {NextResponse} The formatted authorization error response
 */
export function forbiddenErrorResponse(error = 'Accès non autorisé', code = 'FORBIDDEN') {
    return errorResponse(error, code, 403);
}

/**
 * Creates a not found error response
 * @param {string} error - The not found error message (default: 'Ressource non trouvée')
 * @param {string} code - The error code (default: 'NOT_FOUND')
 * @returns {NextResponse} The formatted not found error response
 */
export function notFoundErrorResponse(error = 'Ressource non trouvée', code = 'NOT_FOUND') {
    return errorResponse(error, code, 404);
}