// src/components/articles/ArticleCard.js
import Link from "next/link";
import { Calendar, Clock, User, Heart, MessageCircle, Star } from "lucide-react";

export default function ArticleCard({
  title,
  content,
  readTime,
  imageColor = "bg-gray-100",
  imageUrl = null,
  href = "#",
  author,
  publishedAt,
  category,
  likes = 0,
  commentsCount = 0,
  horizontal = false,
}) {
  // Gérer category comme objet ou string
  const categoryName = typeof category === "object" ? category?.name : category;
  const categoryColor = typeof category === "object" ? category?.color : "bg-gray-100";
  const categoryTextColor = typeof category === "object" ? category?.textColor : "text-gray-600";

  // Fonction pour extraire un extrait propre du contenu HTML
  const getContentExcerpt = (htmlContent, maxLength = 150) => {
    if (!htmlContent) return '';

    // Supprimer les balises HTML
    const textOnly = htmlContent
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (textOnly.length <= maxLength) {
      return textOnly;
    }

    // Couper au dernier espace pour éviter de couper un mot
    const excerpt = textOnly.substring(0, maxLength);
    const lastSpaceIndex = excerpt.lastIndexOf(' ');

    if (lastSpaceIndex > 0) {
      return excerpt.substring(0, lastSpaceIndex) + '...';
    }

    return excerpt + '...';
  };

  if (horizontal) {
    // Layout horizontal (liste)
    return (
      <Link href={href} className="block group w-full">
        <article className="article-horizontal">
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              {/* Auteur et catégorie */}
              <div className="flex items-center mb-3 space-x-6">
                {/* Avatar auteur */}
                <div className="flex items-center space-x-2">
                  <div className="author-avatar">
                    <span className="text-white font-bold text-xs font-poppins">
                      {typeof author === "object" ? author.name?.charAt(0) : author?.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium font-sans">
                    {typeof author === "object" ? author.name : author}
                  </span>
                </div>

                {/* Catégorie */}
                {categoryName && (
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor} ${categoryTextColor}`}>
                    {categoryName}
                  </span>
                )}
              </div>

              {/* Titre */}
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-teal-600 transition-colors font-poppins line-clamp-2">
                {title}
              </h2>

              {/* Extrait du contenu */}
              <p className="text-gray-600 text-sm font-sans leading-relaxed mb-4 line-clamp-2">
                {getContentExcerpt(content, 150)}
              </p>

              {/* Statistiques et métadonnées */}
              <div className="flex items-center justify-between">
                <div className="article-stats">
                  {/* Temps de lecture */}
                  {readTime && (
                    <div className="article-stat-item">
                      <span className="font-sans">{readTime}</span>
                    </div>
                  )}

                  {/* Likes */}
                  <div className="article-stat-item">
                    <Heart className="w-4 h-4" />
                    <span className="font-sans">{likes?.toLocaleString() || "0"}</span>
                  </div>

                  {/* Commentaires */}
                  <div className="article-stat-item">
                    <MessageCircle className="w-4 h-4" />
                    <span className="font-sans">{commentsCount || "0"}</span>
                  </div>
                </div>

                {/* Date de publication */}
                {publishedAt && (
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span className="font-sans">
                      {new Date(publishedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Image à droite */}
            <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="article-image w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className={`w-full h-full ${imageColor} flex items-center justify-center group-hover:opacity-80 transition-opacity`}>
                  <span className="text-white text-xs font-semibold opacity-50">IMG</span>
                </div>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // Layout vertical (grille)
  return (
    <Link href={href} className="block group">
      <article className="article-card h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        {/* Image en haut */}
        <div className="relative h-48 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="article-image w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${imageColor} relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Catégorie en overlay */}
          {categoryName && (
            <div className="absolute top-4 left-4">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor} ${categoryTextColor} bg-opacity-90 backdrop-blur-sm`}>
                {categoryName}
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Auteur */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="author-avatar">
              <span className="text-white font-bold text-xs font-poppins">
                {typeof author === "object" ? author.name?.charAt(0) : author?.charAt(0)}
              </span>
            </div>
            <span className="text-sm text-gray-700 font-medium font-sans">
              {typeof author === "object" ? author.name : author}
            </span>
          </div>

          {/* Titre */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors font-poppins line-clamp-2">
            {title}
          </h2>

          {/* Extrait du contenu */}
          <p className="text-gray-600 text-sm font-sans leading-relaxed mb-4 line-clamp-3">
            {getContentExcerpt(content, 120)}
          </p>

          {/* Footer avec stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="article-stats">
              {/* Temps de lecture */}
              {readTime && (
                <div className="article-stat-item">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-sans">{readTime}</span>
                </div>
              )}

              {/* Likes */}
              <div className="article-stat-item">
                <Heart className="w-4 h-4 text-red-500" />
                <span className="font-sans">{likes?.toLocaleString() || "0"}</span>
              </div>

              {/* Commentaires */}
              <div className="article-stat-item">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="font-sans">{commentsCount || "0"}</span>
              </div>
            </div>

            {/* Date */}
            {publishedAt && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="font-sans">
                  {new Date(publishedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short"
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}