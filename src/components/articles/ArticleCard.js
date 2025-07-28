// components/articles/ArticleCard.js - Composant simple pour commencer
import Link from 'next/link';

export default function ArticleCard({ 
  title, 
  description, 
  readTime, 
  imageColor = "bg-gray-100",
  href = "#",
  author,
  publishedAt,
  category
}) {
  return (
    <Link href={href} className="block">
      <article className="article-card">
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center mb-3">
              {category && (
                <span className="badge badge-primary mr-2">{category}</span>
              )}
              {readTime && (
                <span className="text-xs text-gray-500">{readTime}</span>
              )}
            </div>
            
            <h2 className="article-title">{title}</h2>
            <p className="article-description mb-4">{description}</p>
            
            <div className="article-meta">
              {author && <span>Par {author.name}</span>}
              {author && publishedAt && <span className="mx-2">•</span>}
              {publishedAt && (
                <span>{new Date(publishedAt).toLocaleDateString('fr-FR')}</span>
              )}
            </div>
          </div>
          
          <div className={`w-24 h-20 ${imageColor} flex-shrink-0 rounded-r-lg`}>
            {/* Placeholder pour image */}
          </div>
        </div>
      </article>
    </Link>
  );
}