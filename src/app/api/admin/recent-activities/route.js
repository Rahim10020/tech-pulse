// src/app/api/admin/recent-activities/route.js - API pour les activités récentes
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    // Vérifier l'authentification admin
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 },
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || !isAdmin(user)) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 },
      );
    }

    // Récupérer les 10 derniers utilisateurs inscrits
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    // Récupérer les 10 derniers articles publiés
    const recentArticles = await prisma.article.findMany({
      take: 10,
      orderBy: { publishedAt: "desc" },
      where: { published: true },
      select: {
        id: true,
        title: true,
        publishedAt: true,
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    // Récupérer les 10 derniers messages de contact
    const recentMessages = await prisma.contact.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        createdAt: true,
      },
    });

    // Transformer les données en activités
    const activities = [
      ...recentUsers.map((user) => ({
        id: `user-${user.id}`,
        type: "user_signup",
        description: `Nouvel utilisateur inscrit`,
        details: `${user.username} (${user.email})`,
        timestamp: user.createdAt,
        color: "green",
      })),
      ...recentArticles.map((article) => ({
        id: `article-${article.id}`,
        type: "article_published",
        description: `Article publié`,
        details: `"${article.title}" par ${article.author.username}`,
        timestamp: article.publishedAt,
        color: "blue",
      })),
      ...recentMessages.map((message) => ({
        id: `message-${message.id}`,
        type: "message_received",
        description: `Nouveau message de contact`,
        details: `${message.name}: "${message.subject}"`,
        timestamp: message.createdAt,
        color: "orange",
      })),
    ];

    // Trier par date décroissante et garder les 5 dernières
    const sortedActivities = activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    return NextResponse.json({ activities: sortedActivities });
  } catch (error) {
    console.error("Erreur lors de la récupération des activités:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
