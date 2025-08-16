// src/components/articles/AuthorProfile.js - Version avec styles cohérents
'use client';

import { useState } from 'react';
import { Calendar, MapPin, Globe, Twitter, Linkedin, Github } from 'lucide-react';

export default function AuthorProfile({ author }) {
  const [activeTab, setActiveTab] = useState('articles');

  // Articles viennent maintenant d'author.articles (depuis l'API)
  const articles = author.articles || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sticky top-24">
            {/* Avatar */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center mb-4">
                <span className="text-white font-bold text-2xl font-poppins">
                  {author.name.charAt(0)}
                </span>
              </div>
              <h1 className="h3-title text-gray-900 mb-1">
                {author.name}
              </h1>
              <p className="text-gray-500 text-sm font-sans">
                @{author.username}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-700 text-center text-sm leading-relaxed font-sans">
                {author.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="border-2 border-gray-200 rounded-md p-4">
                <div className="text-xl p-2 font-bold text-gray-900 font-sans">
                  {author.stats?.articles || articles.length}
                </div>
                <div className="h6-title text-gray-500">
                  Articles
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="text-xl font-bold text-gray-900 font-sans">
                  {author.stats?.comments || 0}
                </div>
                <div className="h6-title text-gray-500">
                  Commentaires
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="text-xl font-bold text-gray-900 font-sans">
                  {/* Calculer les likes totaux des articles */}
                  {articles.reduce((total, article) => total + (article.likes || 0), 0)}
                </div>
                <div className="h6-title text-gray-500">
                  Likes reçus
                </div>
              </div>
            </div>

            {/* Social Links - Nouveau format PostgreSQL */}
            <div className="flex border-2 border-gray-200 rounded-md p-4 justify-center space-x-3">
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {author.linkedin && (
                <a
                  href={`https://linkedin.com/in/${author.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {author.github && (
                <a
                  href={`https://github.com/${author.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
            </div>

            {/* Info */}
            <div className="flex items-center justify-center gap-4 mb-4 mt-7">
              {author.location && (
                <div className="flex flex-col items-center gap-2 text-sm font-sans text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {author.location}
                </div>
              )}
              {author.joinedAt && (
                <div className="flex flex-col items-center gap-2 text-sm font-sans text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Rejoint en {new Date(author.joinedAt).getFullYear()}
                </div>
              )}
              {author.website && (
                <div className="flex flex-col items-center gap-2 text-sm font-sans text-gray-500">
                  <Globe className="w-4 h-4 mr-2" />
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:underline"
                  >
                    {author.website.replace("https://", "")}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-poppins transition-colors ${
                  activeTab === 'articles'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Articles ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('likes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-poppins transition-colors ${
                  activeTab === 'likes'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Likes reçus
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-poppins transition-colors ${
                  activeTab === 'comments'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Commentaires ({author.stats?.comments || 0})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'articles' && (
              <div className="space-y-6">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <div key={article.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-gray-500 mb-2 font-sans">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${article.category?.color || 'bg-gray-100'} ${article.category?.textColor || 'text-gray-600'} mr-3`}>
                              {article.category?.name || 'Sans catégorie'}
                            </span>
                            <span>{article.readTime} de lecture</span>
                          </div>
                          <h3 className="h4-title text-gray-900 mb-2 hover:text-teal-600 transition-colors">
                            <a href={`/articles/${article.slug}`}>
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed font-sans">
                            {article.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 font-sans">
                            <span>{article.likes || 0} likes</span>
                            <span>{article.commentsCount || 0} commentaires</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                          
                          {/* Tags si disponibles */}
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {article.tags.map((tag, index) => (
                                <span
                                  key={tag.id || `tag-${article.id}-${index}`}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-sans"
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className={`w-20 h-20 ${article.imageColor || 'bg-gray-200'} rounded-lg ml-6 flex-shrink-0`}>
                          {/* Placeholder pour image */}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-sans">Aucun article publié pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <div className="text-4xl font-bold text-gray-900 mb-2 font-sans">
                  {articles.reduce((total, article) => total + (article.likes || 0), 0)}
                </div>
                <p className="text-gray-500 font-sans">Likes reçus au total sur tous les articles</p>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="text-center py-12">
                <div className="text-4xl font-bold text-gray-900 mb-2 font-sans">
                  {author.stats?.comments || 0}
                </div>
                <p className="text-gray-500 font-sans">Commentaires écrits sur le blog</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}