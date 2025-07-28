// src/components/articles/ArticleDetail.js - Composant détail d'article
import Link from 'next/link';
import { Calendar, User, Clock, Heart, MessageCircle, Share2 } from 'lucide-react';

export default function ArticleDetail({ article }) {
  if (!article) {
    return (
      <div className="container-sm py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <Link href="/articles" className="btn-primary">
            Retour aux articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-sm py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-700">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/articles" className="hover:text-gray-700">Articles</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{article.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center mb-4">
          <span className="badge badge-primary mr-3">{article.category}</span>
          <span className="text-sm text-gray-500">{article.readTime}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>
        
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {article.description}
        </p>
        
        {/* Author & Meta */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {article.author.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR')}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              <span>{article.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>{article.comments?.length || 0}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
              <Share2 className="w-5 h-5" />
              <span>Partager</span>
            </button>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          {/* Contenu de l'article */}
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              {article.content}
            </p>
            
            {/* Ajoutez plus de contenu selon vos besoins */}
            <p className="text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
              Points clés à retenir
            </h2>
            
            <ul className="space-y-2 text-gray-700">
              <li>• Point important numéro 1</li>
              <li>• Point important numéro 2</li>
              <li>• Point important numéro 3</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Tags :</h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span key={index} className="badge badge-primary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      {article.comments && article.comments.length > 0 && (
        <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Commentaires ({article.comments.length})
          </h3>
          
          <div className="space-y-6">
            {article.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}