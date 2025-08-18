// app/api/articles/[slug]/route.js
import { NextResponse } from 'next/server';
import { getArticleBySlug } from '@/lib/articles';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const token = request.cookies.get('token')?.value;
    let userId = null;

    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        userId = decoded.userId;
      }
    }

    const article = await getArticleBySlug(slug, userId);

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