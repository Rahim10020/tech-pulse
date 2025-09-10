// lib/blog-stats.js - Blog statistics utilities
import { prisma } from '@/lib/prisma';

// Récupérer les statistiques générales du blog
export async function getBlogStats() {
    try {
        const [
            totalArticles,
            totalUsers,
            totalCategories,
            totalComments,
            totalLikes
        ] = await Promise.all([
            prisma.article.count({ where: { published: true } }),
            prisma.user.count(),
            prisma.category.count(),
            prisma.comment.count(),
            prisma.like.count()
        ]);

        return {
            totalArticles,
            totalUsers,
            totalCategories,
            totalComments,
            totalLikes
        };
    } catch (error) {
        console.error('Error fetching blog stats:', error);
        return {
            totalArticles: 0,
            totalUsers: 0,
            totalCategories: 0,
            totalComments: 0,
            totalLikes: 0
        };
    }
}

// Récupérer le contenu pour la page d'accueil
export async function getHomePageContent() {
    try {
        const [
            featuredArticles,
            recentArticles,
            popularCategories,
            topAuthors,
            stats
        ] = await Promise.all([
            // Articles en vedette
            prisma.article.findMany({
                where: {
                    featured: true,
                    published: true
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            username: true,
                            avatar: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            slug: true,
                            color: true,
                            textColor: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: {
                    publishedAt: 'desc'
                },
                take: 3
            }),

            // Articles récents
            prisma.article.findMany({
                where: {
                    published: true
                },
                include: {
                    author: {
                        select: {
                            name: true,
                            username: true,
                            avatar: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            slug: true,
                            color: true,
                            textColor: true
                        }
                    },
                    _count: {
                        select: {
                            likes: true,
                            comments: true
                        }
                    }
                },
                orderBy: {
                    publishedAt: 'desc'
                },
                take: 6
            }),

            // Catégories populaires
            prisma.category.findMany({
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
                orderBy: {
                    articles: {
                        _count: 'desc'
                    }
                },
                take: 6
            }),

            // Auteurs les plus actifs
            prisma.user.findMany({
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
                orderBy: {
                    articles: {
                        _count: 'desc'
                    }
                },
                take: 4
            }),

            // Statistiques générales
            getBlogStats()
        ]);

        return {
            featuredArticles: featuredArticles.map(article => ({
                ...article,
                likes: article._count.likes,
                commentsCount: article._count.comments,
                publishedAt: article.publishedAt.toISOString().split('T')[0]
            })),
            recentArticles: recentArticles.map(article => ({
                ...article,
                likes: article._count.likes,
                commentsCount: article._count.comments,
                publishedAt: article.publishedAt.toISOString().split('T')[0]
            })),
            popularCategories: popularCategories.map(category => ({
                ...category,
                count: category._count.articles
            })),
            topAuthors: topAuthors.map(author => ({
                ...author,
                articlesCount: author._count.articles
            })),
            stats
        };
    } catch (error) {
        console.error('Error fetching home page content:', error);
        return {
            featuredArticles: [],
            recentArticles: [],
            popularCategories: [],
            topAuthors: [],
            stats: {
                totalArticles: 0,
                totalUsers: 0,
                totalCategories: 0,
                totalComments: 0,
                totalLikes: 0
            }
        };
    }
}