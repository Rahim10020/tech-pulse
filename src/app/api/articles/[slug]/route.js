// app/api/articles/[slug]/route.js
import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';

export async function GET(request, { params }) {
  try {
    const article = await getArticleBySlug(params.slug);
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}