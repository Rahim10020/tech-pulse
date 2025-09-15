import { fileTypeFromBuffer } from 'file-type';
import sanitizeFilename from 'sanitize-filename';
import mime from 'mime-types';
import sharp from 'sharp';
import { createHash } from 'crypto';

// Configuration de sécurité stricte
const SECURITY_CONFIG = {
  // Types MIME autorisés avec leurs signatures
  allowedTypes: {
    // Images
    'image/jpeg': {
      extensions: ['jpg', 'jpeg'],
      maxSize: 5 * 1024 * 1024, // 5MB
      category: 'image',
      needsOptimization: true
    },
    'image/png': {
      extensions: ['png'],
      maxSize: 5 * 1024 * 1024, // 5MB
      category: 'image',
      needsOptimization: true
    },
    'image/webp': {
      extensions: ['webp'],
      maxSize: 5 * 1024 * 1024, // 5MB
      category: 'image',
      needsOptimization: true
    },
    'image/gif': {
      extensions: ['gif'],
      maxSize: 10 * 1024 * 1024, // 10MB
      category: 'gif',
      needsOptimization: false // Préserver l'animation
    },

    // Vidéos
    'video/mp4': {
      extensions: ['mp4'],
      maxSize: 50 * 1024 * 1024, // 50MB
      category: 'video',
      needsOptimization: false
    },
    'video/webm': {
      extensions: ['webm'],
      maxSize: 50 * 1024 * 1024, // 50MB
      category: 'video',
      needsOptimization: false
    }
  },

  // Extensions dangereuses à rejeter absolument
  dangerousExtensions: [
    'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar',
    'php', 'asp', 'aspx', 'jsp', 'pl', 'py', 'rb', 'sh', 'ps1',
    'msi', 'deb', 'rpm', 'dmg', 'pkg', 'app', 'htaccess'
  ],

  // Signatures de fichiers malveillants (magic bytes)
  dangerousSignatures: [
    'MZ', // Exécutables Windows
    '#!/bin/', // Scripts Unix
    '<?php', // Scripts PHP
    '<script', // JavaScript
    'PK', // Archives ZIP (peuvent contenir des exécutables)
  ],

  // Noms de fichiers suspects
  suspiciousNames: [
    'index', 'config', 'admin', 'login', 'password', 'secret',
    'htaccess', 'htpasswd', 'robots', 'sitemap'
  ],

  // Taille maximale absolue (100MB)
  absoluteMaxSize: 100 * 1024 * 1024
};

// Classe pour les erreurs de sécurité
class SecurityError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'SecurityError';
    this.code = code;
  }
}

// Validation stricte du type de fichier
export async function validateFileType(buffer, originalName) {
  try {
    // 1. Détecter le vrai type MIME depuis le contenu
    const detectedType = await fileTypeFromBuffer(buffer);

    if (!detectedType) {
      throw new SecurityError(
        'Type de fichier non reconnu ou corrompu',
        'UNKNOWN_FILE_TYPE'
      );
    }

    // 2. Vérifier que le type est autorisé
    const config = SECURITY_CONFIG.allowedTypes[detectedType.mime];
    if (!config) {
      throw new SecurityError(
        `Type de fichier non autorisé: ${detectedType.mime}`,
        'FORBIDDEN_FILE_TYPE'
      );
    }

    // 3. Vérifier l'extension du nom de fichier
    const extension = originalName.split('.').pop()?.toLowerCase();
    const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    if (detectedType.mime.startsWith('image/')) {
      if (!extension || !allowedImageExtensions.includes(extension)) {
        throw new SecurityError(
          `Extension de fichier non correspondante pour image: .${extension}`,
          'MISMATCHED_EXTENSION'
        );
      }
    } else {
      if (!extension || !config.extensions.includes(extension)) {
        throw new SecurityError(
          `Extension de fichier non correspondante: .${extension}`,
          'MISMATCHED_EXTENSION'
        );
      }
    }

    // 4. Vérifier la taille
    if (buffer.length > config.maxSize) {
      const maxSizeMB = Math.round(config.maxSize / (1024 * 1024));
      throw new SecurityError(
        `Fichier trop volumineux. Maximum: ${maxSizeMB}MB`,
        'FILE_TOO_LARGE'
      );
    }

    // 5. Vérifier la taille absolue
    if (buffer.length > SECURITY_CONFIG.absoluteMaxSize) {
      throw new SecurityError(
        'Fichier dépasse la taille maximale absolue (100MB)',
        'ABSOLUTE_SIZE_EXCEEDED'
      );
    }

    return {
      mimeType: detectedType.mime,
      extension: detectedType.ext,
      config: config,
      size: buffer.length
    };

  } catch (error) {
    if (error instanceof SecurityError) {
      throw error;
    }
    throw new SecurityError(
      'Erreur lors de la validation du fichier',
      'VALIDATION_ERROR'
    );
  }
}

// Scan de sécurité du contenu
export async function scanFileContent(buffer, filename) {
  const content = buffer.toString('utf8', 0, Math.min(buffer.length, 1024));
  const binaryContent = buffer.toString('hex', 0, Math.min(buffer.length, 100));

  // 1. Vérifier les signatures dangereuses
  for (const signature of SECURITY_CONFIG.dangerousSignatures) {
    if (content.includes(signature) || binaryContent.includes(signature)) {
      throw new SecurityError(
        'Signature de fichier malveillant détectée',
        'MALICIOUS_SIGNATURE'
      );
    }
  }

  // 2. Vérifier les scripts embarqués
  const scriptPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi
  ];

  for (const pattern of scriptPatterns) {
    if (pattern.test(content)) {
      throw new SecurityError(
        'Code script détecté dans le fichier',
        'SCRIPT_DETECTED'
      );
    }
  }

  // 3. Vérifier les noms suspects
  const baseName = filename.split('.')[0].toLowerCase();
  if (SECURITY_CONFIG.suspiciousNames.includes(baseName)) {
    throw new SecurityError(
      'Nom de fichier suspect détecté',
      'SUSPICIOUS_FILENAME'
    );
  }

  // 4. Vérifier les extensions cachées
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    throw new SecurityError(
      'Caractères dangereux dans le nom de fichier',
      'DANGEROUS_FILENAME'
    );
  }

  return true;
}

// Optimisation d'images avec Sharp
export async function optimizeImage(buffer, mimeType) {
  try {
    let sharpInstance = sharp(buffer);

    // Obtenir les métadonnées
    const metadata = await sharpInstance.metadata();

    // Limiter les dimensions (protection contre les images gigantesques)
    const maxWidth = 2048;
    const maxHeight = 2048;

    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Optimiser selon le type
    switch (mimeType) {
      case 'image/jpeg':
        return await sharpInstance
          .jpeg({
            quality: 85,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();

      case 'image/png':
        return await sharpInstance
          .png({
            compressionLevel: 8,
            adaptiveFiltering: true
          })
          .toBuffer();

      case 'image/webp':
        return await sharpInstance
          .webp({
            quality: 85,
            effort: 6
          })
          .toBuffer();

      default:
        return buffer; // Pas d'optimisation pour les autres types
    }

  } catch (error) {
    console.warn('Erreur optimisation image:', error);
    return buffer; // Retourner l'original en cas d'erreur
  }
}

// Génération de nom de fichier sécurisé
export function generateSecureFilename(originalName, userId = null) {
  // 1. Nettoyer le nom original
  const cleanName = sanitizeFilename(originalName, { replacement: '_' });

  // 2. Extraire l'extension
  const parts = cleanName.split('.');
  const extension = parts.pop()?.toLowerCase() || '';
  const basename = parts.join('.').substring(0, 100); // Limiter la longueur

  // 3. Vérifier l'extension
  const ext = extension.toLowerCase();
  if (SECURITY_CONFIG.dangerousExtensions.includes(ext)) {
    throw new SecurityError(
      `Extension dangereuse détectée: .${ext}`,
      'DANGEROUS_EXTENSION'
    );
  }

  // 4. Générer un nom unique et sécurisé
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const userPrefix = userId ? `u${userId}_` : '';

  // 5. Créer le hash pour éviter les doublons
  const hash = createHash('md5')
    .update(`${userPrefix}${basename}${timestamp}${randomString}`)
    .digest('hex')
    .substring(0, 8);

  return `${timestamp}_${hash}_${basename.replace(/[^a-zA-Z0-9]/g, '_')}.${extension}`;
}

// Vérification de quota utilisateur (optionnel)
export async function checkUserQuota(userId, fileSize) {
  // Quota par utilisateur : 100MB
  const USER_QUOTA = 100 * 1024 * 1024;

  try {
    // Calculer l'usage actuel (tu peux implémenter avec Prisma)
    // const currentUsage = await calculateUserUsage(userId);
    const currentUsage = 0; // Placeholder

    if (currentUsage + fileSize > USER_QUOTA) {
      throw new SecurityError(
        'Quota de stockage dépassé (100MB par utilisateur)',
        'QUOTA_EXCEEDED'
      );
    }

    return true;
  } catch (error) {
    if (error instanceof SecurityError) {
      throw error;
    }
    return true; // Continuer en cas d'erreur de calcul
  }
}