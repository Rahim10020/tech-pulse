"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/routes";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthProvider";
import { isAdmin } from "@/lib/auth-roles";
import { LoadingSpinner } from "@/components/ui";

export default function MaintenanceWrapper({ children }) {
  const { settings, loading } = useSettings();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const bypassMaintenanceRoutes = [
    ROUTES.MAINTENANCE,
    ROUTES.SECRET_ADMIN_ACCESS,
  ];
  const isMaintenanceRoute = pathname === ROUTES.MAINTENANCE;
  const isBypassMaintenanceRoute = bypassMaintenanceRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isNonAdminUser = !user || !isAdmin(user);

  useEffect(() => {
    if (!loading && settings.maintenanceMode && isNonAdminUser) {
      // Rediriger vers la page de maintenance si le mode maintenance est activé
      // et que l'utilisateur n'est pas admin
      if (!isBypassMaintenanceRoute) {
        router.push(ROUTES.MAINTENANCE);
      }
    } else if (!loading && !settings.maintenanceMode && isMaintenanceRoute) {
      // Rediriger vers la page d'accueil si le mode maintenance est désactivé
      router.push(ROUTES.HOME);
    }
  }, [
    settings.maintenanceMode,
    loading,
    isNonAdminUser,
    isMaintenanceRoute,
    isBypassMaintenanceRoute,
    router,
  ]);

  // Afficher un loader pendant le chargement des paramètres
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  // Si mode maintenance et utilisateur non admin, afficher la page de maintenance
  if (settings.maintenanceMode && isNonAdminUser && !isBypassMaintenanceRoute) {
    return null; // La redirection sera gérée par useEffect
  }

  // Sinon, afficher le contenu normal
  return children;
}
