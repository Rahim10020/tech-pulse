// app/api/upload/route.js - Route d'upload améliorée pour images/vidéos/GIFs
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

// Configuration des types de fichiers supportés
const MEDIA_TYPES = {
  images: {
    types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'images'
  },
  videos: {
    types: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
    maxSize: 50 * 1024 * 1024, // 50MB
    folder: 'videos'
  },
  gifs: {
    types: ['image/gif'],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'gifs'
  }
};

function getMediaCategory(fileType) {
  if (fileType === 'image/gif') return 'gifs';
  if (fileType.startsWith('video/')) return 'videos';
  if (fileType.startsWith('image/')) return 'images';
  return null;
}

function getAllowedTypes() {
  return [
    ...MEDIA_TYPES.images.types,
    ...MEDIA_TYPES.videos.types
  ];
}

function getMaxSize(category) {
  return MEDIA_TYPES[category]?.maxSize || MEDIA_TYPES.images.maxSize;
}

export async function POST(request) {
  try {
    // Vérifier l'authentification
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

    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image'); // Support des deux noms

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier sélectionné' },
        { status: 400 }
      );
    }

    // Déterminer la catégorie du média
    const mediaCategory = getMediaCategory(file.type);
    if (!mediaCategory) {
      return NextResponse.json(
        { 
          error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP, GIF, MP4, WebM ou OGG.',
          supportedTypes: getAllowedTypes()
        },
        { status: 400 }
      );
    }

    // Vérifier la taille selon la catégorie
    const maxSize = getMaxSize(mediaCategory);
    if (file.size > maxSize) {
      const maxSizeMB = Math.round(maxSize / (1024 * 1024));
      return NextResponse.json(
        { error: `Le fichier est trop volumineux. Taille maximum pour ${mediaCategory}: ${maxSizeMB}MB.` },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;

    // Créer le dossier approprié
    const mediaFolder = MEDIA_TYPES[mediaCategory].folder;
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'articles', mediaFolder);
    
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Le dossier existe déjà, c'est ok
    }

    // Convertir le fichier en buffer et l'écrire
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, fileName);
    
    await writeFile(filePath, buffer);

    // Retourner les informations du fichier
    const fileUrl = `/uploads/articles/${mediaFolder}/${fileName}`;
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName,
      originalName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileSizeMB: parseFloat(fileSizeMB),
      mediaCategory,
      message: `${mediaCategory === 'videos' ? 'Vidéo' : mediaCategory === 'gifs' ? 'GIF' : 'Image'} uploadé${mediaCategory === 'videos' ? 'e' : ''} avec succès`
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}

// Route GET pour obtenir les informations sur les types supportés
export async function GET() {
  return NextResponse.json({
    supportedTypes: getAllowedTypes(),
    categories: {
      images: {
        types: MEDIA_TYPES.images.types,
        maxSizeMB: MEDIA_TYPES.images.maxSize / (1024 * 1024),
        description: 'Images (JPG, PNG, WebP)'
      },
      gifs: {
        types: MEDIA_TYPES.gifs.types,
        maxSizeMB: MEDIA_TYPES.gifs.maxSize / (1024 * 1024),
        description: 'GIFs animés'
      },
      videos: {
        types: MEDIA_TYPES.videos.types,
        maxSizeMB: MEDIA_TYPES.videos.maxSize / (1024 * 1024),
        description: 'Vidéos (MP4, WebM, OGG)'
      }
    }
  });
}