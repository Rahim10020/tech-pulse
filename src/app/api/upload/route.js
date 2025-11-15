import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { put } from '@vercel/blob';
import { validateFileType, scanFileContent } from '@/lib/upload-security';

async function uploadHandler(request) {
  try {
    // 1. Vérifier l'authentification
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Non authentifié',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({
        success: false,
        error: 'Token invalide',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }

    // 2. Récupérer le fichier
    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image');

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Aucun fichier sélectionné',
        code: 'NO_FILE'
      }, { status: 400 });
    }

    // 3. Convertir le fichier en buffer et valider avec upload-security
    const originalName = typeof file.name === 'string' ? file.name : 'upload';
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validation stricte du type de fichier basée sur le contenu réel
    let validation;
    try {
      validation = await validateFileType(buffer, originalName);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code || 'VALIDATION_FAILED'
      }, { status: 400 });
    }

    // Scan de sécurité du contenu
    try {
      await scanFileContent(buffer, originalName);
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code || 'SECURITY_SCAN_FAILED'
      }, { status: 400 });
    }

    // 4. Nom de fichier sécurisé
    const mimeType = validation.mimeType;
    const size = buffer.length;
    const ext = validation.extension;
    const safeBase = originalName
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
    const nameNoExt = ext ? safeBase.slice(0, -(ext.length + 1)) : safeBase;
    const unique = `${nameNoExt}-${decoded.userId}-${Date.now()}`;
    const fileName = ext ? `${unique}.${ext}` : unique;

    // 5. Upload vers Vercel Blob (utilise le buffer validé)
    const { url } = await put(`articles/${fileName}`, buffer, { access: 'public', contentType: mimeType });

    return NextResponse.json({
      success: true,
      fileUrl: url,
      fileName,
      originalName,
      fileType: mimeType,
      fileSize: size,
      fileSizeMB: Number(sizeMB.toFixed(2)),
      message: 'Fichier uploadé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur upload sécurisé:', error);

    // Gérer les erreurs de sécurité spécifiquement
    if (error.name === 'SecurityError') {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        type: 'security'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Erreur lors de l\'upload du fichier',
      code: 'UPLOAD_ERROR'
    }, { status: 500 });
  }
}

// Appliquer le rate limiting
export const POST = withRateLimit('upload')(uploadHandler);

// GET pour obtenir les infos de sécurité
export async function GET() {
  return NextResponse.json({
    security: {
      maxFileSize: { images: '5MB', gifs: '10MB', videos: '50MB' },
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'],
      features: [
        'Validation stricte des types MIME',
        'Noms de fichiers sécurisés',
        'Rate limiting (10 uploads/minute)'
      ]
    }
  });
}
