// src/app/api/admin/articles/[id]/route.js - API pour un article spécifique (admin)
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/lib/auth";
import { isAdmin } from "@/lib/auth-roles";

const prisma = new PrismaClient();

// GET - Récupérer un article spécifique (admin)
export async function GET(request, { params }) {
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

        // Récupérer l'article (même les brouillons)
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) },
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
        });

        if (!article) {
            return NextResponse.json(
                { error: "Article non trouvé" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ...article,
            likes: article._count.likes,
            commentsCount: article._count.comments,
            publishedAt: article.publishedAt?.toISOString(),
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString(),
        });
    } catch (error) {
        console.error("Error fetching article:", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération de l'article" },
            { status: 500 }
        );
    }
}

// PUT - Mettre à jour un article (admin)
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

        // Vérifier que l'article existe
        const existingArticle = await prisma.article.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingArticle) {
            return NextResponse.json(
                { error: "Article non trouvé" },
                { status: 404 }
            );
        }

        const updateData = await request.json();
        const {
            title,
            content,
            description,
            category,
            tags = [],
            readTime,
            featured,
            published,
            publishNow = false,
        } = updateData;

        // Validation
        if (title !== undefined && !title?.trim()) {
            return NextResponse.json(
                { error: "Le titre ne peut pas être vide" },
                { status: 400 }
            );
        }

        if (content !== undefined && !content?.trim()) {
            return NextResponse.json(
                { error: "Le contenu ne peut pas être vide" },
                { status: 400 }
            );
        }

        // Gérer la catégorie
        let categoryId = existingArticle.categoryId;
        if (category !== undefined) {
            if (category && category !== "non-classe") {
                const categoryData = await prisma.category.findUnique({
                    where: { slug: category },
                });
                if (!categoryData) {
                    return NextResponse.json(
                        { error: "Catégorie non trouvée" },
                        { status: 400 }
                    );
                }
                categoryId = categoryData.id;
            } else {
                // Catégorie par défaut
                const defaultCategory = await prisma.category.findFirst({
                    where: { slug: "non-classe" },
                });
                categoryId = defaultCategory?.id || existingArticle.categoryId;
            }
        }

        // Vérifier si on publie et qu'on a une catégorie valide
        const finalPublished = published || publishNow || existingArticle.published;
        if (finalPublished && categoryId) {
            const cat = await prisma.category.findUnique({
                where: { id: categoryId },
            });
            if (cat?.slug === "non-classe") {
                return NextResponse.json(
                    { error: "Une catégorie valide est requise pour publier" },
                    { status: 400 }
                );
            }
        }

        // Générer un nouveau slug si le titre change
        let slug = existingArticle.slug;
        if (title && title !== existingArticle.title) {
            const baseSlug = title
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");

            slug = baseSlug;
            let counter = 1;
            while (await prisma.article.findFirst({
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

        if (title !== undefined) dataToUpdate.title = title.trim();
        if (content !== undefined) dataToUpdate.content = content.trim();
        if (description !== undefined) dataToUpdate.description = description?.trim() || null;
        if (readTime !== undefined) dataToUpdate.readTime = readTime;
        if (featured !== undefined) dataToUpdate.featured = featured;
        if (categoryId && categoryId !== existingArticle.categoryId) dataToUpdate.categoryId = categoryId;
        if (slug !== existingArticle.slug) dataToUpdate.slug = slug;

        // Gestion de la publication
        if (publishNow && !existingArticle.published) {
            dataToUpdate.published = true;
            dataToUpdate.publishedAt = new Date();
        } else if (published !== undefined) {
            dataToUpdate.published = published;
            if (published && !existingArticle.published) {
                dataToUpdate.publishedAt = new Date();
            }
        }

        // Mettre à jour l'article
        const updatedArticle = await prisma.article.update({
            where: { id: parseInt(id) },
            data: dataToUpdate,
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
        });

        return NextResponse.json({
            success: true,
            message: "Article mis à jour avec succès",
            article: {
                ...updatedArticle,
                likes: updatedArticle._count.likes,
                commentsCount: updatedArticle._count.comments,
                publishedAt: updatedArticle.publishedAt?.toISOString(),
                createdAt: updatedArticle.createdAt.toISOString(),
                updatedAt: updatedArticle.updatedAt.toISOString(),
            },
        });
    } catch (error) {
        console.error("Error updating article:", error);
        return NextResponse.json(
            { error: "Erreur lors de la mise à jour de l'article" },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un article (admin)
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

        // Vérifier que l'article existe
        const article = await prisma.article.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                title: true,
                published: true,
            },
        });

        if (!article) {
            return NextResponse.json(
                { error: "Article non trouvé" },
                { status: 404 }
            );
        }

        // Supprimer l'article (les commentaires et likes seront supprimés en cascade)
        await prisma.article.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({
            success: true,
            message: `Article "${article.title}" supprimé avec succès`,
        });
    } catch (error) {
        console.error("Error deleting article:", error);
        return NextResponse.json(
            { error: "Erreur lors de la suppression de l'article" },
            { status: 500 }
        );
    }
}