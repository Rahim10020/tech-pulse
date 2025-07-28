// app/page.js - Page d'accueil SIMPLIFIÉE qui fonctionne
import ArticleCard from '@/components/articles/ArticleCard';
import SearchBar from '@/components/shared/SearchBar';
import { sampleArticles } from '@/lib/data';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header temporaire */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center rounded">
              <span className="text-white font-bold text-sm">TP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechPulse</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <SearchBar 
          placeholder="Rechercher des articles par mots-clés ou catégories"
          className="mb-12"
        />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Articles récents</h2>
        
        <div className="space-y-6">
          {sampleArticles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              description={article.description}
              readTime={article.readTime}
              imageColor={article.imageColor}
              href={`/articles/${article.slug}`}
              author={article.author}
              publishedAt={article.publishedAt}
              category={article.category}
            />
          ))}
        </div>
      </div>
    </div>
  );
}