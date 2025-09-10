// lib/search.js - Search utilities
import { prisma } from '@/lib/prisma';

// Recherche globale (articles, auteurs, catégories)
export async function globalSearch(query, limit = 20) {
    try {
        const searchTerm = query.toLowerCase();

        const [articles, authors, categories] = await Promise.all([
            // Rechercher dans les articles
            prisma.article.findMany({
                where: {
                    published: true,
                    OR: [
                        {
                            title: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            content: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            username: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            slug: true
                        }
                    }
                },
                take: Math.floor(limit * 0.6), // 60% pour les articles
                orderBy: {
                    publishedAt: 'desc'
                }
            }),

            // Rechercher dans les auteurs
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
                include: {
                    _count: {
                        select: {
                            articles: {
                                where: {
                                    published: true
                                }
                            }
                        }
                    }
                },
                take: Math.floor(limit * 0.3), // 30% pour les auteurs
            }),

            // Rechercher dans les catégories
            prisma.category.findMany({
                where: {
                    OR: [
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    ]
                },
                include: {
                    _count: {
                        select: {
                            articles: {
                                where: {
                                    published: true
                                }
                            }
                        }
                    }
                },
                take: Math.floor(limit * 0.1), // 10% pour les catégories
            })
        ]);

        return {
            articles: articles.map(article => ({
                ...article,
                type: 'article',
                publishedAt: article.publishedAt.toISOString().split('T')[0]
            })),
            authors: authors.map(author => ({
                ...author,
                type: 'author',
                articlesCount: author._count.articles
            })),
            categories: categories.map(category => ({
                ...category,
                type: 'category',
                articlesCount: category._count.articles
            })),
            total: articles.length + authors.length + categories.length
        };
    } catch (error) {
        console.error('Error performing global search:', error);
        return {
            articles: [],
            authors: [],
            categories: [],
            total: 0
        };
    }
}