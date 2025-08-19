// src/app/api/admin/articles/route.js - API pour la gestion des articles (admin)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";

const prisma = new PrismaClient();

// GET - Récupérer tous les articles pour l'admin
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
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all"; // all, published, draft, featured
        const category = searchParams.get("category") || "";
        const author = searchParams.get("author") || "";
        const sortBy = searchParams.get("sortBy") || "updatedAt";
        const sortOrder = searchParams.get("sortOrder") || "desc";

        const skip = (page - 1) * limit;

        // Construire les conditions de recherche
        let where = {};

        // Filtre par statut
        if (status === "published") {
            where.published = true;
        } else if (status === "draft") {
            where.published = false;
        } else if (status === "featured") {
            where.featured = true;
            where.published = true;
        }

        // Recherche textuelle
        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
            ];
        }

        // Filtre par catégorie
        if (category) {
            where.category = { slug: category };
        }

        // Filtre par auteur
        if (author) {
            where.author = { username: author };
        }

        // Construire l'ordre de tri
        let orderBy = {};
        orderBy[sortBy] = sortOrder;

        // Récupérer les articles avec pagination
        const [articles, totalCount] = await Promise.all([
            prisma.article.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                            avatar: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            color: true,
                            textColor: true,
                        },
                    },
                    tags: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            prisma.article.count({ where }),
        ]);

        // Récupérer les statistiques générales
        const [totalPublished, totalDrafts, totalFeatured] = await Promise.all([
            prisma.article.count({ where: { published: true } }),
            prisma.article.count({ where: { published: false } }),
            prisma.article.count({ where: { featured: true, published: true } }),
        ]);

        // Formater les articles
        const formattedArticles = articles.map((article) => ({
            ...article,
            likes: article._count.likes,
            commentsCount: article._count.comments,
            publishedAt: article.publishedAt?.toISOString(),
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString(),
        }));

        return NextResponse.json({
            articles: formattedArticles,
            pagination: {
                page,
                limit,
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                hasNext: skip + limit < totalCount,
                hasPrev: page > 1,
            },
            stats: {
                total: totalCount,
                published: totalPublished,
                drafts: totalDrafts,
                featured: totalFeatured,
            },
        });
    } catch (error) {
        console.error("Error fetching admin articles:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des articles" },
            { status: 500 }
        );
    }
}

// POST - Créer un nouvel article (admin)
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

        const articleData = await request.json();
        const {
            title,
            content,
            description,
            category,
            tags = [],
            readTime,
            featured = false,
            published = false,
            publishNow = false,
        } = articleData;

        // Validation
        if (!title?.trim()) {
            return NextResponse.json(
                { error: "Le titre est requis" },
                { status: 400 }
            );
        }

        if (!content?.trim()) {
            return NextResponse.json(
                { error: "Le contenu est requis" },
                { status: 400 }
            );
        }

        // Si on publie, une catégorie est requise
        if ((published || publishNow) && (!category || category === "non-classe")) {
            return NextResponse.json(
                { error: "Une catégorie valide est requise pour publier" },
                { status: 400 }
            );
        }

        // Déterminer la catégorie
        let categoryData;
        if (category && category !== "non-classe") {
            categoryData = await prisma.category.findUnique({
                where: { slug: category },
            });
            if (!categoryData) {
                return NextResponse.json(
                    { error: "Catégorie non trouvée" },
                    { status: 400 }
                );
            }
        } else {
            // Catégorie par défaut pour les brouillons
            categoryData = await prisma.category.findFirst({
                where: { slug: "non-classe" },
            });
            if (!categoryData) {
                categoryData = await prisma.category.create({
                    data: {
                        name: "Non classé",
                        slug: "non-classe",
                        description: "Articles sans catégorie spécifique",
                        color: "bg-gray-100",
                        textColor: "text-gray-800",
                    },
                });
            }
        }

        // Générer un slug unique
        const baseSlug = title
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

        let slug = baseSlug;
        let counter = 1;
        while (await prisma.article.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Créer l'article
        const finalPublished = published || publishNow;
        const article = await prisma.article.create({
            data: {
                title: title.trim(),
                slug,
                content: content.trim(),
                description: description?.trim() || null,
                readTime: readTime || null,
                featured,
                published: finalPublished,
                publishedAt: finalPublished ? new Date() : new Date(),
                authorId: user.id,
                categoryId: categoryData.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        color: true,
                        textColor: true,
                    },
                },
                tags: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    },
                },
            },
        });

        return NextResponse.json({
            success: true,
            message: finalPublished ? "Article publié avec succès" : "Brouillon créé avec succès",
            article: {
                ...article,
                likes: article._count.likes,
                commentsCount: article._count.comments,
                publishedAt: article.publishedAt?.toISOString(),
                createdAt: article.createdAt.toISOString(),
                updatedAt: article.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("Error creating article:", error);
        return NextResponse.json(
            { error: "Erreur lors de la création de l'article" },
            { status: 500 }
        );
    }
}