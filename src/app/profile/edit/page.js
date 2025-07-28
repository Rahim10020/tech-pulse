// app/profile/edit/page.js - Page d'édition de profil
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ProfileForm from '@/components/forms/ProfileForm';
import { useAuth } from '@/context/AuthProvider';
import { useToast } from '@/context/ToastProvider';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleUpdateProfile = async (formData) => {
    setIsLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        showToast('Profil mis à jour avec succès !', 'success');
        router.push(`/profile/${user.id}`);
      } else {
        showToast(result.error || 'Erreur lors de la mise à jour', 'error');
      }
    } catch (error) {
      showToast('Une erreur est survenue', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto pt-12 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">Edit profile</h1>
        <ProfileForm 
          initialData={user} 
          onSubmit={handleUpdateProfile} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}
