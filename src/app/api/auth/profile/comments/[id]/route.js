// app/api/auth/profile/comments/[id]/route.js - Récupérer les commentaires d'un utilisateur
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const userId = parseInt(id);

        if (isNaN(userId)) {
            return NextResponse.json(
                { error: 'ID utilisateur invalide' },
                { status: 400 }
            );
        }

        // Vérifier que l'utilisateur existe
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, username: true }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Utilisateur non trouvé' },
                { status: 404 }
            );
        }

        // Récupérer les commentaires de l'utilisateur
        const comments = await prisma.comment.findMany({
            where: {
                authorId: userId,
                parentId: null // Seulement les commentaires principaux
            },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true
                    }
                },
                replies: {
                    include: {
                        article: {
                            select: {
                                id: true,
                                title: true,
                                slug: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            user: user,
            comments: comments
        });

    } catch (error) {
        console.error('Error fetching user comments:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des commentaires' },
            { status: 500 }
        );
    }
}