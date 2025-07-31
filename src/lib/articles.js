// lib/articles.js - Fonctions pour les articles avec Prisma
import { PrismaClient } from "@prisma/client";

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
      email: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      textColor: true,
    },
  },
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
};

// Récupérer un article par son slug
export async function getArticleBySlug(slug) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        slug: slug,
        published: true,
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
                avatar: true,
              },
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
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
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    return null;
  }
}

// Récupérer un article par son ID
export async function getArticleById(id) {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(id),
        published: true,
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
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!article) {
      return null;
    }

    return {
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    };
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}

// Récupérer tous les articles avec pagination
export async function getArticles(page = 1, limit = 10, categorySlug = null) {
  try {
    const skip = (page - 1) * limit;

    // Construire les conditions de filtrage
    const whereConditions = {
      published: true,
    };

    // Filtrer par catégorie si spécifiée
    if (categorySlug && categorySlug !== "all") {
      whereConditions.category = {
        slug: categorySlug,
      };
    }

    // Récupérer les articles avec pagination
    const [articles, totalArticles] = await Promise.all([
      prisma.article.findMany({
        where: whereConditions,
        include: includeRelations,
        orderBy: {
          publishedAt: "desc",
        },
        skip: skip,
        take: limit,
      }),
      prisma.article.count({
        where: whereConditions,
      }),
    ]);

    // Formatter les articles
    const formattedArticles = articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));

    return {
      articles: formattedArticles,
      totalArticles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
      hasNextPage: skip + limit < totalArticles,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      totalArticles: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}

// Récupérer les articles en vedette
export async function getFeaturedArticles(limit = 3) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        featured: true,
        published: true,
      },
      include: includeRelations,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    return [];
  }
}

// Récupérer les articles par auteur
export async function getArticlesByAuthor(authorId, limit = 10) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        authorId: parseInt(authorId),
        published: true,
      },
      include: includeRelations,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching articles by author:", error);
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
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
          {
            tags: {
              some: {
                name: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              },
            },
          },
          {
            category: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
          {
            author: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: includeRelations,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error searching articles:", error);
    return [];
  }
}

// Récupérer les articles populaires (basé sur les likes)
export async function getPopularArticles(limit = 5) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      include: includeRelations,
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    return [];
  }
}

// Récupérer les articles récents
export async function getRecentArticles(limit = 5) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      include: includeRelations,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching recent articles:", error);
    return [];
  }
}

// Récupérer les articles liés (même catégorie, excluant l'article actuel)
export async function getRelatedArticles(articleId, limit = 3) {
  try {
    // D'abord récupérer l'article actuel pour connaître sa catégorie
    const currentArticle = await prisma.article.findUnique({
      where: { id: parseInt(articleId) },
      select: { categoryId: true },
    });

    if (!currentArticle) {
      return [];
    }

    const articles = await prisma.article.findMany({
      where: {
        id: {
          not: parseInt(articleId),
        },
        categoryId: currentArticle.categoryId,
        published: true,
      },
      include: includeRelations,
      orderBy: {
        publishedAt: "desc",
      },
      take: limit,
    });

    return articles.map((article) => ({
      ...article,
      likes: article._count.likes,
      commentsCount: article._count.comments,
      publishedAt: article.publishedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return [];
  }
}

// Générer les slugs pour le sitemap ou la génération statique
export async function getAllArticleSlugs() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    return articles.map((article) => ({
      slug: article.slug,
      lastModified: article.updatedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching article slugs:", error);
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
          increment: 1,
        },
      },
    });
    return true;
  } catch (error) {
    console.error("Error incrementing article views:", error);
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
          articleId: parseInt(articleId),
        },
      },
    });

    if (existingLike) {
      return { success: false, message: "Article déjà liké" };
    }

    await prisma.like.create({
      data: {
        userId: parseInt(userId),
        articleId: parseInt(articleId),
      },
    });

    return { success: true, message: "Article liké avec succès" };
  } catch (error) {
    console.error("Error liking article:", error);
    return { success: false, message: "Erreur lors du like" };
  }
}

// Retirer un like d'un article
export async function unlikeArticle(articleId, userId) {
  try {
    await prisma.like.delete({
      where: {
        userId_articleId: {
          userId: parseInt(userId),
          articleId: parseInt(articleId),
        },
      },
    });

    return { success: true, message: "Like retiré avec succès" };
  } catch (error) {
    console.error("Error unliking article:", error);
    return { success: false, message: "Erreur lors du retrait du like" };
  }
}

// Vérifier si un utilisateur a liké un article
export async function hasUserLikedArticle(articleId, userId) {
  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_articleId: {
          userId: parseInt(userId),
          articleId: parseInt(articleId),
        },
      },
    });

    return !!like;
  } catch (error) {
    console.error("Error checking user like:", error);
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
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { success: false, message: "Erreur lors de l'ajout du commentaire" };
  }
}

// Fermer la connexion Prisma (pour les tests ou la fin d'application)
export async function disconnectPrisma() {
  await prisma.$disconnect();
}

// Dans lib/articles.js - Correction de la fonction createArticle
export async function createArticle(articleData) {
  try {
    const {
      title,
      content,
      description,
      category,
      tags = [],
      readTime,
      featured = false,
      authorId,
      isDraft = false,
    } = articleData;

    // Validation de base
    if (!title?.trim()) {
      return {
        success: false,
        error: "Le titre est requis",
      };
    }

    if (!content?.trim()) {
      return {
        success: false,
        error: "Le contenu est requis",
      };
    }

    // Pour les articles publiés, la catégorie est obligatoire
    if (!isDraft && !category) {
      return {
        success: false,
        error: "La catégorie est requise pour publier un article",
      };
    }

    // Générer le slug seulement pour les articles publiés
    let slug = null;
    if (!isDraft) {
      slug = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      // Vérifier l'unicité du slug pour les articles publiés
      const existingArticle = await prisma.article.findUnique({
        where: { slug },
      });

      if (existingArticle) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Récupérer la catégorie si spécifiée
    let categoryData = null;
    if (category) {
      categoryData = await prisma.category.findUnique({
        where: { slug: category },
      });

      if (!categoryData) {
        return {
          success: false,
          error: "Catégorie non trouvée",
        };
      }
    }

    // Créer l'article (brouillon ou publié) - CORRECTION ICI
    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug, // null pour les brouillons
        content: content.trim(),
        description: description?.trim() || null,
        readTime: readTime || null,
        featured,
        published: !isDraft, // false si c'est un brouillon
        publishedAt: isDraft ? null : new Date(),
        authorId: parseInt(authorId), // S'assurer que c'est un entier
        categoryId: categoryData?.id || null,
        // Pas de champ author ici car on utilise authorId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
        category: true,
        tags: true,
      },
    });

    return {
      success: true,
      article,
    };
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      success: false,
      error: "Erreur lors de la création de l'article",
    };
  }
}

// Nouvelle fonction pour récupérer les brouillons d'un auteur
export async function getDraftsByAuthor(authorId, limit = 10) {
  try {
    const drafts = await prisma.article.findMany({
      where: {
        authorId: parseInt(authorId),
        published: false,
      },
      include: includeRelations,
      orderBy: {
        updatedAt: "desc",
      },
      take: limit,
    });

    return drafts.map((draft) => ({
      ...draft,
      likes: draft._count.likes,
      commentsCount: draft._count.comments,
      createdAt: draft.createdAt.toISOString().split("T")[0],
      updatedAt: draft.updatedAt.toISOString().split("T")[0],
    }));
  } catch (error) {
    console.error("Error fetching drafts by author:", error);
    return [];
  }
}

// Nouvelle fonction pour publier un brouillon
export async function publishDraft(articleId, authorId) {
  try {
    // Vérifier que l'article appartient à l'auteur et qu'il s'agit d'un brouillon
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
        authorId: parseInt(authorId),
        published: false,
      },
    });

    if (!article) {
      return { success: false, error: "Brouillon non trouvé ou déjà publié" };
    }

    // Publier l'article
    const publishedArticle = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        published: true,
        publishedAt: new Date(),
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return { success: true, article: publishedArticle };
  } catch (error) {
    console.error("Error publishing draft:", error);
    return {
      success: false,
      error: "Erreur lors de la publication du brouillon",
    };
  }
}

// Nouvelle fonction pour mettre à jour un brouillon
export async function updateDraft(articleId, authorId, updateData) {
  try {
    // Vérifier que l'article appartient à l'auteur
    const existingArticle = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
        authorId: parseInt(authorId),
      },
    });

    if (!existingArticle) {
      return { success: false, error: "Article non trouvé" };
    }

    const { title, content, description, category, readTime, featured } =
      updateData;

    // Trouver la catégorie par slug si fournie
    let categoryId = existingArticle.categoryId;
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { slug: category },
      });
      categoryId = categoryRecord?.id || null;
    }

    // Mettre à jour l'article
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(description !== undefined && { description }),
        ...(readTime && { readTime }),
        ...(featured !== undefined && { featured }),
        ...(categoryId && { categoryId }),
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    return { success: true, article: updatedArticle };
  } catch (error) {
    console.error("Error updating draft:", error);
    return {
      success: false,
      error: "Erreur lors de la mise à jour du brouillon",
    };
  }
}

// Dans lib/articles.js - Fonction pour mettre à jour les brouillons existants
export async function updateOrCreateDraft(articleData, existingDraftId = null) {
  try {
    const { title, content, description, category, readTime, authorId } =
      articleData;

    // Si on a un brouillon existant, le mettre à jour
    if (existingDraftId) {
      const updatedDraft = await prisma.article.update({
        where: {
          id: existingDraftId,
          authorId, // S'assurer que l'utilisateur possède le brouillon
          published: false, // S'assurer que c'est toujours un brouillon
        },
        data: {
          title: title?.trim() || "Brouillon sans titre",
          content: content?.trim() || "",
          description: description?.trim() || null,
          readTime: readTime || null,
          updatedAt: new Date(),
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
          category: true,
        },
      });

      return {
        success: true,
        article: updatedDraft,
        isNew: false,
      };
    } else {
      // Créer un nouveau brouillon
      const result = await createArticle({
        ...articleData,
        isDraft: true,
        authorId,
      });

      return {
        ...result,
        isNew: true,
      };
    }
  } catch (error) {
    console.error("Error updating or creating draft:", error);
    return {
      success: false,
      error: "Erreur lors de la sauvegarde du brouillon",
    };
  }
}

// Nouvelle fonction pour supprimer un brouillon
export async function deleteDraft(draftId, userId) {
  try {
    // Vérifier que le brouillon appartient à l'utilisateur
    const draft = await prisma.article.findFirst({
      where: {
        id: draftId,
        authorId: userId,
        published: false, // S'assurer que c'est un brouillon
      },
    });

    if (!draft) {
      return {
        success: false,
        error:
          "Brouillon non trouvé ou vous n'êtes pas autorisé à le supprimer",
      };
    }

    // Supprimer le brouillon
    await prisma.article.delete({
      where: {
        id: draftId,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting draft:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression du brouillon",
    };
  }
}
