// app/api/upload/route.js - Route pour l'upload d'images
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { verifyToken } from '@/lib/auth';

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
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier sélectionné' },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté. Utilisez JPG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux. Taille maximum: 5MB.' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${extension}`;

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'articles');
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

    // Retourner l'URL publique
    const imageUrl = `/uploads/articles/${fileName}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      message: 'Image uploadée avec succès'
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'image' },
      { status: 500 }
    );
  }
}