// lib/articles.js - Fonctions pour les articles avec Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration pour les relations communes
const includeRelations = {
  author: {
    select: {
      id: true,
      name: true,
      username: true,
      avatar: true,
      bio: true,
      email: true
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
};

// Récupérer un article par son slug
export async function getArticleBySlug(slug) {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        slug: slug,
        published: true 
      },
      include: {
        ...includeRelations,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!article) {
      return null;
    }

    // Incrémenter les vues
    await incrementArticleViews(article.id);

    // Formatter la réponse pour correspondre à l'ancien format
    return {
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error fetching article by slug:', error);
    return null;
  }
}

// Récupérer un article par son ID
export async function getArticleById(id) {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        id: parseInt(id),
        published: true 
      },
      include: {
        ...includeRelations,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    };
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return null;
  }
}

// Récupérer tous les articles avec pagination
export async function getArticles(page = 1, limit = 10, categorySlug = null) {
  try {
    const skip = (page - 1) * limit;
    
    // Construire les conditions de filtrage
    const whereConditions = {
      published: true
    };

    // Filtrer par catégorie si spécifiée
    if (categorySlug && categorySlug !== 'all') {
      whereConditions.category = {
        slug: categorySlug
      };
    }

    // Récupérer les articles avec pagination
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where: whereConditions,
        include: includeRelations,
        orderBy: {
          publishedAt: 'desc'
        },
        skip: skip,
        take: limit
      }),
      prisma.article.count({
        where: whereConditions
      })
    ]);

    // Formatter les articles
    const formattedArticles = articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));

    return {
      articles: formattedArticles,
      totalArticles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
      hasNextPage: skip + limit < totalArticles,
      hasPreviousPage: page > 1
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      articles: [],
      totalArticles: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}

// Récupérer les articles en vedette
export async function getFeaturedArticles(limit = 3) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        featured: true,
        published: true
      },
      include: includeRelations,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return [];
  }
}

// Récupérer les articles par auteur
export async function getArticlesByAuthor(authorId, limit = 10) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        authorId: parseInt(authorId),
        published: true
      },
      include: includeRelations,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching articles by author:', error);
    return [];
  }
}

// Rechercher des articles
export async function searchArticles(query, limit = 10) {
  try {
    const searchTerm = query.toLowerCase();
    
    const articles = await prisma.article.findMany({
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
            category: {
              name: {
                contains: searchTerm,
                mode: 'insensitive'
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
      },
      include: includeRelations,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
}

// Récupérer les articles populaires (basé sur les likes)
export async function getPopularArticles(limit = 5) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      include: includeRelations,
      orderBy: {
        likes: {
          _count: 'desc'
        }
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    return [];
  }
}

// Récupérer les articles récents
export async function getRecentArticles(limit = 5) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      include: includeRelations,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching recent articles:', error);
    return [];
  }
}

// Récupérer les articles liés (même catégorie, excluant l'article actuel)
export async function getRelatedArticles(articleId, limit = 3) {
  try {
    // D'abord récupérer l'article actuel pour connaître sa catégorie
    const currentArticle = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      select: { categoryId: true }
    });

    if (!currentArticle) {
      return [];
    }

    const articles = await prisma.article.findMany({
      where: {
        id: {
          not: parseInt(articleId)
        },
        categoryId: currentArticle.categoryId,
        published: true
      },
      include: includeRelations,
      orderBy: {
        publishedAt: 'desc'
      },
      take: limit
    });

    return articles.map(article => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

// Générer les slugs pour le sitemap ou la génération statique
export async function getAllArticleSlugs() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true
      },
      select: {
        slug: true,
        updatedAt: true
      }
    });

    return articles.map(article => ({
      slug: article.slug,
      lastModified: article.updatedAt.toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error('Error fetching article slugs:', error);
    return [];
  }
}

// Incrémenter les vues d'un article
export async function incrementArticleViews(articleId) {
  try {
    await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        views: {
          increment: 1
        }
      }
    });
    return true;
  } catch (error) {
    console.error('Error incrementing article views:', error);
    return false;
  }
}

// Ajouter un like à un article
export async function likeArticle(articleId, userId) {
  try {
    // Vérifier si l'utilisateur a déjà liké cet article
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: parseInt(userId),
          articleId: parseInt(articleId)
        }
      }
    });

    if (existingLike) {
      return { success: false, message: 'Article déjà liké' };
    }

    await prisma.like.create({
      data: {
        userId: parseInt(userId),
        articleId: parseInt(articleId)
      }
    });

    return { success: true, message: 'Article liké avec succès' };
  } catch (error) {
    console.error('Error liking article:', error);
    return { success: false, message: 'Erreur lors du like' };
  }
}

// Retirer un like d'un article
export async function unlikeArticle(articleId, userId) {
  try {
    await prisma.like.delete({
      where: {
        userId_articleId: {
          userId: parseInt(userId),
          articleId: parseInt(articleId)
        }
      }
    });

    return { success: true, message: 'Like retiré avec succès' };
  } catch (error) {
    console.error('Error unliking article:', error);
    return { success: false, message: 'Erreur lors du retrait du like' };
  }
}

// Vérifier si un utilisateur a liké un article
export async function hasUserLikedArticle(articleId, userId) {
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: parseInt(userId),
          articleId: parseInt(articleId)
        }
      }
    });

    return !!like;
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
}

// Ajouter un commentaire à un article
export async function addComment(articleId, userId, content, parentId = null) {
  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: parseInt(userId),
        articleId: parseInt(articleId),
        parentId: parentId ? parseInt(parentId) : null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    return { success: true, comment };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, message: 'Erreur lors de l\'ajout du commentaire' };
  }
}

// Fermer la connexion Prisma (pour les tests ou la fin d'application)
export async function disconnectPrisma() {
  await prisma.$disconnect();
}