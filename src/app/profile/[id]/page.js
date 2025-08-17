// src/app/profile/[id]/page.js - Page de profil utilisateur corrigée
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import UserProfile from '@/components/articles/UserProfile';
import { getAuthorById } from '@/lib/authors';
import { getArticlesByAuthor } from '@/lib/articles';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const user = await getAuthorById(parseInt(resolvedParams.id));

  if (!user) {
    return {
      title: 'Profil non trouvé - pixelpulse',
    };
  }

  return {
    title: `${user.name} - pixelpulse`,
    description: user.bio,
  };
}

export default async function ProfilePage({ params }) {
  const resolvedParams = await params;
  const user = await getAuthorById(parseInt(resolvedParams.id));
  const userArticles = await getArticlesByAuthor(parseInt(resolvedParams.id));

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <UserProfile user={user} articles={userArticles} />
    </div>
  );
}