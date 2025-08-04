// src/app/profile/edit/page.js - Page d'édition de profil simplifiée
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/context/ToastProvider";
import { ArrowLeft } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleUpdateProfile = async (formData) => {
    setIsLoading(true);

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        showToast("Profil mis à jour avec succès !", "success");
        router.push(`/profile/${user.id}`);
      } else {
        showToast(result.error || "Erreur lors de la mise à jour", "error");
      }
    } catch (error) {
      showToast("Une erreur est survenue", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-poppins text-sm">Retour</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">
              Éditer mon profil
            </h1>
            <p className="text-gray-600 font-sans mt-2">
              Mettez à jour vos informations personnelles
            </p>
          </div>
        </div>

        {/* Formulaire de profil */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            <ProfileForm
              initialData={user}
              onSubmit={handleUpdateProfile}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 font-poppins">
            Informations importantes
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p className="font-sans">
              • Votre nom d'utilisateur et email ne peuvent pas être modifiés
              depuis cette page
            </p>
            <p className="font-sans">
              • Les informations de votre profil sont publiques et visibles par
              tous les visiteurs
            </p>
            <p className="font-sans">
              • Les liens vers vos réseaux sociaux apparaîtront sur votre page
              de profil public
            </p>
            <p className="font-sans">
              • Pour changer votre mot de passe, contactez l'administrateur
            </p>
          </div>
        </div>

        {/* Lien vers le profil public */}
        <div className="mt-6 text-center">
          <a
            href={`/profile/${user.id}`}
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors font-poppins text-sm"
          >
            <span>Voir mon profil public</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
