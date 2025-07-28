// app/articles/[slug]/page.js - Page article détaillé
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ArticleDetail from '@/components/articles/ArticleDetail';
import { getArticleBySlug } from '@/lib/articles';

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article non trouvé - TechPulse',
    };
  }

  return {
    title: `${article.title} - TechPulse`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      authors: [article.author.name],
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ArticleDetail article={article} />
    </div>
  );
}
