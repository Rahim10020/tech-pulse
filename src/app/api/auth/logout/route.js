// ========================================
// 3. MODIFIER src/app/api/auth/logout/route.js
// ========================================

import { NextResponse } from 'next/server';
import { blacklistToken } from '@/lib/auth';

export async function POST(request) {
  try {
    // Récupérer le token avant de le supprimer
    const token = request.cookies.get('token')?.value;
    
    // Ajouter le token à la blacklist si disponible
    if (token) {
      blacklistToken(token);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
      code: 'LOGOUT_SUCCESS'
    });

    // Supprimer le cookie de token avec toutes les options de sécurité
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      expires: new Date(0) // Expirer immédiatement
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    
    // Même en cas d'erreur, supprimer le cookie
    const response = NextResponse.json({
      success: false,
      message: 'Erreur lors de la déconnexion',
      code: 'LOGOUT_ERROR'
    }, { status: 500 });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  }
}