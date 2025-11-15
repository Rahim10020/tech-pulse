'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Heart, MessageCircle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { getHtmlExcerpt } from '@/lib/text-utils';

/**
 * ArticleImage component displays the article image with category overlay
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - URL of the article image
 * @param {string} props.title - Article title for alt text
 * @param {string} props.imageColor - Background color for placeholder
 * @param {string} props.categoryName - Category name
 * @param {string} props.categoryColor - Category background color
 * @param {string} props.categoryTextColor - Category text color
 * @param {boolean} props.horizontal - Whether to use horizontal layout
 * @returns {JSX.Element} Article image element
 */
const ArticleImage = React.memo(function ArticleImage({
  imageUrl,
  title,
  imageColor,
  categoryName,
  categoryColor,
  categoryTextColor,
  horizontal
}) {
  if (horizontal) {
    return (
      <div className="flex-shrink-0 w-32 h-24 relative overflow-hidden rounded-lg">
        {imageUrl ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${imageColor} flex items-center justify-center`}>
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden group">
      {imageUrl ? (
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-full h-full ${imageColor} flex items-center justify-center`}>
          <span className="text-gray-400">No image</span>
        </div>
      )}
      {categoryName && (
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/20 ${categoryTextColor} shadow-lg`}>
            {categoryName}
          </span>
        </div>
      )}
    </div>
  );
});

/**
 * ArticleMeta component displays article author and category information
 * @param {Object} props - Component props
 * @param {string|Object} props.author - Author name or author object
 * @param {string} props.categoryName - Category name
 * @param {string} props.categoryColor - Category background color
 * @param {string} props.categoryTextColor - Category text color
 * @param {boolean} props.horizontal - Whether to use horizontal layout
 * @returns {JSX.Element} Article meta information
 */
const ArticleMeta = React.memo(function ArticleMeta({ author, categoryName, categoryColor, categoryTextColor, horizontal }) {
  const authorName = typeof author === "object" ? author.name : author;
  const authorInitial = authorName?.charAt(0);

  if (horizontal) {
    return (
      <div className="flex items-center mb-3 space-x-6">
        <div className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="author-avatar"
          >
            <span className="text-white font-bold text-xs font-poppins">
              {authorInitial}
            </span>
          </motion.div>
          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium font-sans">
            {authorName}
          </span>
        </div>

        {categoryName && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm bg-opacity-80 ${categoryColor} ${categoryTextColor} shadow-sm`}>
            {categoryName}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 mb-3">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="author-avatar"
      >
        <span className="text-white font-bold text-xs font-poppins">
          {authorInitial}
        </span>
      </motion.div>
      <span className="text-sm text-gray-700 dark:text-gray-300 font-medium font-sans">
        {authorName}
      </span>
    </div>
  );
});

/**
 * ArticleStats component displays article statistics like read time, likes, comments, and publication date
 * @param {Object} props - Component props
 * @param {string} props.readTime - Estimated reading time
 * @param {number} props.likes - Number of likes
 * @param {number} props.commentsCount - Number of comments
 * @param {string} props.publishedAt - Publication date
 * @param {boolean} props.horizontal - Whether to use horizontal layout
 * @returns {JSX.Element} Article statistics
 */
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
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span className="font-sans">{formatDate(publishedAt)}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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

/**
 * ArticleCard component displays an article preview with image, meta information, and stats.
 * Supports both vertical and horizontal layouts.
 *
 * @param {Object} props - The component props
 * @param {string} props.title - The article title
 * @param {string} props.content - The article content (HTML)
 * @param {string} props.readTime - Estimated reading time
 * @param {string} [props.imageColor='bg-gray-100'] - Background color for placeholder image
 * @param {string} [props.imageUrl=null] - URL of the article image
 * @param {string} [props.href='#'] - Link to the full article
 * @param {string|Object} props.author - Author name or author object
 * @param {string} props.publishedAt - Publication date
 * @param {string|Object} props.category - Category name or category object
 * @param {number} [props.likes=0] - Number of likes
 * @param {number} [props.commentsCount=0] - Number of comments
 * @param {boolean} [props.horizontal=false] - Whether to use horizontal layout
 * @returns {JSX.Element} The article card element
 */
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
        <motion.article
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
          className="article-horizontal"
        >
          <div className="flex items-start space-x-6">
            <div className="flex-1">
              <ArticleMeta
                author={author}
                categoryName={categoryName}
                categoryColor={categoryColor}
                categoryTextColor={categoryTextColor}
                horizontal={horizontal}
              />

              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors font-poppins line-clamp-2">
                {title}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm font-sans leading-relaxed mb-4 line-clamp-2">
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
        </motion.article>
      </Link>
    );
  }

  return (
    <Link href={href} className="block group">
      <motion.article
        whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        transition={{ duration: 0.3 }}
        className="article-card h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden relative"
      >
        {/* Glassmorphism overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/0 to-orange-500/0 group-hover:from-teal-500/5 group-hover:to-orange-500/5 transition-all duration-300 pointer-events-none z-10" />

        <ArticleImage
          imageUrl={imageUrl}
          title={title}
          imageColor={imageColor}
          categoryName={categoryName}
          categoryColor={categoryColor}
          categoryTextColor={categoryTextColor}
          horizontal={horizontal}
        />

        <div className="p-6 relative z-20">
          <ArticleMeta
            author={author}
            categoryName={categoryName}
            categoryColor={categoryColor}
            categoryTextColor={categoryTextColor}
            horizontal={horizontal}
          />

          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors font-poppins line-clamp-2">
            {title}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm font-sans leading-relaxed mb-4 line-clamp-3">
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

        {/* Bottom accent line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-orange-500"
          initial={{ width: 0 }}
          whileInView={{ width: '0%' }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </motion.article>
    </Link>
  );
});

export default ArticleCard;