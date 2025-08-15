// ========================================
// 6. MODIFIER src/app/api/contact/route.js
// ========================================

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";
import { withRateLimit } from "@/lib/rate-limit";

const prisma = new PrismaClient();

async function contactHandler(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation des données
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { 
          error: "Tous les champs sont requis",
          code: "MISSING_FIELDS"
        },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          error: "Format d'email invalide",
          code: "INVALID_EMAIL"
        },
        { status: 400 }
      );
    }

    // Protection anti-spam basique
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'urgent', 'click here'];
    const messageText = (name + email + subject + message).toLowerCase();
    
    if (spamKeywords.some(keyword => messageText.includes(keyword))) {
      return NextResponse.json(
        { 
          error: "Message détecté comme spam",
          code: "SPAM_DETECTED"
        },
        { status: 400 }
      );
    }

    // Créer le message de contact
    const contact = await prisma.contact.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        isRead: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Message envoyé avec succès",
      id: contact.id,
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de l'envoi du message",
        code: "SEND_ERROR"
      },
      { status: 500 }
    );
  }
}

// ✅ APPLIQUER LE RATE LIMITING STRICT
export const POST = withRateLimit('contact')(contactHandler);

// GET - Récupérer les messages de contact (admin seulement)
export async function GET(request) {
  try {
    // Vérifier l'authentification admin via cookies
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Token d'authentification requis" },
        { status: 401 }
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
        { status: 403 }
      );
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const unreadOnly = searchParams.get("unread") === "true";
    const search = searchParams.get("search");

    // Si on veut juste le nombre de non lus, optimiser la requête
    if (unreadOnly && limit === 1) {
      const unreadCount = await prisma.contact.count({
        where: { isRead: false },
      });

      return NextResponse.json({
        unreadCount,
        messages: [],
      });
    }

    const skip = (page - 1) * limit;

    // Construire la condition where
    let where = {};

    if (unreadOnly) {
      where.isRead = false;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { subject: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    // Récupérer les messages avec pagination
    const [contacts, totalCount, unreadCount] = await Promise.all([
      prisma.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contact.count({ where }),
      prisma.contact.count({ where: { isRead: false } }), // Toujours compter les non lus
    ]);

    return NextResponse.json({
      success: true,
      messages: contacts,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
      },
      unreadCount, // Toujours retourner le nombre de non lus
      totalCount,
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des messages" },
      { status: 500 }
    );
  }
}
