// app/api/auth/login/route.js - API Route pour la connexion (exemple)
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

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

    // TODO: Vérifier les identifiants dans votre base de données
    // Pour l'exemple, on accepte email: test@test.com, password: 123456
    if (email === 'test@test.com' && password === '123456') {
      const user = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        username: 'testuser'
      };

      // Créer le token JWT
      const token = createToken({ 
        userId: user.id, 
        email: user.email 
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
    } else {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}