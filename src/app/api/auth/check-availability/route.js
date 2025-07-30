// app/api/auth/check-availability/route.js - Vérifier disponibilité email/username
import { NextResponse } from 'next/server';
import { isEmailAvailable, isUsernameAvailable } from '@/lib/auth-db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const username = searchParams.get('username');

    if (email) {
      const available = await isEmailAvailable(email);
      return NextResponse.json({ available });
    }

    if (username) {
      const available = await isUsernameAvailable(username);
      return NextResponse.json({ available });
    }

    return NextResponse.json(
      { error: 'Email ou username requis' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}