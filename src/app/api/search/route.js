
// ===============================================
// 2. src/app/api/search/route.js - API de recherche principale
// ===============================================

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 12;
        const tab = searchParams.get('tab') || 'all';
        const dateRange = searchParams.get('dateRange') || 'all';
        const sortBy = searchParams.get('sortBy') || 'relevance';
        const categoryFilter = searchParams.get('category') || 'all';

        if (!query || query.trim().length < 2) {
            return NextResponse.json({
                articles: [],
                authors: [],
                categories: [],
                total: 0,
                message: 'Requête trop courte'
            });
        }

        const searchTerm = query.trim().toLowerCase();
        const skip = (page - 1) * limit;

        // Construction des conditions de date
        let dateCondition = {};
        if (dateRange !== 'all') {
            const now = new Date();
            let startDate = new Date();

            switch (dateRange) {
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }

            dateCondition = {
                publishedAt: {
                    gte: startDate
                }
            };
        }

        // Construction des conditions de catégorie
        let categoryCondition = {};
        if (categoryFilter !== 'all') {
            categoryCondition = {
                category: {
                    slug: categoryFilter
                }
            };
        }

        // Construction de l'ordre
        let orderBy = {};
        switch (sortBy) {
            case 'date':
                orderBy = { publishedAt: 'desc' };
                break;
            case 'popularity':
                orderBy = { likes: { _count: 'desc' } };
                break;
            case 'views':
                orderBy = { views: 'desc' };
                break;
            default: // relevance
                orderBy = { publishedAt: 'desc' }; // Par défaut, on trie par date
        }

        let results = {
            articles: [],
            authors: [],
            categories: [],
            total: 0
        };

        // Recherche selon l'onglet actif
        if (tab === 'all' || tab === 'articles') {
            // Recherche d'articles
            const articlesWhere = {
                published: true,
                ...dateCondition,
                ...categoryCondition,
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
                    },
                    {
                        tags: {
                            some: {
                                name: {
                                    contains: searchTerm,
                                    mode: 'insensitive'
                                }
                            }
                        }
                    },
                    {
                        author: {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            };

            const [articles, articlesCount] = await Promise.all([
                prisma.article.findMany({
                    where: articlesWhere,
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
                                color: true,
                                textColor: true
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
                    orderBy,
                    skip: tab === 'articles' ? skip : 0,
                    take: tab === 'articles' ? limit : 6
                }),
                prisma.article.count({ where: articlesWhere })
            ]);

            results.articles = articles.map(article => ({
                ...article,
                likes: article._count.likes,
                commentsCount: article._count.comments,
                publishedAt: article.publishedAt.toISOString().split('T')[0]
            }));

            if (tab === 'articles') {
                results.total = articlesCount;
            }
        }

        if (tab === 'all' || tab === 'authors') {
            // Recherche d'auteurs
            const authorsWhere = {
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
                    },
                    {
                        bio: {
                            contains: searchTerm,
                            mode: 'insensitive'
                        }
                    }
                ]
            };

            const [authors, authorsCount] = await Promise.all([
                prisma.user.findMany({
                    where: authorsWhere,
                    include: {
                        _count: {
                            select: {
                                articles: {
                                    where: { published: true }
                                },
                                comments: true
                            }
                        }
                    },
                    orderBy: {
                        articles: {
                            _count: 'desc'
                        }
                    },
                    skip: tab === 'authors' ? skip : 0,
                    take: tab === 'authors' ? limit : 4
                }),
                prisma.user.count({ where: authorsWhere })
            ]);

            results.authors = authors.map(author => ({
                ...author,
                articlesCount: author._count.articles,
                commentsCount: author._count.comments
            }));

            if (tab === 'authors') {
                results.total = authorsCount;
            }
        }

        if (tab === 'all' || tab === 'categories') {
            // Recherche de catégories
            const categoriesWhere = {
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
            };

            const [categories, categoriesCount] = await Promise.all([
                prisma.category.findMany({
                    where: categoriesWhere,
                    include: {
                        _count: {
                            select: {
                                articles: {
                                    where: { published: true }
                                }
                            }
                        }
                    },
                    orderBy: {
                        articles: {
                            _count: 'desc'
                        }
                    },
                    skip: tab === 'categories' ? skip : 0,
                    take: tab === 'categories' ? limit : 8
                }),
                prisma.category.count({ where: categoriesWhere })
            ]);

            results.categories = categories.map(category => ({
                ...category,
                articlesCount: category._count.articles
            }));

            if (tab === 'categories') {
                results.total = categoriesCount;
            }
        }

        // Calculer le total pour l'onglet "all"
        if (tab === 'all') {
            results.total = results.articles.length + results.authors.length + results.categories.length;
        }

        return NextResponse.json(results);

    } catch (error) {
        console.error('Erreur API de recherche:', error);
        return NextResponse.json(
            {
                error: 'Erreur lors de la recherche',
                articles: [],
                authors: [],
                categories: [],
                total: 0
            },
            { status: 500 }
        );
    }
}