// src/app/api/admin/categories/[id]/route.js - API pour une catégorie spécifique (admin)
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";
import { prisma } from '@/lib/prisma';

// GET - Récupérer une catégorie spécifique (admin)
export async function GET(request, { params }) {
    try {
        const { id } = await params;

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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Récupérer la catégorie
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        articles: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Catégorie non trouvée" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...category,
            articlesCount: category._count.articles,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        });
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de la catégorie" },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour une catégorie (admin)
export async function PUT(request, { params }) {
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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Vérifier que la catégorie existe
        const existingCategory = await prisma.category.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: "Catégorie non trouvée" },
                { status: 404 }
            );
        }

        const updateData = await request.json();
        const { name, description, icon, color, textColor } = updateData;

        // Validation
        if (name !== undefined && !name?.trim()) {
            return NextResponse.json(
                { error: "Le nom de la catégorie ne peut pas être vide" },
                { status: 400 }
            );
        }

        // Vérifier l'unicité du nom (si changé)
        if (name && name !== existingCategory.name) {
            const existingName = await prisma.category.findFirst({
                where: {
                    name: { equals: name.trim(), mode: "insensitive" },
                    id: { not: parseInt(id) }
                },
            });

            if (existingName) {
                return NextResponse.json(
                    { error: "Une catégorie avec ce nom existe déjà" },
                    { status: 400 }
                );
            }
        }

        // Générer un nouveau slug si le nom change
        let slug = existingCategory.slug;
        if (name && name !== existingCategory.name) {
            const baseSlug = name
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

            slug = baseSlug;
            let counter = 1;
            while (await prisma.category.findFirst({
                where: {
                    slug,
                    id: { not: parseInt(id) }
                }
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        // Construire les données de mise à jour
        const dataToUpdate = {
            updatedAt: new Date(),
        };

        if (name !== undefined) dataToUpdate.name = name.trim();
        if (description !== undefined) dataToUpdate.description = description?.trim() || null;
        if (icon !== undefined) dataToUpdate.icon = icon;
        if (color !== undefined) dataToUpdate.color = color;
        if (textColor !== undefined) dataToUpdate.textColor = textColor;
        if (slug !== existingCategory.slug) dataToUpdate.slug = slug;

        // Mettre à jour la catégorie
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
            include: {
                _count: {
                    select: {
                        articles: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: "Catégorie mise à jour avec succès",
            category: {
                ...updatedCategory,
                articlesCount: updatedCategory._count.articles,
                createdAt: updatedCategory.createdAt.toISOString(),
                updatedAt: updatedCategory.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de la catégorie" },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer une catégorie (admin)
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

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user || !isAdmin(user)) {
            return NextResponse.json(
                { error: "Accès non autorisé" },
                { status: 403 }
            );
        }

        // Vérifier que la catégorie existe
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id) },
            include: {
                _count: {
                    select: {
                        articles: true,
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                { error: "Catégorie non trouvée" },
                { status: 404 }
            );
        }

        // Empêcher la suppression de la catégorie par défaut
        if (category.slug === "non-classe") {
            return NextResponse.json(
                { error: "La catégorie par défaut ne peut pas être supprimée" },
                { status: 400 }
            );
        }

        // Vérifier s'il y a des articles dans cette catégorie
        if (category._count.articles > 0) {
            return NextResponse.json(
                {
                    error: `Impossible de supprimer une catégorie qui contient ${category._count.articles} article(s). Déplacez d'abord les articles vers une autre catégorie.`,
                },
                { status: 400 }
            );
        }

        // Supprimer la catégorie
        await prisma.category.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: `Catégorie "${category.name}" supprimée avec succès`,
        });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de la catégorie" },
            { status: 500 }
        );
    }
}