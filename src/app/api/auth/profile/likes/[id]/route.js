// app/api/auth/profile/likes/[id]/route.js - Récupérer les likes d'un utilisateur
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

        // Récupérer les likes de l'utilisateur
        const likes = await prisma.like.findMany({
            where: {
                userId: userId
            },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        imageUrl: true,
                        publishedAt: true,
                        author: {
                            select: {
                                id: true,
                                name: true,
                                username: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            user: user,
            likes: likes
        });

    } catch (error) {
        console.error('Error fetching user likes:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des likes' },
            { status: 500 }
        );
    }
}