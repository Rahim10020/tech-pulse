// src/app/api/admin/categories/route.js - API pour la gestion des catégories (admin)
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les catégories (admin)
export async function GET(request) {
    try {
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

        // Récupérer les paramètres de requête
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const sortBy = searchParams.get("sortBy") || "name";
        const sortOrder = searchParams.get("sortOrder") || "asc";

        // Construire les conditions de recherche
        let where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        // Construire l'ordre de tri
        let orderBy = {};
        if (sortBy === "articles") {
            orderBy = { articles: { _count: sortOrder } };
        } else {
            orderBy[sortBy] = sortOrder;
        }

        // Récupérer les catégories avec comptage des articles
        const categories = await prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: {
                        articles: true,
                    },
                },
            },
            orderBy,
        });

        // Calculer les statistiques
        const totalCategories = categories.length;
        const totalArticles = categories.reduce((sum, cat) => sum + cat._count.articles, 0);
        const mostUsedCategory = categories.reduce((max, cat) =>
            cat._count.articles > (max?._count?.articles || 0) ? cat : max, null);

        return NextResponse.json({
            categories: categories.map((category) => ({
                ...category,
                articlesCount: category._count.articles,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            })),
            stats: {
                total: totalCategories,
                totalArticles,
                mostUsed: mostUsedCategory ? {
                    name: mostUsedCategory.name,
                    count: mostUsedCategory._count.articles,
                } : null,
            },
        });
    } catch (error) {
        console.error("Error fetching admin categories:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des catégories" },
            { status: 500 }
        );
    }
}

// POST - Créer une nouvelle catégorie (admin)
export async function POST(request) {
    try {
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

        const categoryData = await request.json();
        const {
            name,
            description,
            icon = "Folder",
            color = "bg-gray-100",
            textColor = "text-gray-800",
        } = categoryData;

        // Validation
        if (!name?.trim()) {
            return NextResponse.json(
                { error: "Le nom de la catégorie est requis" },
                { status: 400 }
            );
        }

        // Générer un slug unique
        const baseSlug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        let slug = baseSlug;
        let counter = 1;
        while (await prisma.category.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Vérifier que le nom n'existe pas déjà
        const existingCategory = await prisma.category.findFirst({
            where: { name: { equals: name.trim(), mode: "insensitive" } },
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: "Une catégorie avec ce nom existe déjà" },
                { status: 400 }
            );
        }

        // Créer la catégorie
        const category = await prisma.category.create({
            data: {
                name: name.trim(),
                slug,
                description: description?.trim() || null,
                icon,
                color,
                textColor,
            },
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
            message: "Catégorie créée avec succès",
            category: {
                ...category,
                articlesCount: category._count.articles,
                createdAt: category.createdAt.toISOString(),
                updatedAt: category.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("Error creating category:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de la catégorie" },
            { status: 500 }
        );
    }
}