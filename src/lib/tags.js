// lib/tags.js - Tag utilities
import { prisma } from '@/lib/prisma';

// Récupérer tous les tags avec comptage
export async function getAllTags() {
    try {
        const tags = await prisma.tag.findMany({
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
            }
        });

        return tags.map(tag => ({
            ...tag,
            count: tag._count.articles
        }));
    } catch (error) {
        console.error('Error fetching tags:', error);
        return [];
    }
}

// Récupérer les tags populaires
export async function getPopularTags(limit = 10) {
    try {
        const tags = await prisma.tag.findMany({
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
            take: limit
        });

        return tags.map(tag => ({
            ...tag,
            count: tag._count.articles
        }));
    } catch (error) {
        console.error('Error fetching popular tags:', error);
        return [];
    }
}