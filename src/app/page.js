/**
 * Home page component for Tech Pulse.
 * Displays featured articles, search functionality, and navigation.
 * Fetches and shows recent articles from the API.
 */
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/articles/ArticleCard";
import SearchBar from "@/components/shared/SearchBar";
import HeroSection from "@/components/home/HeroSection";
import { LoadingSpinner } from '@/components/ui';

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
      <div className="min-h-screen bg-gray-50">
        <div className="text-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      <div className="container mx-auto max-w-5xl py-8 -mt-8">
        <SearchBar
          placeholder="Rechercher des articles par mots-clés ou catégories"
          className="mb-8"
        />

        <h2 className="text-2xl font-poppins font-bold text-gray-900">
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
        <div className="text-center mt-8 mb-12">
          <Link href="/articles" className="text-teal-600">
            Voir tous les articles...
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}