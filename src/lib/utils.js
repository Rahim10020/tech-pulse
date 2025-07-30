// lib/utils.js - Fonctions utilitaires générales
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

// Fonction pour générer un slug à partir d'un titre
export function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
    .replace(/[\s_-]+/g, '-') // Remplacer les espaces par des tirets
    .replace(/^-+|-+$/g, ''); // Supprimer les tirets au début/fin
}

// Fonction pour calculer le temps de lecture estimé
export function calculateReadTime(content) {
  const wordsPerMinute = 200; // Vitesse moyenne de lecture
  const words = content.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min`;
}

// Fonction pour formater une date
export function formatDate(date, locale = 'fr-FR') {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

// Fonction pour obtenir un extrait d'un texte
export function getExcerpt(text, maxLength = 150) {
  if (text.length <= maxLength) {
    return text;
  }
  
  const excerpt = text.substring(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return excerpt.substring(0, lastSpaceIndex) + '...';
  }
  
  return excerpt + '...';
}