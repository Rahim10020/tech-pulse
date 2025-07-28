// src/app/error.js - Page d'erreur pour TechPulse
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Icône d'erreur */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oups ! Une erreur s'est produite
        </h1>

        {/* Message d'erreur */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Nous rencontrons un problème technique. Veuillez réessayer ou retourner à la page d'accueil.
        </p>

        {/* Détails de l'erreur en mode développement */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">Détails de l'erreur :</h3>
            <pre className="text-xs text-red-700 overflow-auto">
              {error.message || 'Erreur inconnue'}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer
          </button>
          
          <Link
            href="/"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Message de support */}
        <p className="text-sm text-gray-500 mt-8">
          Si le problème persiste, veuillez{' '}
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 underline">
            nous contacter
          </Link>
        </p>
      </div>
    </div>
  );
}