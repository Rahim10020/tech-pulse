// ========================================
// 3. MODIFIER src/app/api/upload/route.js
// ========================================

import { NextResponse } from 'next/server';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';
import { withRateLimit } from '@/lib/rate-limit';
import { 
  validateFileType, 
  scanFileContent, 
  optimizeImage, 
  generateSecureFilename,
  checkUserQuota 
} from '@/lib/upload-security';

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

    // 3. Convertir en buffer pour validation
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log(`🔍 Upload sécurisé: ${file.name} (${buffer.length} bytes) par user ${decoded.userId}`);

    // 4. VALIDATION DE SÉCURITÉ STRICTE
    
    // 4a. Vérifier le quota utilisateur
    await checkUserQuota(decoded.userId, buffer.length);
    
    // 4b. Valider le type de fichier
    const fileValidation = await validateFileType(buffer, file.name);
    
    // 4c. Scanner le contenu pour malware/scripts
    await scanFileContent(buffer, file.name);
    
    // 4d. Générer un nom de fichier sécurisé
    const secureFilename = generateSecureFilename(file.name, decoded.userId);

    // 5. TRAITEMENT DU FICHIER
    
    let processedBuffer = buffer;
    
    // 5a. Optimiser les images si nécessaire
    if (fileValidation.config.needsOptimization) {
      console.log('🖼️ Optimisation de l\'image...');
      processedBuffer = await optimizeImage(buffer, fileValidation.mimeType);
      console.log(`📊 Optimisation: ${buffer.length} → ${processedBuffer.length} bytes (${Math.round((1 - processedBuffer.length / buffer.length) * 100)}% de réduction)`);
    }

    // 6. STOCKAGE SÉCURISÉ
    
    // 6a. Créer le dossier de destination
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'articles', fileValidation.config.category);
    
    try {
      await access(uploadsDir);
    } catch {
      await mkdir(uploadsDir, { recursive: true });
      console.log(`📁 Dossier créé: ${uploadsDir}`);
    }

    // 6b. Écrire le fichier
    const filePath = join(uploadsDir, secureFilename);
    await writeFile(filePath, processedBuffer);

    // 7. RÉPONSE AVEC MÉTADONNÉES
    const fileUrl = `/uploads/articles/${fileValidation.config.category}/${secureFilename}`;
    const fileSizeMB = (processedBuffer.length / (1024 * 1024)).toFixed(2);

    console.log(`✅ Upload réussi: ${fileUrl}`);

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: secureFilename,
      originalName: file.name,
      fileType: fileValidation.mimeType,
      fileSize: processedBuffer.length,
      fileSizeMB: parseFloat(fileSizeMB),
      mediaCategory: fileValidation.config.category,
      optimized: fileValidation.config.needsOptimization,
      security: {
        scanned: true,
        validated: true,
        optimized: fileValidation.config.needsOptimization
      },
      message: `${fileValidation.config.category === 'video' ? 'Vidéo' : 
                fileValidation.config.category === 'gif' ? 'GIF' : 'Image'} uploadé${fileValidation.config.category === 'video' ? 'e' : ''} et sécurisé${fileValidation.config.category === 'video' ? 'e' : ''} avec succès`
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
      maxFileSize: {
        images: '5MB',
        gifs: '10MB', 
        videos: '50MB'
      },
      allowedTypes: Object.keys(SECURITY_CONFIG.allowedTypes),
      features: [
        'Validation stricte des types MIME',
        'Scan anti-malware',
        'Optimisation automatique des images',
        'Noms de fichiers sécurisés',
        'Quota utilisateur (100MB)',
        'Rate limiting (10 uploads/minute)'
      ]
    }
  });
}
