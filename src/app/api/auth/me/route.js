import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getUserById } from '@/lib/auth-db';

/**
 * GET /api/auth/me
 * Retrieves the current authenticated user's information.
 *
 * @param {Request} request - The request object with JWT token in cookies
 * @returns {NextResponse} Response with current user data
 *
 * Requires: httpOnly cookie 'token' with valid JWT
 *
 * Response (success):
 * - success: boolean
 * - user: object - Current user data
 *
 * Response (error):
 * - error: string - Error message
 *
 * Status codes: 200 (success), 401 (unauthenticated), 404 (user not found), 500 (server error)
 */
export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // Récupérer les données utilisateur depuis PostgreSQL
    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}