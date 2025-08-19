// src/app/api/settings/route.js - API publique pour les paramètres du site
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les paramètres publics du site
export async function GET() {
  try {
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

    // Retourner seulement les paramètres publics
    return NextResponse.json({
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteUrl: settings.siteUrl,
      contactEmail: settings.contactEmail,
      contactPhone: settings.contactPhone,
      contactAddress: settings.contactAddress,
      socialTwitter: settings.socialTwitter,
      socialLinkedin: settings.socialLinkedin,
      socialGithub: settings.socialGithub,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      seoKeywords: settings.seoKeywords,
      maintenanceMode: settings.maintenanceMode,
      allowComments: settings.allowComments,
      allowRegistration: settings.allowRegistration
    });

  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
} 