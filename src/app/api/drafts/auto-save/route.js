
// ==========================================
// 2. app/api/drafts/auto-save/route.js - CORRIGÉ
// ==========================================
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

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const { existingDraftId, ...draftData } = await request.json();

    // L'auto-save sauvegarde TOUJOURS en brouillon
    const result = await updateOrCreateDraft(
      {
        ...draftData,
        authorId: decoded.userId
      },
      existingDraftId ? parseInt(existingDraftId) : null
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        article: result.article,
        isNew: result.isNew || false,
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