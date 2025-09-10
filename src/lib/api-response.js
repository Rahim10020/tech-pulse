// lib/api-response.js - Utilities for consistent API responses
import { NextResponse } from 'next/server';

// Standard success response
export function successResponse(data, message = null, status = 200) {
    const response = { success: true, ...data };
    if (message) response.message = message;
    return NextResponse.json(response, { status });
}

// Standard error response
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

// Validation error response
export function validationErrorResponse(error, code = 'VALIDATION_ERROR') {
    return errorResponse(error, code, 400);
}

// Authentication error response
export function authErrorResponse(error = 'Non authentifié', code = 'UNAUTHORIZED') {
    return errorResponse(error, code, 401);
}

// Authorization error response
export function forbiddenErrorResponse(error = 'Accès non autorisé', code = 'FORBIDDEN') {
    return errorResponse(error, code, 403);
}

// Not found error response
export function notFoundErrorResponse(error = 'Ressource non trouvée', code = 'NOT_FOUND') {
    return errorResponse(error, code, 404);
}