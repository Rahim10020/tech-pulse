/**
 * Home page component for Tech Pulse.
 * Displays featured articles, search functionality, and navigation.
 * Fetches and shows recent articles from the API.
 */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchBar from "@/components/shared/SearchBar";
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HomePage() {
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await fetch('/api/articles?type=recent&limit=3');
        const data = await response.json();
        setRecentArticles(data.articles || []);
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
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-4">
        <SearchBar
          placeholder="Rechercher des articles par mots-clés ou catégories"
          className="mb-6"
        />

        <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4">
          Articles recents
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
              horizontal={true}
            />
          </div>
        ))}

        {/* Lien vers tous les articles */}
        <div className="text-center mt-8">
          <Link href="/articles" className="text-blue-500 underline">
            Voir tous les articles...
          </Link>
        </div>
      </div>
    </div>
  );
}