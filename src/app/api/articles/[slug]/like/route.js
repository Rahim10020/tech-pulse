// app/api/articles/[slug]/like/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request, { params }) {
    try {
        const { slug } = await params;
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
        }

        const decoded = await verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
        }

        // Trouver l'article
        const article = await prisma.article.findUnique({
            where: { slug },
            include: {
                likes: true // Inclure les likes pour compter
            }
        });

        if (!article) {
            return NextResponse.json({ error: 'Article non trouvé' }, { status: 404 });
        }

        // Vérifier si déjà liké
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_articleId: {
                    userId: decoded.userId,
                    articleId: article.id
                }
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id }
            });

            // Compter les likes restants
            const likesCount = await prisma.like.count({
                where: { articleId: article.id }
            });

            return NextResponse.json({
                success: true,
                liked: false,
                likes: likesCount
            });
        } else {
            // ✅ Ajouter le like
            await prisma.like.create({
                data: {
                    userId: decoded.userId,
                    articleId: article.id
                }
            });

            // Compter les likes actuels
            const likesCount = await prisma.like.count({
                where: { articleId: article.id }
            });

            return NextResponse.json({
                success: true,
                liked: true,
                likes: likesCount
            });
        }
    } catch (error) {
        console.error('Error liking article:', error);
        return NextResponse.json({
            error: 'Erreur serveur',
            details: error.message
        }, { status: 500 });
    }
}