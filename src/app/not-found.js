// src/app/not-found.js - Page 404 pour TechPulse
import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo TechPulse */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-gray-900 flex items-center justify-center rounded">
            <span className="text-white font-bold">TP</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">TechPulse</span>
        </div>

        {/* 404 */}
        <div className="text-6xl font-bold text-gray-300 mb-4">404</div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="input-field pl-12"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Page précédente
          </button>
        </div>

        {/* Liens suggérés */}
        <div className="mt-12">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Pages populaires :</h3>
          <div className="space-y-2">
            <Link
              href="/articles"
              className="block text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Tous les articles
            </Link>
            <Link
              href="/categories"
              className="block text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Catégories
            </Link>
            <Link
              href="/about"
              className="block text-sm text-gray-600 hover:text-gray-900 underline"
            >
              À propos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
