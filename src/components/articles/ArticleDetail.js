// src/components/articles/ArticleDetail.js

"use client";

import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import NotFound from '@/app/not-found';
import { useState } from 'react';
import InteractiveComments from '@/components/comments/InteractiveComments';
import ArticleActions from '@/components/articles/ArticleActions';

export default function ArticleDetail({ article }) {

  // Calculer le nombre total initial (commentaires + réponses)
  const calculateInitialCount = () => {
    if (!Array.isArray(article.comments)) return 0;
    return article.comments.reduce((total, comment) =>
      total + 1 + (comment.replies ? comment.replies.length : 0), 0
    );
  };

  const [commentsCount, setCommentsCount] = useState(calculateInitialCount());

  if (!article) {
    return NotFound()
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm font-sans text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Accueil</Link>
          <span className="mx-2">/</span>
          <Link href="/articles" className="hover:text-gray-700">Articles</Link>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <h1 className="h1-title text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Author & Meta */}
          <div className="flex items-center text-sm font-sans text-gray-600 mb-6">
            <span>Publié par </span>
            <Link
              href={`/author/${article.author.username}`}
              className="mx-1 text-gray-900 hover:text-teal-600 transition-colors font-medium"
            >
              {article.author.name}
            </Link>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} min de lecture</span>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-transparent mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6 font-sans">
              {article.description}
            </p>

            {/* Contenu dynamique de l'article */}
            <div
              className="space-y-6 text-gray-700 font-sans prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br>') }}
            />
          </div>
        </div>

        {/* Actions & Comments */}
        <div className="bg-transparent p-6">
          {/* Actions */}
          <ArticleActions
            article={article}
            commentsCount={commentsCount}
          />

          {/* Comments Section */}
          <div id="comments-section">

            <InteractiveComments
              articleSlug={article.slug}
              initialComments={article.comments || []}
              onCommentsCountChange={setCommentsCount}
              totalCount={commentsCount}
            />
          </div>

        </div>
      </div>
    </div>
  );
}