// app/api/drafts/route.js - Route API pour gérer les brouillons
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { getDraftsByAuthor, publishDraft, updateDraft } from '@/lib/articles';
import { validatePaginationParams } from '@/lib/validation-utils';

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

    const { searchParams } = new URL(request.url);
    const { limit } = validatePaginationParams(searchParams);

    const drafts = await getDraftsByAuthor(decoded.userId, limit);

    return NextResponse.json({
      success: true,
      drafts
    });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des brouillons' },
      { status: 500 }
    );
  }
}