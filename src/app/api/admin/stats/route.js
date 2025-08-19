// src/app/api/admin/stats/route.js - API pour les statistiques admin CORRIGÉE
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les statistiques (admin seulement)
export async function GET(request) {
  try {
    // Vérifier l'authentification admin via cookies (pas Authorization header)
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Token d\'authentification requis' },
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
      totalPublishedArticles,
      totalDrafts,
      totalViews,
      totalLikes,
      totalComments,
      unreadMessages,
      totalMessages,
      recentActivity
    ] = await Promise.all([
      // Nombre total d'utilisateurs
      prisma.user.count(),
      
      // Nombre total d'articles (publiés et brouillons)
      prisma.article.count(),
      
      // Nombre d'articles publiés seulement
      prisma.article.count({
        where: { published: true }
      }),
      
      // Nombre de brouillons
      prisma.article.count({
        where: { published: false }
      }),
      
      // Total des vues
      prisma.article.aggregate({
        _sum: { views: true },
        where: { published: true }
      }),
      
      // Total des likes
      prisma.like.count(),
      
      // Total des commentaires
      prisma.comment.count(),
      
      // Messages de contact non lus
      prisma.contact.count({
        where: { isRead: false }
      }),
      
      // Total des messages de contact
      prisma.contact.count(),
      
      // Activité récente (derniers utilisateurs inscrits)
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
          role: true
        }
      })
    ]);

    // Statistiques supplémentaires
    const [
      articlesThisMonth,
      usersThisMonth,
      messagesThisMonth
    ] = await Promise.all([
      // Articles publiés ce mois
      prisma.article.count({
        where: {
          published: true,
          publishedAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Nouveaux utilisateurs ce mois
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      
      // Messages reçus ce mois
      prisma.contact.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);

    return NextResponse.json({
      // Statistiques principales
      totalUsers,
      totalArticles,
      totalPublishedArticles,
      totalDrafts,
      totalViews: totalViews._sum.views || 0,
      totalLikes,
      totalComments,
      unreadMessages,
      totalMessages,
      
      // Statistiques mensuelles
      articlesThisMonth,
      usersThisMonth,
      messagesThisMonth,
      
      // Activité récente
      recentActivity,
      
      // Données pour le dashboard
      stats: {
        users: {
          total: totalUsers,
          thisMonth: usersThisMonth
        },
        articles: {
          total: totalArticles,
          published: totalPublishedArticles,
          drafts: totalDrafts,
          thisMonth: articlesThisMonth
        },
        engagement: {
          totalViews: totalViews._sum.views || 0,
          totalLikes,
          totalComments
        },
        messages: {
          total: totalMessages,
          unread: unreadMessages,
          thisMonth: messagesThisMonth
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}