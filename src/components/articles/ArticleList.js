// src/components/articles/ArticleList.js - Mise à jour pour le nouveau design
'use client';

import { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { ArticleCardSkeleton } from '@/components/ui/Skeleton';

export default function ArticleList({
  category = 'all',
  layout = 'horizontal' // 'horizontal' ou 'grid'
}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadArticles();
  }, [category, currentPage]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles?type=all&page=${currentPage}&limit=6&category=${category}`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des articles');
      }
      const result = await response.json();

      if (result.success) {
        setArticles(result.articles?.articles || []);
        setTotalPages(result.articles?.totalPages || 1);
      } else {
        console.error('API error:', result.error);
        setArticles([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        {layout === 'horizontal' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} horizontal={true} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleCardSkeleton key={i} horizontal={false} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="h3-title text-gray-900 mb-2">
          Aucun article trouvé
        </h3>
        <p className="text-gray-600 font-sans">
          {category === 'all'
            ? 'Aucun article disponible pour le moment.'
            : `Aucun article trouvé dans cette catégorie.`
          }
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Articles List/Grid */}
      {layout === 'horizontal' ? (
        // Layout horizontal (liste)
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200 mb-12">
          {articles.map((article, index) => (
            <div key={article.id} className={index === 0 ? 'rounded-t-lg' : index === articles.length - 1 ? 'rounded-b-lg' : ''}>
              <ArticleCard
                title={article.title}
                content={article.content} // Contenu complet pour extraire l'extrait
                readTime={article.readTime}
                imageColor={article.imageColor}
                imageUrl={article.imageUrl || null} // Nouvelle prop pour l'image
                href={`/articles/${article.slug}`}
                author={article.author}
                publishedAt={article.publishedAt}
                category={article.category}
                likes={article.likes || 0} // Stats de likes
                commentsCount={article.commentsCount || 0} // Stats de commentaires
                horizontal={true}
              />
            </div>
          ))}
        </div>
      ) : (
        // Layout grille
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              title={article.title}
              content={article.content}
              readTime={article.readTime}
              imageColor={article.imageColor}
              imageUrl={article.imageUrl || null}
              href={`/articles/${article.slug}`}
              author={article.author}
              publishedAt={article.publishedAt}
              category={article.category}
              likes={article.likes || 0}
              commentsCount={article.commentsCount || 0}
              horizontal={false}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 text-sm font-poppins font-medium rounded-lg transition-colors ${currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="px-2 text-gray-500 font-sans">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 text-sm font-poppins font-medium rounded-lg transition-colors ${currentPage === totalPages
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}