// src/components/articles/ArticleDetail.js - Corrigé avec données dynamiques
import Link from 'next/link';
import { Heart, MessageCircle } from 'lucide-react';
import NotFound from '@/app/not-found';

export default function ArticleDetail({ article }) {
  if (!article) {
    return NotFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm font-sans text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
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
            <span>Published by </span>
            <Link
              href={`/author/${article.author.username}`}
              className="mx-1 text-gray-900 hover:text-teal-600 transition-colors font-medium"
            >
              {article.author.name}
            </Link>
            <span className="mx-2">•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
            <span className="mx-2">•</span>
            <span>{article.readTime} reading</span>
          </div>
        </header>

        {/* Article Image */}
        <div className="mb-8">
          <div className={`w-full h-96 ${article.imageColor || 'bg-gradient-to-br from-teal-400 via-teal-500 to-green-600'} rounded-md flex items-center justify-center`}>
            {/* Placeholder pour l'image de l'article */}
            <div className="text-white text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-transparent p-8 mb-8">
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
          <div className="flex items-center space-x-6 mb-8 pb-6 border-b border-gray-200">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors font-sans">
              <Heart className="w-5 h-5" />
              <span>{article.likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors font-sans">
              <MessageCircle className="w-5 h-5" />
              <span>{article.comments?.length || 0}</span>
            </button>
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="h2-title text-gray-900 mb-6">
              Comments {article.comments?.length > 0 && `(${article.comments.length})`}
            </h3>

            {/* Comments List - Données dynamiques */}
            <div className="space-y-6">
              {article.comments && article.comments.length > 0 ? (
                article.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex-shrink-0 flex items-center justify-center">
                      <span className="text-white font-medium text-sm font-sans">
                        {comment.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="h5-title text-gray-900">
                          {comment.author.name}
                        </span>
                        <span className="text-sm font-sans text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed font-sans">
                        {comment.content}
                      </p>

                      {/* Afficher les réponses si elles existent */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex-shrink-0 flex items-center justify-center">
                                <span className="text-white font-medium text-xs font-sans">
                                  {reply.author.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="h6-title text-gray-900">
                                    {reply.author.name}
                                  </span>
                                  <span className="text-xs font-sans text-gray-500">
                                    {new Date(reply.createdAt).toLocaleDateString('fr-FR')}
                                  </span>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed font-sans">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 font-sans">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            {/* Comment Form */}
            <div className="mt-8">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-white font-medium text-sm font-poppins">U</span>
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Ajouter un commentaire..."
                    className="w-full p-3 border-2 border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-sans"
                    rows="3"
                  />
                  <div className="mt-3 flex justify-end">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-poppins">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}