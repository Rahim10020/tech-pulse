// src/app/author/[id]/page.js - Page auteur corrigée
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import AuthorProfile from '@/components/articles/AuthorProfile';

// Fonction pour récupérer l'auteur via API (côté serveur)
async function getAuthorData(identifier) {
  try {
    // Essayer d'abord par username, puis par ID si c'est un nombre
    const isNumeric = !isNaN(identifier);
    const endpoint = isNumeric
      ? `/api/authors?type=single&id=${identifier}`
      : `/api/authors?type=single&username=${identifier}`;

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${endpoint}`);

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const author = await getAuthorData(params.id);

  if (!author) {
    return {
      title: 'Author not found - pixelpulse',
    };
  }

  return {
    title: `${author.name} - pixelpulse`,
    description: author.bio,
  };
}

export default async function AuthorPage({ params }) {
  const author = await getAuthorData(params.id);

  if (!author) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <AuthorProfile author={author} />
    </div>
  );
}