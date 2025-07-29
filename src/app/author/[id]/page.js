// src/app/author/[id]/page.js - Page auteur corrigée
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import AuthorProfile from '@/components/profile/AuthorProfile';
import { getAuthorById, getArticlesByAuthor } from '@/lib/data';

export async function generateMetadata({ params }) {
  const author = getAuthorById(parseInt(params.id));
  
  if (!author) {
    return {
      title: 'Auteur non trouvé - TechPulse',
    };
  }

  return {
    title: `${author.name} - TechPulse`,
    description: author.bio,
  };
}

export default function AuthorPage({ params }) {
  const author = getAuthorById(parseInt(params.id));
  const authorArticles = getArticlesByAuthor(parseInt(params.id));

  if (!author) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthorProfile author={author} articles={authorArticles} />
    </div>
  );
}