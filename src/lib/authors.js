// lib/authors.js - Fonctions pour les auteurs avec Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Récupérer tous les auteurs avec leurs statistiques
export async function getAllAuthors() {
  try {
    const authors = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            },
            comments: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return authors.map(author => ({
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    }));
  } catch (error) {
    console.error('Error fetching authors:', error);
    return [];
  }
}

// Récupérer un auteur par son ID
export async function getAuthorById(id) {
  try {
    const author = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            },
            comments: true
          }
        }
      }
    });

    if (!author) {
      return null;
    }

    return {
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    };
  } catch (error) {
    console.error('Error fetching author by ID:', error);
    return null;
  }
}

// Récupérer un auteur par son username
export async function getAuthorByUsername(username) {
  try {
    const author = await prisma.user.findUnique({
      where: { username },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            },
            comments: true
          }
        }
      }
    });

    if (!author) {
      return null;
    }

    return {
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    };
  } catch (error) {
    console.error('Error fetching author by username:', error);
    return null;
  }
}

// Récupérer un auteur par son email
export async function getAuthorByEmail(email) {
  try {
    const author = await prisma.user.findUnique({
      where: { email },
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            },
            comments: true
          }
        }
      }
    });

    if (!author) {
      return null;
    }

    return {
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    };
  } catch (error) {
    console.error('Error fetching author by email:', error);
    return null;
  }
}

// Récupérer les auteurs les plus actifs (avec le plus d'articles)
export async function getTopAuthors(limit = 5) {
  try {
    const authors = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
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
      take: limit
    });

    return authors.map(author => ({
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    }));
  } catch (error) {
    console.error('Error fetching top authors:', error);
    return [];
  }
}

// Récupérer les auteurs avec leurs articles récents
export async function getAuthorsWithRecentArticles(limit = 5) {
  try {
    const authors = await prisma.user.findMany({
      include: {
        articles: {
          where: {
            published: true
          },
          orderBy: {
            publishedAt: 'desc'
          },
          take: 3,
          select: {
            id: true,
            title: true,
            slug: true,
            publishedAt: true,
            readTime: true
          }
        },
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
      where: {
        articles: {
          some: {
            published: true
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

    return authors.map(author => ({
      ...author,
      stats: {
        articles: author._count.articles
      },
      recentArticles: author.articles.map(article => ({
        ...article,
        publishedAt: article.publishedAt.toISOString().split('T')[0]
      }))
    }));
  } catch (error) {
    console.error('Error fetching authors with recent articles:', error);
    return [];
  }
}

// Rechercher des auteurs
export async function searchAuthors(query, limit = 10) {
  try {
    const searchTerm = query.toLowerCase();

    const authors = await prisma.user.findMany({
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
          },
          {
            bio: {
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
            },
            comments: true
          }
        }
      },
      take: limit
    });

    return authors.map(author => ({
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      }
    }));
  } catch (error) {
    console.error('Error searching authors:', error);
    return [];
  }
}

// Mettre à jour le profil d'un auteur
export async function updateAuthorProfile(id, data) {
  try {
    const author = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bio && { bio: data.bio }),
        ...(data.location && { location: data.location }),
        ...(data.website && { website: data.website }),
        ...(data.twitter && { twitter: data.twitter }),
        ...(data.linkedin && { linkedin: data.linkedin }),
        ...(data.github && { github: data.github }),
        ...(data.avatar && { avatar: data.avatar })
      }
    });

    return { success: true, author };
  } catch (error) {
    console.error('Error updating author profile:', error);
    return { success: false, message: 'Erreur lors de la mise à jour du profil' };
  }
}

// Récupérer le profil complet d'un auteur avec ses articles
export async function getAuthorProfile(username) {
  try {
    const author = await prisma.user.findUnique({
      where: { username },
      include: {
        articles: {
          where: {
            published: true
          },
          include: {
            category: {
              select: {
                name: true,
                slug: true,
                color: true,
                textColor: true
              }
            },
            tags: {
              select: {
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
          orderBy: {
            publishedAt: 'desc'
          }
        },
        _count: {
          select: {
            articles: {
              where: {
                published: true
              }
            },
            comments: true
          }
        }
      }
    });

    if (!author) {
      return null;
    }

    return {
      ...author,
      stats: {
        articles: author._count.articles,
        comments: author._count.comments
      },
      articles: author.articles.map(article => ({
        ...article,
        likes: article._count.likes,
        commentsCount: article._count.comments,
        publishedAt: article.publishedAt.toISOString().split('T')[0]
      }))
    };
  } catch (error) {
    console.error('Error fetching author profile:', error);
    return null;
  }
}

// Vérifier si un username est disponible
export async function isUsernameAvailable(username, excludeUserId = null) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (!existingUser) {
      return true;
    }

    // Si on exclut un utilisateur (pour les mises à jour), vérifier que ce n'est pas lui
    if (excludeUserId && existingUser.id === parseInt(excludeUserId)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking username availability:', error);
    return false;
  }
}

// Vérifier si un email est disponible
export async function isEmailAvailable(email, excludeUserId = null) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!existingUser) {
      return true;
    }

    // Si on exclut un utilisateur (pour les mises à jour), vérifier que ce n'est pas lui
    if (excludeUserId && existingUser.id === parseInt(excludeUserId)) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false;
  }
}