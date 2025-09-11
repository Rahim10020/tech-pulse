// pages/forgot-password.js - Page mot de passe oublié
"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";
import { validateEmail } from "@/lib/validations";

export default function ForgotPasswordPage({ isLoading }) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!email.trim()) {
      setError("L'email est requis");
      return;
    }

    if (!validateEmail(email)) {
      setError("Format d'email invalide");
      return;
    }

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setResetCode(data.resetCode || '');
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur réseau. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-md mx-auto pt-24 px-6">
        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-6">
                Réinitialiser votre mot de passe
              </h1>
              <p className="text-gray-600 font-poppins text-sm">
                Entrez votre adresse email et nous vous enverrons un code pour réinitialiser votre mot de passe.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              <Input
                label="Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                error={error}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-poppins"
              >
                {isLoading ? "Envoi en cours..." : "Envoyer le code"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Code de réinitialisation généré
            </h1>
            <p className="text-gray-600 mb-4">
              Un email a été envoyé à <strong>{email}</strong>
            </p>

            {/* Afficher le code en développement */}
            {process.env.NODE_ENV === 'development' && resetCode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm mb-2">
                  🔧 Mode développement - Code de test :
                </p>
                <div className="bg-yellow-100 text-yellow-900 font-mono text-2xl font-bold py-2 px-4 rounded text-center">
                  {resetCode}
                </div>
                <p className="text-yellow-700 text-xs mt-2">
                  Ce code est affiché uniquement en développement pour faciliter les tests
                </p>
              </div>
            )}

            <div className="space-y-4">
              <Link
                href="/reset-password"
                className="inline-block bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors mr-4"
              >
                Entrer le code
              </Link>
              <Link
                href="/login"
                className="inline-block bg-gray-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
