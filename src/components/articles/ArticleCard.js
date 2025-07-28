// src/components/articles/ArticleCard.js - VERSION HORIZONTALE
import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';

export default function ArticleCard({ 
  title, 
  description, 
  readTime, 
  imageColor = "bg-gray-100",
  href = "#",
  author,
  publishedAt,
  category,
  horizontal = false
}) {
  if (horizontal) {
    // Layout horizontal (liste)
    return (
      <Link href={href} className="block group">
        <article className="bg-white border-b border-gray-200 py-8 hover:bg-gray-50 transition-colors">
          <div className="flex items-start space-x-6">
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center mb-3">
                {category && (
                  <span className="text-sm font-medium text-gray-600 mr-3">
                    {category}
                  </span>
                )}
                {readTime && (
                  <span className="text-sm text-gray-500">
                    {readTime}
                  </span>
                )}
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-3 leading-tight group-hover:text-teal-600 transition-colors">
                {title}
              </h2>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {description}
              </p>
              
              {/* Author & Date */}
              <div className="flex items-center text-sm text-gray-500">
                {author && (
                  <>
                    <span>Par {author.name}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                {publishedAt && (
                  <span>{new Date(publishedAt).toLocaleDateString('fr-FR')}</span>
                )}
              </div>
            </div>
            
            {/* Image placeholder */}
            <div className={`w-32 h-24 ${imageColor} rounded-lg flex-shrink-0`}>
              {/* Placeholder pour image */}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Layout vertical (grille) - version existante
  return (
    <Link href={href} className="block group">
      <article className="article-card h-full">
        <div className={`h-48 ${imageColor} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          {category && (
            <div className="absolute top-4 left-4">
              <span className="badge badge-primary bg-white/90 text-gray-800">
                {category}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h2 className="article-title group-hover:text-teal-600 transition-colors">
            {title}
          </h2>
          
          <p className="article-description mb-4 line-clamp-3">
            {description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {author && (
                <span className="flex items-center">
                  <span className="w-6 h-6 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full mr-2"></span>
                  {author.name}
                </span>
              )}
              {publishedAt && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(publishedAt).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
            
            {readTime && (
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {readTime}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}