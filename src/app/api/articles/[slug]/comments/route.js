// ==========================================
// 1. app/api/articles/[slug]/comments/route.js
// ==========================================
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les commentaires d'un article
export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(request.url);
        const sort = searchParams.get('sort') || 'newest';

        // Vérifier que l'article existe par slug
        const article = await prisma.article.findUnique({
            where: { slug: slug }
        });

        if (!article) {
            return NextResponse.json(
                { error: 'Article non trouvé' },
                { status: 404 }
            );
        }

        // Définir l'ordre de tri
        let orderBy = {};
        switch (sort) {
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            case 'popular':
                orderBy = { likes: 'desc' };
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
                break;
        }

        // Récupérer les commentaires (seulement les parents, pas les réponses)
        const comments = await prisma.comment.findMany({
            where: {
                articleId: article.id, // Utiliser l'ID trouvé via le slug
                parentId: null // Seulement les commentaires principaux
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true
                    }
                },
                replies: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                role: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy
        });

        // Vérifier les likes de l'utilisateur connecté (optionnel)
        const token = request.cookies.get('token')?.value;
        let userLikes = [];

        if (token) {
            const decoded = await verifyToken(token);
            if (decoded) {
                // Note: Vous devrez créer un modèle CommentLike similaire au modèle Like
                // Pour l'instant, on simule avec isLiked: false
                userLikes = [];
            }
        }

        // Formatter les commentaires pour le frontend
        const formattedComments = comments.map(comment => ({
            ...comment,
            isLiked: false, // À implémenter avec CommentLike
            replies: comment.replies.map(reply => ({
                ...reply,
                isLiked: false // À implémenter avec CommentLike
            }))
        }));

        return NextResponse.json({
            success: true,
            comments: formattedComments
        });

    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des commentaires' },
            { status: 500 }
        );
    }
}

// POST - Créer un nouveau commentaire
export async function POST(request, { params }) {
    try {
        const { slug } = params;
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Non authentifié' },
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

        const { content, parentId } = await request.json();

        // Validation
        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Le contenu du commentaire est requis' },
                { status: 400 }
            );
        }

        if (content.length > 500) {
            return NextResponse.json(
                { error: 'Le commentaire ne peut pas dépasser 500 caractères' },
                { status: 400 }
            );
        }

        // Vérifier que l'article existe par slug
        const article = await prisma.article.findUnique({
            where: { slug: slug }
        });

        if (!article) {
            return NextResponse.json(
                { error: 'Article non trouvé' },
                { status: 404 }
            );
        }

        // Si c'est une réponse, vérifier que le commentaire parent existe
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({
                where: { id: parseInt(parentId) }
            });

            if (!parentComment) {
                return NextResponse.json(
                    { error: 'Commentaire parent non trouvé' },
                    { status: 404 }
                );
            }

            if (parentComment.articleId !== article.id) {
                return NextResponse.json(
                    { error: 'Le commentaire parent n\'appartient pas à cet article' },
                    { status: 400 }
                );
            }
        }

        // Créer le commentaire
        const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                authorId: decoded.userId,
                articleId: article.id, // Utiliser l'ID trouvé via le slug
                parentId: parentId ? parseInt(parentId) : null
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            comment: {
                ...comment,
                isLiked: false,
                replies: []
            },
            message: 'Commentaire ajouté avec succès'
        });

    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la création du commentaire' },
            { status: 500 }
        );
    }
}