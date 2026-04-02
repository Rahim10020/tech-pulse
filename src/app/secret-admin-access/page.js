/** @description Page d'accès administrateur secret */
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";

export default function SecretAdminAccess() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Si l'utilisateur est déjà connecté et admin, rediriger vers la page de profil admin
  // Si non connecté, rediriger vers la page de connexion
  useEffect(() => {
    if (!loading) {
      if (user === null) {
        router.push(ROUTES.LOGIN);
      } else if (user && user.role === "admin") {
        router.push(ROUTES.PROFILE_EDIT);
      }
    }
  }, [user, loading, router]);

  // Afficher le panel admin immédiatement
  useEffect(() => {
    setShowAdminPanel(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="container-sm">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header avec animation */}
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="h1-title text-gray-900 mb-2">Zone Administrateur</h1>
            <p className="body-text text-gray-600">
              Accès sécurisé pour la gestion du blog pixelpulse
            </p>
          </div>

          {/* Panel d'accès avec animation */}
          {showAdminPanel && (
            <div className="card p-6 space-y-6 animate-fade-in">
              {/* Status actuel */}
              <div className="text-center">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-teal-600 font-medium body-text">
                      ✓ Connecté en tant que {user.username}
                    </p>
                    <p className="small-text text-gray-500">
                      Rôle :{" "}
                      {user.role === "admin"
                        ? "👑 Administrateur"
                        : "👤 Lecteur"}
                    </p>
                    {user.role === "admin" && (
                      <p className="text-orange-500 small-text">
                        Redirection vers le dashboard...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 body-text">Non connecté</p>
                )}
              </div>

              {/* Actions disponibles */}
              <div className="space-y-3">
                {!user ? (
                  <>
                    <Link
                      href={ROUTES.LOGIN}
                      className="btn-primary w-full justify-center block text-center"
                    >
                      🔑 Se connecter
                    </Link>
                    <Link
                      href={ROUTES.SIGNUP}
                      className="btn-secondary w-full justify-center block text-center"
                    >
                      ✍️ Créer un compte
                    </Link>
                  </>
                ) : user.role === "admin" ? (
                  <div className="space-y-3">
                    <Link
                      href={ROUTES.PROFILE_EDIT}
                      className="btn-primary w-full justify-center bg-teal-600 hover:bg-teal-700 block text-center"
                    >
                      Administration
                    </Link>
                    <Link
                      href={ROUTES.CREATE}
                      className="btn-primary w-full justify-center bg-orange-500 hover:bg-orange-600 block text-center"
                    >
                      ✍️ Écrire un article
                    </Link>
                    <Link
                      href={ROUTES.ADMIN_MANAGE_USERS}
                      className="btn-secondary w-full justify-center block text-center"
                    >
                      Gérer les utilisateurs
                    </Link>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <p className="text-orange-600 font-medium body-text mb-2">
                        ⚠️ Accès limité
                      </p>
                      <p className="small-text text-orange-700 leading-relaxed">
                        Vous êtes connecté mais n&apos;avez pas les permissions
                        d&apos;administrateur. Pour accéder en tant
                        qu&apos;administrateur, déconnectez-vous et
                        reconnectez-vous avec un compte admin.
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => logout()}
                        className="btn-secondary"
                      >
                        Se déconnecter
                      </button>
                      <Link
                        href={ROUTES.CONTACT}
                        className="btn-primary inline-block"
                      >
                        Contacter l&apos;admin
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Lien de retour */}
              <div className="text-center pt-4 border-t border-gray-200">
                <Link
                  href={ROUTES.HOME}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200 small-text"
                >
                  ← Retour au blog
                </Link>
              </div>
            </div>
          )}

          {/* Warning de sécurité */}
          <div className="text-center">
            <p className="small-text text-gray-400">
              Cette page est confidentielle. L&apos;URL ne doit pas être
              partagée.
            </p>
          </div>
        </div>
      </div>

      {/* Styles CSS pour l'animation fade-in */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
