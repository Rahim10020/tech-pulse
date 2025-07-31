// app/(auth)/signup/page.js - Page d'inscription
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import SignupForm from '@/components/forms/SignupForm';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="max-w-md mx-auto pt-6 px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">Create your account</h1>
      </div>

      <SignupForm onSubmit={handleSignup} isLoading={isLoading} />

      <div className="text-center mt-4">
        <span className="text-sm font-poppins text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-700 hover:text-gray-900 font-poppins underline">
            Sign in
          </Link>
        </span>
      </div>
    </div>
  );
}
