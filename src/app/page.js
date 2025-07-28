// src/app/page.js - Page d'accueil MODIFIÉE pour utiliser le layout horizontal aussi
import Header from "@/components/layout/Header";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchBar from "@/components/shared/SearchBar";
import { sampleArticles } from "@/lib/data";

export default function HomePage() {
  // Prendre les 3 articles les plus récents
  const recentArticles = sampleArticles.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-4">
        <SearchBar
          placeholder="Rechercher des articles par mots-clés ou catégories"
          className="mb-6"
        />

        <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4">
          Articles récents
        </h2>

        {/* Articles en layout horizontal */}
        {recentArticles.map((article, index) => (
          <div
            key={article.id}
            className={
              index === 0
                ? "rounded-t-lg"
                : index === recentArticles.length - 1
                ? "rounded-b-lg"
                : "w-full"
            }
          >
            <ArticleCard
              title={article.title}
              description={article.description}
              readTime={article.readTime}
              imageColor={article.imageColor}
              href={`/articles/${article.slug}`}
              author={article.author}
              publishedAt={article.publishedAt}
              category={article.category}
              horizontal={true}
            />
          </div>
        ))}

        {/* Lien vers tous les articles */}
        <div className="text-center mt-8">
          <a href="/articles" className="btn-primary">
            Voir tous les articles
          </a>
        </div>
      </div>
    </div>
  );
}
