// src/app/api/admin/stats/route.js - API pour les statistiques admin
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';

const prisma = new PrismaClient();

// GET - Récupérer les statistiques (admin seulement)
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

    // Récupérer toutes les statistiques en parallèle
    const [
      totalUsers,
      totalArticles,
      totalViews,
      totalLikes,
      totalComments,
      unreadMessages
    ] = await Promise.all([
      prisma.user.count(),
      prisma.article.count(),
      prisma.article.aggregate({
        _sum: { views: true }
      }),
      prisma.like.count(),
      prisma.comment.count(),
      prisma.contact.count({
        where: { isRead: false }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalViews: totalViews._sum.views || 0,
      totalLikes,
      totalComments,
      unreadMessages
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 