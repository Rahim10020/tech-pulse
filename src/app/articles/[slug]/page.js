// app/articles/[slug]/page.js - Version avec API
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import ArticleDetail from '@/components/articles/ArticleDetail';

export async function generateMetadata({ params }) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles/${params.slug}`);

    if (!response.ok) {
      return {
        title: 'Article non trouvé - pixelpulse',
      };
    }

    const article = await response.json();

    return {
      title: `${article.title} - pixelpulse`,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author.name],
      },
    };
  } catch (error) {
    return {
      title: 'Article non trouvé - pixelpulse',
    };
  }
}

export default async function ArticlePage({ params }) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/articles/${params.slug}`);

    if (!response.ok) {
      notFound();
    }

    const article = await response.json();

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ArticleDetail article={article} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}