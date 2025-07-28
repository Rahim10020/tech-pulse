// src/lib/articles.js - Fonctions pour les articles
import { sampleArticles, comments } from './data';

// Récupérer un article par son slug
export async function getArticleBySlug(slug) {
  // Simulation d'un délai d'API
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const article = sampleArticles.find(article => article.slug === slug);
  
  if (!article) {
    return null;
  }
  
  // Ajouter les commentaires à l'article
  const articleComments = comments.filter(comment => comment.articleId === article.id);
  
  return {
    ...article,
    comments: articleComments
  };
}

// Récupérer un article par son ID
export async function getArticleById(id) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const article = sampleArticles.find(article => article.id === parseInt(id));
  
  if (!article) {
    return null;
  }
  
  const articleComments = comments.filter(comment => comment.articleId === article.id);
  
  return {
    ...article,
    comments: articleComments
  };
}

// Récupérer tous les articles avec pagination
export async function getArticles(page = 1, limit = 10, category = null) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  let filteredArticles = [...sampleArticles];
  
  // Filtrer par catégorie si spécifiée
  if (category && category !== 'all') {
    filteredArticles = filteredArticles.filter(article => 
      article.category.toLowerCase().replace(/\s+/g, '-') === category
    );
  }
  
  // Trier par date de publication (plus récent en premier)
  filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedArticles = filteredArticles.slice(start, end);
  
  return {
    articles: paginatedArticles,
    totalArticles: filteredArticles.length,
    totalPages: Math.ceil(filteredArticles.length / limit),
    currentPage: page,
    hasNextPage: end < filteredArticles.length,
    hasPreviousPage: page > 1
  };
}

// Récupérer les articles en vedette
export async function getFeaturedArticles(limit = 3) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const featuredArticles = sampleArticles
    .filter(article => article.featured)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
  
  return featuredArticles;
}

// Récupérer les articles par auteur
export async function getArticlesByAuthor(authorId, limit = 10) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const authorArticles = sampleArticles
    .filter(article => article.author.id === parseInt(authorId))
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
  
  return authorArticles;
}

// Rechercher des articles
export async function searchArticles(query, limit = 10) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const searchTerm = query.toLowerCase();
  
  const results = sampleArticles.filter(article => 
    article.title.toLowerCase().includes(searchTerm) ||
    article.description.toLowerCase().includes(searchTerm) ||
    article.content.toLowerCase().includes(searchTerm) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    article.category.toLowerCase().includes(searchTerm) ||
    article.author.name.toLowerCase().includes(searchTerm)
  );
  
  return results
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

// Récupérer les articles populaires (basé sur les likes)
export async function getPopularArticles(limit = 5) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return sampleArticles
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

// Récupérer les articles récents
export async function getRecentArticles(limit = 5) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return sampleArticles
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

// Récupérer les articles liés (même catégorie, excluant l'article actuel)
export async function getRelatedArticles(articleId, limit = 3) {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const currentArticle = sampleArticles.find(article => article.id === parseInt(articleId));
  
  if (!currentArticle) {
    return [];
  }
  
  return sampleArticles
    .filter(article => 
      article.id !== parseInt(articleId) && 
      article.category === currentArticle.category
    )
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
}

// Générer les slugs pour le sitemap ou la génération statique
export async function getAllArticleSlugs() {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return sampleArticles.map(article => ({
    slug: article.slug,
    lastModified: article.publishedAt
  }));
}

// Incrémenter les vues d'un article (simulation)
export async function incrementArticleViews(articleId) {
  // Dans une vraie app, ceci ferait un appel API
  console.log(`Incrementing views for article ${articleId}`);
  return true;
}

// Ajouter un like à un article (simulation)
export async function likeArticle(articleId) {
  // Dans une vraie app, ceci ferait un appel API
  console.log(`Liking article ${articleId}`);
  return true;
}

// Retirer un like d'un article (simulation)
export async function unlikeArticle(articleId) {
  // Dans une vraie app, ceci ferait un appel API
  console.log(`Unliking article ${articleId}`);
  return true;
}