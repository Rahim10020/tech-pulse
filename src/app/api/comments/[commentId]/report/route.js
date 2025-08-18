// ==========================================
// 4. app/api/comments/[commentId]/report/route.js
// ==========================================
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// POST - Signaler un commentaire
export async function POST(request, { params }) {
    try {
        const { commentId } = params;
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

        // Vérifier que le commentaire existe
        const comment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
            include: {
                author: {
                    select: { id: true, name: true, username: true }
                },
                article: {
                    select: { id: true, title: true, slug: true }
                }
            }
        });

        if (!comment) {
            return NextResponse.json(
                { error: 'Commentaire non trouvé' },
                { status: 404 }
            );
        }

        // On ne peut pas signaler son propre commentaire
        if (comment.authorId === decoded.userId) {
            return NextResponse.json(
                { error: 'Vous ne pouvez pas signaler votre propre commentaire' },
                { status: 400 }
            );
        }

        // Pour cette implémentation simple, on log le signalement
        // Dans un système complet, vous créeriez un modèle Report
        console.log('SIGNALEMENT DE COMMENTAIRE:', {
            reportedBy: decoded.userId,
            reportedUser: comment.author.username,
            commentId: commentId,
            commentContent: comment.content.substring(0, 100),
            articleTitle: comment.article.title,
            articleSlug: comment.article.slug,
            timestamp: new Date().toISOString()
        });

        // Optionnel: envoyer un email aux modérateurs
        // await sendModerationEmail({...})

        return NextResponse.json({
            success: true,
            message: 'Commentaire signalé aux modérateurs'
        });

    } catch (error) {
        console.error('Error reporting comment:', error);
        return NextResponse.json(
            { error: 'Erreur lors du signalement du commentaire' },
            { status: 500 }
        );
    }
}