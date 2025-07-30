// src/components/profile/AuthorProfile.js - Composant profil auteur (même design que UserProfile)
'use client';

import { useState } from 'react';
import { Calendar, MapPin, Globe, Twitter, Linkedin, Github } from 'lucide-react';

export default function AuthorProfile({ author, articles = [] }) {
  const [activeTab, setActiveTab] = useState('articles');

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
              <h1 className="text-xl font-bold text-gray-900 font-poppins mb-1">
                {author.name}
              </h1>
              <p className="text-gray-500 text-sm font-poppins">
                @{author.username}
              </p>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-700 text-center text-sm leading-relaxed font-poppins">
                {author.bio}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="border-2 border-gray-200 rounded-md p-4">
                <div className="text-xl p-2 font-bold text-gray-900 font-sans">
                  {author.stats?.articles || articles.length}
                </div>
                <div className="text-xs text-gray-500 font-poppins">
                  Articles
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="text-xl font-bold text-gray-900 font-sans">
                  {author.stats?.followers || 0}
                </div>
                <div className="text-xs text-gray-500 font-poppins">
                  Abonnés
                </div>
              </div>
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="text-xl font-bold text-gray-900 font-sans">
                  {author.stats?.following || 0}
                </div>
                <div className="text-xs text-gray-500 font-poppins">
                  Abonnements
                </div>
              </div>
            </div>

            {/* Social Links */}
            {author.social && (
              <div className="flex border-2 border-gray-200 rounded-md p-4 justify-center space-x-3">
                {author.social.twitter && (
                  <a
                    href={`https://twitter.com/${author.social.twitter.replace(
                      "@",
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {author.social.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${author.social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {author.social.github && (
                  <a
                    href={`https://github.com/${author.social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Info */}
            <div className="flex items-center justify-center gap-4 mb-4 mt-7">
              {author.location && (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500 font-poppins">
                  <MapPin className="w-4 h-4 mr-2" />
                  {author.location}
                </div>
              )}
              {author.joinedAt && (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500 font-poppins">
                  <Calendar className="w-4 h-4 mr-2" />
                  Rejoint en {new Date(author.joinedAt).getFullYear()}
                </div>
              )}
              {author.website && (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500 font-poppins">
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

            {/* Specialties */}
            {author.specialties && author.specialties.length > 0 && (
              <div className="mt-7 text-center">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 font-poppins">
                  Spécialités
                </h3>
                <div className="flex justify-center flex-wrap gap-2">
                  {author.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-poppins"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
                Likes
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-2 px-1 border-b-2 font-medium text-sm font-poppins transition-colors ${
                  activeTab === 'comments'
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Commentaires
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
                          <div className="flex items-center text-sm text-gray-500 mb-2 font-poppins">
                            <span>{article.readTime} de lecture</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 font-poppins hover:text-teal-600 transition-colors">
                            <a href={`/articles/${article.slug}`}>
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed font-poppins">
                            {article.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 font-poppins">
                            <span>{article.likes} likes</span>
                            <span>{article.comments} commentaires</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                        <div className={`w-20 h-20 ${article.imageColor} rounded-lg ml-6 flex-shrink-0`}>
                          {/* Placeholder pour image */}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500 font-poppins">Aucun article publié pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-poppins">Aucun like pour le moment.</p>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-poppins">Aucun commentaire pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}