// ===============================================
// 4. src/lib/search.js - Fonctions utilitaires pour la recherche
// ===============================================

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour enregistrer les termes de recherche populaires
export async function logSearchTerm(term, userId = null) {
    try {
        await prisma.searchLog.create({
            data: {
                term: term.toLowerCase().trim(),
                userId: userId ? parseInt(userId) : null,
                timestamp: new Date()
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du terme de recherche:', error);
    }
}

// Fonction pour obtenir les termes de recherche populaires
export async function getPopularSearchTerms(limit = 10) {
    try {
        const popularTerms = await prisma.searchLog.groupBy({
            by: ['term'],
            _count: {
                term: true
            },
            orderBy: {
                _count: {
                    term: 'desc'
                }
            },
            take: limit,
            where: {
                timestamp: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 derniers jours
                }
            }
        });

        return popularTerms.map(item => ({
            term: item.term,
            count: item._count.term
        }));
    } catch (error) {
        console.error('Erreur lors de la récupération des termes populaires:', error);
        return [];
    }
}

// Fonction pour la recherche avancée avec scoring
export async function advancedSearch(query, options = {}) {
    const {
        limit = 20,
        offset = 0,
        includeContent = false,
        dateRange = null,
        categories = [],
        authors = []
    } = options;

    try {
        const searchTerm = query.toLowerCase().trim();

        // Construction de la requête avec scoring
        const whereConditions = {
            published: true,
            OR: [
                // Score 100: correspondance exacte du titre
                {
                    title: {
                        equals: query,
                        mode: 'insensitive'
                    }
                },
                // Score 80: titre commence par le terme
                {
                    title: {
                        startsWith: searchTerm,
                        mode: 'insensitive'
                    }
                },
                // Score 60: titre contient le terme
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                // Score 40: description contient le terme
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                },
                // Score 20: contenu contient le terme (si activé)
                ...(includeContent ? [{
                    content: {
                        contains: searchTerm,
                        mode: 'insensitive'
                    }
                }] : [])
            ]
        };

        // Ajouter les filtres de date
        if (dateRange) {
            whereConditions.publishedAt = {
                gte: dateRange.start,
                lte: dateRange.end
            };
        }

        // Ajouter les filtres de catégorie
        if (categories.length > 0) {
            whereConditions.categoryId = {
                in: categories
            };
        }

        // Ajouter les filtres d'auteur
        if (authors.length > 0) {
            whereConditions.authorId = {
                in: authors
            };
        }

        const results = await prisma.article.findMany({
            where: whereConditions,
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        avatar: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        color: true
                    }
                },
                tags: {
                    select: {
                        id: true,
                        name: true,
                        slug: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
            orderBy: [
                { featured: 'desc' }, // Articles en vedette en premier
                { publishedAt: 'desc' }
            ],
            skip: offset,
            take: limit
        });

        return results.map(article => ({
            ...article,
            likes: article._count.likes,
            commentsCount: article._count.comments,
            publishedAt: article.publishedAt.toISOString().split('T')[0]
        }));

    } catch (error) {
        console.error('Erreur lors de la recherche avancée:', error);
        return [];
    }
}

// Fonction pour obtenir des suggestions intelligentes
export async function getSmartSuggestions(query, limit = 5) {
    try {
        const searchTerm = query.toLowerCase().trim();

        // Suggestions basées sur la popularité et la pertinence
        const suggestions = await prisma.$queryRaw`
      SELECT DISTINCT 
        title as suggestion,
        'article' as type,
        views,
        (
          CASE 
            WHEN LOWER(title) LIKE ${`${searchTerm}%`} THEN 100
            WHEN LOWER(title) LIKE ${`%${searchTerm}%`} THEN 80
            WHEN LOWER(description) LIKE ${`%${searchTerm}%`} THEN 60
            ELSE 40
          END + (views / 100)
        ) as score
      FROM Article 
      WHERE published = true 
        AND (
          LOWER(title) LIKE ${`%${searchTerm}%`} 
          OR LOWER(description) LIKE ${`%${searchTerm}%`}
        )
      ORDER BY score DESC, views DESC
      LIMIT ${limit}
    `;

        return suggestions.map(s => s.suggestion);
    } catch (error) {
        console.error('Erreur suggestions intelligentes:', error);
        return [];
    }
}