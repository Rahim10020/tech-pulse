"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/layout/Header";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchBar from "@/components/shared/SearchBar";
import { Button } from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function HomePage() {
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles?type=recent&limit=3');
        const articles = await response.json();
        setRecentArticles(articles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="body-text text-gray-600 mt-4">Chargement des articles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-8">
        <SearchBar
          placeholder="Rechercher des articles par mots-clés ou catégories"
          className="mb-8"
        />

        <h2 className="h2-title text-gray-900 mb-6">
          Articles récents
        </h2>

        <div className="space-y-4">
          {recentArticles.map((article) => (
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
              horizontal={true}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            href="/articles"
            variant="primary"
            className="h5-title"
          >
            Voir tous les articles
          </Button>
        </div>
      </div>
    </div>
  );
}