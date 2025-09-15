/** @description Page d'édition du profil utilisateur */
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
  const { user, updateProfile, changePassword } = useAuth();
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

  const handlePasswordChange = async (passwordData) => {
    setIsLoading(true);

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);

      if (result.success) {
        showToast("Mot de passe changé avec succès !", "success");
        // Clear password fields after successful change
        // This would require passing a reset function from ProfileForm
      } else {
        showToast(result.error || "Erreur lors du changement de mot de passe", "error");
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

      <div className="container-sm py-8">
        {/* Header avec bouton retour */}
        <div className="flex items-center mb-8">

          <div>
            <h1 className="h1-title text-gray-900">
              Éditer mon profil
            </h1>
            <p className="body-text text-gray-600 mt-2">
              Mettez à jour vos informations personnelles
            </p>
          </div>
        </div>

        {/* Formulaire de profil */}
        <div className="">
          <div className="">
            <ProfileForm
              initialData={user}
              onSubmit={handleUpdateProfile}
              onPasswordChange={handlePasswordChange}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="h4-title text-blue-800 mb-3">
            Informations importantes
          </h3>
          <div className="space-y-2 small-text text-blue-700">
            <p>
              • Votre nom d&apos;utilisateur et email ne peuvent pas être modifiés
              depuis cette page
            </p>
            <p>
              • Les informations de votre profil sont publiques et visibles par
              tous les visiteurs
            </p>
            <p>
              • Les liens vers vos réseaux sociaux apparaîtront sur votre page
              de profil public
            </p>
            <p>
              • Vous pouvez changer votre mot de passe dans la section ci-dessous
            </p>
          </div>
        </div>

        {/* Lien vers le profil public */}
        <div className="mt-6 text-center">
          <a
            href={`/profile/${user.id}`}
            className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors h6-title"
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