// pages/reset-password/[token].js - Page de réinitialisation du mot de passe
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setIsLoading(false);
      return;
    }

    try {
      // Logique de réinitialisation du mot de passe
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Une erreur est survenue');
      }
    } catch (error) {
      setError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png"
              alt="Logo pixelpulse"
              className="h-10" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-md mx-auto pt-24 px-6">
        {!isSuccess ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Définir un nouveau mot de passe</h1>
              <p className="text-gray-600">Veuillez entrer votre nouveau mot de passe ci-dessous.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Input
                label="Nouveau mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Entrez le nouveau mot de passe"
                showPasswordToggle={true}
                required
              />

              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirmez le nouveau mot de passe"
                showPasswordToggle={true}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Mot de passe mis à jour !</h1>
            <p className="text-gray-600 mb-8">
              Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
            </p>
            <Link
              href="/login"
              className="inline-block bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}