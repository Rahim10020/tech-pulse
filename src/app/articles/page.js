// src/app/articles/page.js - MODIFIÉ pour utiliser le layout horizontal
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
      <div className="container-sm py-6">
        <h1 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
          Derniers Articles
        </h1>
        
        <CategoryFilter activeCategory={category} />
        
        {/* Utilise le layout horizontal */}
        <ArticleList category={category} layout="horizontal" />
      </div>
    </div>
  );
}