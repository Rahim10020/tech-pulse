// app/api/drafts/auto-save/route.js - Route pour la sauvegarde automatique
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateOrCreateDraft } from '@/lib/articles';

export async function POST(request) {
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

    const { existingDraftId, ...articleData } = await request.json();

    // Utiliser updateOrCreateDraft au lieu de createArticle
    const result = await updateOrCreateDraft(
      {
        ...articleData,
        authorId: decoded.userId
      },
      existingDraftId ? parseInt(existingDraftId) : null
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        article: result.article,
        isNew: result.isNew,
        message: result.isNew ? 'Nouveau brouillon créé' : 'Brouillon mis à jour'
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in auto-save:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde automatique' },
      { status: 500 }
    );
  }
}