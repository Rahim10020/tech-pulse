// app/api/auth/login/route.js - Version PostgreSQL
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { verifyCredentials } from '@/lib/auth-db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation des données
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Vérifier les identifiants dans PostgreSQL
    const result = await verifyCredentials(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    const user = result.user;

    // Créer le token JWT
    const token = createToken({ 
      userId: user.id, 
      email: user.email,
      username: user.username
    });

    // Créer la réponse avec le token dans un cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user,
      message: 'Connexion réussie'
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 jours
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}