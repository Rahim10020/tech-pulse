// app/api/auth/profile/route.js - Mise à jour du profil
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateUserProfile } from '@/lib/auth-db';

export async function PUT(request) {
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

    const profileData = await request.json();
    const result = await updateUserProfile(decoded.userId, profileData);

    if (result.success) {
      return NextResponse.json({
        success: true,
        user: result.user,
        message: 'Profil mis à jour avec succès'
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}