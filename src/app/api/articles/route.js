/**
 * API route for articles management
 * Handles GET requests for fetching articles and POST requests for creating articles
 */
import { successResponse, errorResponse, validationErrorResponse } from '@/lib/api-response';
import { withAuth } from '@/lib/api-auth';
import { getArticles, getFeaturedArticles, getRecentArticles, createArticle } from '@/lib/articles';
import { validatePaginationParams } from '@/lib/validation-utils';

/**
 * GET /api/articles
 * Retrieves articles based on type and filters
 * @param {Request} request - The request object with query parameters
 * @returns {NextResponse} Response with articles data
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'recent';

    // Validation stricte des paramètres de pagination
    const { page, limit } = validatePaginationParams(searchParams);
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

/**
 * Handler for creating a new article
 * @param {Request} request - The request object with article data and authenticated user
 * @returns {NextResponse} Response with created article data
 */
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
