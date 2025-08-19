
// ===============================================
// 3. src/app/api/search/suggestions/route.js - API pour les suggestions
// ===============================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length < 2) {
            return NextResponse.json({ suggestions: [] });
        }

        const searchTerm = query.trim().toLowerCase();

        // Rechercher des suggestions dans différentes sources
        const [articleTitles, authorNames, categoryNames, tagNames] = await Promise.all([
            // Titres d'articles
            prisma.article.findMany({
                where: {
                    published: true,
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                select: {
                    title: true
                },
                take: 3
            }),

            // Noms d'auteurs
            prisma.user.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            username: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                select: {
                    name: true
                },
                take: 2
            }),

            // Noms de catégories
            prisma.category.findMany({
                where: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                select: {
                    name: true
                },
                take: 2
            }),

            // Tags populaires
            prisma.tag.findMany({
                where: {
                    name: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                select: {
                    name: true
                },
                take: 3
            })
        ]);

        // Combiner et déduplicater les suggestions
        const suggestions = [
            ...articleTitles.map(a => a.title),
            ...authorNames.map(a => a.name),
            ...categoryNames.map(c => c.name),
            ...tagNames.map(t => t.name)
        ];

        // Supprimer les doublons et limiter
        const uniqueSuggestions = [...new Set(suggestions)].slice(0, 8);

        return NextResponse.json({ suggestions: uniqueSuggestions });

    } catch (error) {
        console.error('Erreur API suggestions:', error);
        return NextResponse.json({ suggestions: [] });
    }
}