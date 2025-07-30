// app/api/articles/route.js - API Route pour les articles
import { NextResponse } from 'next/server';
import { getArticles, getFeaturedArticles, getRecentArticles } from '@/lib/articles';

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