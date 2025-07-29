// src/app/profile/[id]/page.js - Page de profil utilisateur
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import UserProfile from '@/components/articles/UserProfile';
import { getAuthorById, getArticlesByAuthor } from '@/lib/data';

export async function generateMetadata({ params }) {
  const user = getAuthorById(parseInt(params.id));
  
  if (!user) {
    return {
      title: 'Profil non trouvé - TechPulse',
    };
  }

  return {
    title: `${user.name} - TechPulse`,
    description: user.bio,
  };
}

export default function ProfilePage({ params }) {
  const user = getAuthorById(parseInt(params.id));
  const userArticles = getArticlesByAuthor(parseInt(params.id));

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