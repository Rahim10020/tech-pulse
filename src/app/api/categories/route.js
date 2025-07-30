// app/api/categories/route.js - API Route pour les catégories
import { NextResponse } from 'next/server';
import { getAllCategories, getCategoryBySlug, getPopularCategories } from '@/lib/categories';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const slug = searchParams.get('slug');
    const limit = parseInt(searchParams.get('limit')) || 10;

    let categories;

    switch (type) {
      case 'popular':
        categories = await getPopularCategories(limit);
        break;
      case 'single':
        if (!slug) {
          return NextResponse.json(
            { error: 'Slug requis pour récupérer une catégorie' },
            { status: 400 }
          );
        }
        categories = await getCategoryBySlug(slug);
        break;
      case 'all':
      default:
        categories = await getAllCategories();
        break;
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}