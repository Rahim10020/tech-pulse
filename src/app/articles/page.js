// src/app/articles/page.js 
import Header from '@/components/layout/Header';
import ArticleList from '@/components/articles/ArticleList';
import CategoryFilter from '@/components/articles/CategoryFilter';

export const metadata = {
  title: 'Articles - PixelPulse',
  description: 'Discover all our articles on technology',
};

export default async function ArticlesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category || 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-6">
        <h1 className="h2-title text-gray-900 mb-6">
          Derniers articles
        </h1>

        <CategoryFilter activeCategory={category} />

        {/* Utilise le layout horizontal */}
        <ArticleList category={category} layout="horizontal" />
      </div>
    </div>
  );
}