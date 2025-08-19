// ==========================================
// 1. app/api/articles/route.js
// ==========================================
import { NextResponse } from 'next/server';
import { getArticles, getFeaturedArticles, getRecentArticles, createArticle } from '@/lib/articles';
import { verifyToken } from '@/lib/auth';

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

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Token invalide' },
        { status: 401 }
      );
    }

    const articleData = await request.json();

    // Cette route est UNIQUEMENT pour publier des articles (pas des brouillons)
    const result = await createArticle({
      ...articleData,
      authorId: decoded.userId
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        article: result.article,
        message: 'Article publié avec succès'
      });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
