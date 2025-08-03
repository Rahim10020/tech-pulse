// src/app/api/admin/users/[id]/route.js - API pour modifier un utilisateur
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyJWT } from '@/lib/auth';
import { isAdmin } from '@/lib/auth-roles';

const prisma = new PrismaClient();

// PATCH - Modifier le rôle d'un utilisateur
export async function PATCH(request, { params }) {
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

    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!adminUser || !isAdmin(adminUser)) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 403 }
      );
    }

    const { role } = await request.json();
    const userId = parseInt(params.id);

    // Validation du rôle
    if (!['admin', 'reader'].includes(role)) {
      return NextResponse.json(
        { error: 'Rôle invalide. Doit être "admin" ou "reader"' },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Empêcher l'admin de se rétrograder lui-même
    if (userId === decoded.userId && role !== 'admin') {
      return NextResponse.json(
        { error: 'Vous ne pouvez pas modifier votre propre rôle d\'admin' },
        { status: 400 }
      );
    }

    // Mettre à jour le rôle
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        joinedAt: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Rôle de ${targetUser.name} changé vers ${role}`,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rôle' },
      { status: 500 }
    );
  }
}
