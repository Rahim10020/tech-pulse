// app/api/auth/signup/route.js - API Route pour l'inscription CORRIGÉE
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { createUser } from '@/lib/auth-db';

export async function POST(request) {
  try {
    const { name, username, email, password } = await request.json();

    // Validation des données
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Validation du username (alphanumerique, tirets, underscores)
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username) || username.length < 3) {
      return NextResponse.json(
        { error: 'Le nom d\'utilisateur doit contenir au moins 3 caractères alphanumériques' },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    // Créer l'utilisateur dans PostgreSQL
    const result = await createUser({
      name,
      username,
      email,
      password
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const user = result.user;

    // Créer le token JWT AVEC le rôle (par défaut 'reader')
    const token = createToken({ 
      userId: user.id, 
      email: user.email,
      username: user.username,
      role: user.role || 'reader' // ✅ AJOUTÉ: inclure le rôle dans le token
    });

    // Créer la réponse avec le token dans un cookie httpOnly
    const response = NextResponse.json({
      success: true,
      user,
      message: 'Compte créé avec succès'
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}