// lib/api-auth.js - Authentication utilities for API routes
import { verifyToken } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';
import { prisma } from '@/lib/prisma';
import { authErrorResponse, forbiddenErrorResponse, errorResponse } from '@/lib/api-response';

// Extract and verify token from request
export async function getAuthenticatedUser(request) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        throw new Error('NO_TOKEN');
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
        throw new Error('INVALID_TOKEN');
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });

    if (!user) {
        throw new Error('USER_NOT_FOUND');
    }

    return user;
}

// Verify admin access
export async function requireAdmin(request) {
    try {
        const user = await getAuthenticatedUser(request);

        if (!isAdmin(user)) {
            throw new Error('NOT_ADMIN');
        }

        return user;
    } catch (error) {
        switch (error.message) {
            case 'NO_TOKEN':
                throw authErrorResponse('Token d\'authentification requis');
            case 'INVALID_TOKEN':
                throw authErrorResponse('Token invalide');
            case 'USER_NOT_FOUND':
                throw authErrorResponse('Utilisateur non trouvé');
            case 'NOT_ADMIN':
                throw forbiddenErrorResponse('Accès administrateur requis');
            default:
                throw error;
        }
    }
}

// Verify regular user access
export async function requireUser(request) {
    try {
        return await getAuthenticatedUser(request);
    } catch (error) {
        switch (error.message) {
            case 'NO_TOKEN':
                throw authErrorResponse('Token d\'authentification requis');
            case 'INVALID_TOKEN':
                throw authErrorResponse('Token invalide');
            case 'USER_NOT_FOUND':
                throw authErrorResponse('Utilisateur non trouvé');
            default:
                throw error;
        }
    }
}

// Higher-order function for authenticated routes
export function withAuth(handler, options = {}) {
    return async (request, ...args) => {
        try {
            const user = options.requireAdmin
                ? await requireAdmin(request)
                : await requireUser(request);

            // Add user to request object
            request.user = user;

            return await handler(request, ...args);
        } catch (error) {
            // If it's already a NextResponse, return it
            if (error && typeof error.json === 'function') {
                return error;
            }
            // Otherwise, return a generic error
            return errorResponse('Erreur d\'authentification', 'AUTH_ERROR', 500);
        }
    };
}

// Higher-order function for admin-only routes
export function withAdminAuth(handler) {
    return withAuth(handler, { requireAdmin: true });
}