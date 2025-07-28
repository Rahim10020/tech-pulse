// app/articles/page.js - Page des articles
import Header from '@/components/layout/Header';
import ArticleList from '@/components/articles/ArticleList';
import CategoryFilter from '@/components/articles/CategoryFilter';

export const metadata = {
  title: 'Articles - TechPulse',
  description: 'Découvrez tous nos articles sur la technologie',
};

export default function ArticlesPage({ searchParams }) {
  const category = searchParams?.category || 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Derniers Articles</h1>
        
        <CategoryFilter activeCategory={category} />
        <ArticleList category={category} />
      </div>
    </div>
  );
}