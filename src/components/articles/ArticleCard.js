// src/components/articles/ArticleCard.js
import React from "react";
import Link from "next/link";
import { Calendar, Clock, Heart, MessageCircle, Star } from "lucide-react";
import { getHtmlExcerpt } from "@/lib/utils";

// Extracted components for better reusability
const ArticleImage = React.memo(function ArticleImage({ imageUrl, title, imageColor, categoryName, categoryColor, categoryTextColor, horizontal }) {
  if (horizontal) {
    return (
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
    );
  }

  return (
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

      {categoryName && (
        <div className="absolute top-4 left-4">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor} ${categoryTextColor} bg-opacity-90 backdrop-blur-sm`}>
            {categoryName}
          </span>
        </div>
      )}
    </div>
  );
});

const ArticleMeta = React.memo(function ArticleMeta({ author, categoryName, categoryColor, categoryTextColor, horizontal }) {
  const authorName = typeof author === "object" ? author.name : author;
  const authorInitial = authorName?.charAt(0);

  if (horizontal) {
    return (
      <div className="flex items-center mb-3 space-x-6">
        <div className="flex items-center space-x-2">
          <div className="author-avatar">
            <span className="text-white font-bold text-xs font-poppins">
              {authorInitial}
            </span>
          </div>
          <span className="text-sm text-gray-700 font-medium font-sans">
            {authorName}
          </span>
        </div>

        {categoryName && (
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryColor} ${categoryTextColor}`}>
            {categoryName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 mb-3">
      <div className="author-avatar">
        <span className="text-white font-bold text-xs font-poppins">
          {authorInitial}
        </span>
      </div>
      <span className="text-sm text-gray-700 font-medium font-sans">
        {authorName}
      </span>
    </div>
  );
});

const ArticleStats = React.memo(function ArticleStats({ readTime, likes, commentsCount, publishedAt, horizontal }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: horizontal ? "short" : "short",
      year: horizontal ? "numeric" : undefined
    });
  };

  const stats = (
    <div className="article-stats">
      {readTime && (
        <div className="article-stat-item">
          {horizontal ? (
            <span className="font-sans">{readTime}</span>
          ) : (
            <>
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-sans">{readTime}</span>
            </>
          )}
        </div>
      )}

      <div className="article-stat-item">
        <Heart className={`w-4 h-4 ${horizontal ? '' : 'text-red-500'}`} />
        <span className="font-sans">{likes?.toLocaleString() || "0"}</span>
      </div>

      <div className="article-stat-item">
        <MessageCircle className={`w-4 h-4 ${horizontal ? '' : 'text-blue-500'}`} />
        <span className="font-sans">{commentsCount || "0"}</span>
      </div>
    </div>
  );

  if (horizontal) {
    return (
      <div className="flex items-center justify-between">
        {stats}
        {publishedAt && (
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="font-sans">{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      {stats}
      {publishedAt && (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" />
          <span className="font-sans">{formatDate(publishedAt)}</span>
        </div>
      )}
    </div>
  );
});

const ArticleCard = React.memo(function ArticleCard({
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
  // Handle category as object or string
  const categoryName = typeof category === "object" ? category?.name : category;
  const categoryColor = typeof category === "object" ? category?.color : "bg-gray-100";
  const categoryTextColor = typeof category === "object" ? category?.textColor : "text-gray-600";

  // Use utility function for excerpt
  const excerpt = getHtmlExcerpt(content || '', horizontal ? 150 : 120);

  if (horizontal) {
    return (
      <Link href={href} className="block group w-full">
        <article className="article-horizontal">
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <ArticleMeta
                author={author}
                categoryName={categoryName}
                categoryColor={categoryColor}
                categoryTextColor={categoryTextColor}
                horizontal={horizontal}
              />

              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-teal-600 transition-colors font-poppins line-clamp-2">
                {title}
              </h2>

              <p className="text-gray-600 text-sm font-sans leading-relaxed mb-4 line-clamp-2">
                {excerpt}
              </p>

              <ArticleStats
                readTime={readTime}
                likes={likes}
                commentsCount={commentsCount}
                publishedAt={publishedAt}
                horizontal={horizontal}
              />
            </div>

            <ArticleImage
              imageUrl={imageUrl}
              title={title}
              imageColor={imageColor}
              categoryName={categoryName}
              categoryColor={categoryColor}
              categoryTextColor={categoryTextColor}
              horizontal={horizontal}
            />
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <article className="article-card h-full bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
        <ArticleImage
          imageUrl={imageUrl}
          title={title}
          imageColor={imageColor}
          categoryName={categoryName}
          categoryColor={categoryColor}
          categoryTextColor={categoryTextColor}
          horizontal={horizontal}
        />

        <div className="p-6">
          <ArticleMeta
            author={author}
            categoryName={categoryName}
            categoryColor={categoryColor}
            categoryTextColor={categoryTextColor}
            horizontal={horizontal}
          />

          <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-teal-600 transition-colors font-poppins line-clamp-2">
            {title}
          </h2>

          <p className="text-gray-600 text-sm font-sans leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>

          <ArticleStats
            readTime={readTime}
            likes={likes}
            commentsCount={commentsCount}
            publishedAt={publishedAt}
            horizontal={horizontal}
          />
        </div>
      </article>
    </Link>
  );
});

export default ArticleCard;