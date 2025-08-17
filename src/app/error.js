// src/app/error.js - Page d'erreur pour pixelpulse
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

        {/* Titre - Utilisation de h1-title */}
        <h1 className="h1-title text-gray-900 mb-4">
          Oops! Something went wrong
        </h1>

        {/* Message d'erreur - Utilisation de body-text */}
        <p className="body-text text-gray-600 mb-8">
          We are experiencing a technical issue. Please try again or return to the home page.
        </p>

        {/* Détails de l'erreur en mode développement */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="h6-title text-red-800 mb-2">Error Details :</h3>
            <pre className="small-text text-red-700 overflow-auto">
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
            Try again
          </button>

          <Link
            href="/"
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return to home
          </Link>
        </div>

        {/* Message de support - Utilisation de small-text */}
        <p className="small-text text-gray-500 mt-8">
          If the problem persists, please{' '}
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 underline">
            contact us
          </Link>
        </p>
      </div>
    </div>
  );
}