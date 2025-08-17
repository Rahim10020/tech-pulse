// src/app/api/admin/settings/route.js - API pour les paramètres du site
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';

const prisma = new PrismaClient();

// GET - Récupérer les paramètres du site
export async function GET(request) {
  try {
    // Vérifier l'authentification admin
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    // Récupérer les paramètres (prendre le premier enregistrement ou créer par défaut)
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Créer des paramètres par défaut
      settings = await prisma.siteSettings.create({
        data: {
          siteName: 'pixelpulse',
          siteDescription: 'Blog technologique moderne',
          allowComments: true,
          allowRegistration: true,
          maintenanceMode: false
        }
      });
    }

    return NextResponse.json({
      settings
    });

  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour les paramètres du site
export async function PUT(request) {
  try {
    // Vérifier l'authentification admin
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
        { status: 401 }
      );
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const updateData = await request.json();

    // Récupérer les paramètres existants ou créer par défaut
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      // Créer de nouveaux paramètres
      settings = await prisma.siteSettings.create({
        data: {
          ...updateData,
          siteName: updateData.siteName || 'pixelpulse',
          allowComments: updateData.allowComments !== undefined ? updateData.allowComments : true,
          allowRegistration: updateData.allowRegistration !== undefined ? updateData.allowRegistration : true,
          maintenanceMode: updateData.maintenanceMode !== undefined ? updateData.maintenanceMode : false
        }
      });
    } else {
      // Mettre à jour les paramètres existants
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: updateData
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Paramètres mis à jour avec succès',
      settings
    });

  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
} 