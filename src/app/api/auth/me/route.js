// app/api/auth/me/route.js - API Route pour obtenir l'utilisateur connecté
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    // TODO: Récupérer les données utilisateur depuis votre base de données
    const user = {
      id: decoded.userId,
      name: 'Test User',
      email: decoded.email,
      username: 'testuser'
    };

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