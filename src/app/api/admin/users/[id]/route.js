// src/app/api/admin/users/[id]/route.js - API pour modifier un utilisateur spécifique
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";

const prisma = new PrismaClient();

// PATCH - Modifier un utilisateur (admin seulement)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();

    // Vérifier l'authentification admin
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

    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser || !isAdmin(adminUser)) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur à modifier existe
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se rétrograder lui-même
    if (
      targetUser.id === adminUser.id &&
      updateData.role &&
      updateData.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas modifier votre propre rôle" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(updateData.role && { role: updateData.role }),
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.bio && { bio: updateData.bio }),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur (admin seulement)
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Vérifier l'authentification admin
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

    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!adminUser || !isAdmin(adminUser)) {
      return NextResponse.json(
        { error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur à supprimer existe
    const targetUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Empêcher un admin de se supprimer lui-même
    if (targetUser.id === adminUser.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas supprimer votre propre compte" },
        { status: 400 }
      );
    }

    // Supprimer l'utilisateur (les articles, commentaires, etc. seront supprimés en cascade grâce au schéma Prisma)
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}
