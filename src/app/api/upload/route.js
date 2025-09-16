import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { put } from '@vercel/blob';

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

    // 3. Validation basique et nom de fichier sécurisé
    const mimeType = file.type ?? 'application/octet-stream';
    const size = typeof file.size === 'number' ? file.size : 0;
    const originalName = typeof file.name === 'string' ? file.name : 'upload';

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    if (!allowed.includes(mimeType)) {
      return NextResponse.json({ success: false, error: 'Type de fichier non autorisé', code: 'INVALID_TYPE' }, { status: 400 });
    }

    const sizeMB = size / (1024 * 1024);
    if (mimeType.startsWith('image/') && mimeType !== 'image/gif' && sizeMB > 5) {
      return NextResponse.json({ success: false, error: 'Image trop lourde (>5MB)', code: 'FILE_TOO_LARGE' }, { status: 400 });
    }
    if (mimeType === 'image/gif' && sizeMB > 10) {
      return NextResponse.json({ success: false, error: 'GIF trop lourd (>10MB)', code: 'FILE_TOO_LARGE' }, { status: 400 });
    }
    if (mimeType.startsWith('video/') && sizeMB > 50) {
      return NextResponse.json({ success: false, error: 'Vidéo trop lourde (>50MB)', code: 'FILE_TOO_LARGE' }, { status: 400 });
    }

    const safeBase = originalName
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80);
    const ext = safeBase.includes('.') ? safeBase.split('.').pop() : '';
    const nameNoExt = ext ? safeBase.slice(0, -(ext.length + 1)) : safeBase;
    const unique = `${nameNoExt}-${decoded.userId}-${Date.now()}`;
    const fileName = ext ? `${unique}.${ext}` : unique;

    // 4. Upload direct vers Vercel Blob (public)
    const { url } = await put(`articles/${fileName}`, file, { access: 'public', contentType: mimeType });

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
