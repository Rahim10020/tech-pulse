// lib/categories.js - Fonctions pour les catégories avec Prisma
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Récupérer toutes les catégories avec le nombre d'articles
export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
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
        name: 'asc'
      }
    });

    return categories.map(category => ({
      ...category,
      count: category._count.articles
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Récupérer une catégorie par son slug
export async function getCategoryBySlug(slug) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
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
      }
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      count: category._count.articles
    };
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

// Récupérer une catégorie par son ID
export async function getCategoryById(id) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
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
      }
    });

    if (!category) {
      return null;
    }

    return {
      ...category,
      count: category._count.articles
    };
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    return null;
  }
}

// Récupérer les catégories les plus populaires (avec le plus d'articles)
export async function getPopularCategories(limit = 5) {
  try {
    const categories = await prisma.category.findMany({
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

    return categories.map(category => ({
      ...category,
      count: category._count.articles
    }));
  } catch (error) {
    console.error('Error fetching popular categories:', error);
    return [];
  }
}

// Créer une nouvelle catégorie
export async function createCategory(data) {
  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        icon: data.icon,
        color: data.color,
        textColor: data.textColor
      }
    });

    return { success: true, category };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, message: 'Erreur lors de la création de la catégorie' };
  }
}

// Mettre à jour une catégorie
export async function updateCategory(id, data) {
  try {
    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.description && { description: data.description }),
        ...(data.icon && { icon: data.icon }),
        ...(data.color && { color: data.color }),
        ...(data.textColor && { textColor: data.textColor })
      }
    });

    return { success: true, category };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, message: 'Erreur lors de la mise à jour de la catégorie' };
  }
}

// Supprimer une catégorie
export async function deleteCategory(id) {
  try {
    // Vérifier s'il y a des articles dans cette catégorie
    const articlesCount = await prisma.article.count({
      where: { categoryId: parseInt(id) }
    });

    if (articlesCount > 0) {
      return { 
        success: false, 
        message: 'Impossible de supprimer une catégorie qui contient des articles' 
      };
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return { success: true, message: 'Catégorie supprimée avec succès' };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, message: 'Erreur lors de la suppression de la catégorie' };
  }
}