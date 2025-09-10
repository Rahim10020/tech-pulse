// ==========================================
// 1. app/api/articles/route.js
// ==========================================
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { withAuth } from '@/lib/api-auth';
import { getArticles, getFeaturedArticles, getRecentArticles, createArticle } from '@/lib/articles';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'recent';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');

    let articles;

    switch (type) {
      case 'featured':
        articles = await getFeaturedArticles(limit);
        break;
      case 'recent':
        articles = await getRecentArticles(limit);
        break;
      case 'all':
        articles = await getArticles(page, limit, category);
        break;
      default:
        articles = await getRecentArticles(limit);
    }

    return successResponse({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return errorResponse('Erreur lors de la récupération des articles', 'FETCH_ERROR');
  }
}

async function createArticleHandler(request) {
  try {
    const articleData = await request.json();

    // Cette route est UNIQUEMENT pour publier des articles (pas des brouillons)
    const result = await createArticle({
      ...articleData,
      authorId: request.user.id
    });

    if (result.success) {
      return successResponse({
        article: result.article
      }, 'Article publié avec succès');
    } else {
      return validationErrorResponse(result.error, 'VALIDATION_ERROR');
    }
  } catch (error) {
    console.error('Error creating article:', error);
    return errorResponse('Erreur interne du serveur', 'INTERNAL_ERROR');
  }
}

export const POST = withAuth(createArticleHandler);
