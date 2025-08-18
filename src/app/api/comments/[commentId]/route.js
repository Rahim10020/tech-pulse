// ==========================================
// 2. app/api/comments/[commentId]/route.js
// ==========================================
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

// PATCH - Modifier un commentaire
export async function PATCH(request, { params }) {
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

        const { content } = await request.json();

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

        // Vérifier que le commentaire existe et appartient à l'utilisateur
        const existingComment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
            include: {
                author: {
                    select: { id: true, name: true, username: true, role: true }
                }
            }
        });

        if (!existingComment) {
            return NextResponse.json(
                { error: 'Commentaire non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier les permissions (auteur ou admin)
        if (existingComment.authorId !== decoded.userId && decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'Non autorisé à modifier ce commentaire' },
                { status: 403 }
            );
        }

        // Mettre à jour le commentaire
        const updatedComment = await prisma.comment.update({
            where: { id: parseInt(commentId) },
            data: {
                content: content.trim(),
                updatedAt: new Date()
            },
            include: {
                author: {
                    select: { id: true, name: true, username: true, role: true }
                }
            }
        });

        return NextResponse.json({
            success: true,
            comment: updatedComment,
            message: 'Commentaire modifié avec succès'
        });

    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la modification du commentaire' },
            { status: 500 }
        );
    }
}

// DELETE - Supprimer un commentaire
export async function DELETE(request, { params }) {
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
        const existingComment = await prisma.comment.findUnique({
            where: { id: parseInt(commentId) },
            include: {
                replies: true
            }
        });

        if (!existingComment) {
            return NextResponse.json(
                { error: 'Commentaire non trouvé' },
                { status: 404 }
            );
        }

        // Vérifier les permissions (auteur ou admin)
        if (existingComment.authorId !== decoded.userId && decoded.role !== 'admin') {
            return NextResponse.json(
                { error: 'Non autorisé à supprimer ce commentaire' },
                { status: 403 }
            );
        }

        // Supprimer le commentaire (et ses réponses en cascade grâce au schema Prisma)
        await prisma.comment.delete({
            where: { id: parseInt(commentId) }
        });

        return NextResponse.json({
            success: true,
            message: 'Commentaire supprimé avec succès'
        });

    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la suppression du commentaire' },
            { status: 500 }
        );
    }
}