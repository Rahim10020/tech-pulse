/** @description Page d'inscription utilisateur */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import { useSettings } from '@/hooks/useSettings';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { settings, loading } = useSettings();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Rediriger si les inscriptions sont désactivées
    if (!loading && !settings.allowRegistration) {
      showToast('Les inscriptions sont actuellement désactivées', 'error');
      router.push('/');
    }
  }, [settings.allowRegistration, loading, router, showToast]);

  const handleSignup = async (formData) => {
    setIsLoading(true);

    try {
      const result = await signup(formData.username, formData.email, formData.password);

      if (result.success) {
        showToast('Compte créé avec succès !', 'success');
        router.push('/');
      } else {
        showToast(result.error || 'Erreur lors de la création du compte', 'error');
      }
    } catch (error) {
      showToast('Une erreur est survenue', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un message si les inscriptions sont désactivées
  if (!loading && !settings.allowRegistration) {
    return (
      <div className="max-w-md mx-auto pt-6 px-6">
        <div className="text-center">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-4">
            Inscriptions désactivées
          </h1>
          <p className="text-gray-600 mb-6">
            Les inscriptions sont actuellement désactivées sur ce site.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto pt-6 px-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pt-6 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">Créez votre compte</h1>
      </div>

      <SignupForm onSubmit={handleSignup} isLoading={isLoading} />
    </div>
  );
}
