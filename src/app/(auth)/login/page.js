// app/(auth)/login/page.js - Page de connexion
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        showToast('Connexion réussie !', 'success');
        router.push('/dashboard');
      } else {
        showToast(result.error || 'Erreur de connexion', 'error');
      }
    } catch (error) {
      showToast('Une erreur est survenue', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-poppins font-bold text-gray-900 mb-2">Welcome back</h1>
      </div>

      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

      <div className="text-center mt-6">
        <span className="text-sm font-poppins text-gray-500">
          Don't have an account?{' '}
          <Link href="/signup" className="text-gray-700 hover:text-gray-900 font-poppins underline">
            Sign up
          </Link>
        </span>
      </div>
    </div>
  );
}