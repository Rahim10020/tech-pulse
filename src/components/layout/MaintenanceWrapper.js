"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthProvider";
import { isAdmin } from "@/lib/auth-roles";

export default function MaintenanceWrapper({ children }) {
    const { settings, loading } = useSettings();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && settings.maintenanceMode && (!user || !isAdmin(user))) {
            // Rediriger vers la page de maintenance si le mode maintenance est activé
            // et que l'utilisateur n'est pas admin
            if (window.location.pathname !== "/maintenance") {
                router.push("/maintenance");
            }
        } else if (!loading && !settings.maintenanceMode && window.location.pathname === "/maintenance") {
            // Rediriger vers la page d'accueil si le mode maintenance est désactivé
            router.push("/");
        }
    }, [settings.maintenanceMode, loading, user, router]);

    // Afficher un loader pendant le chargement des paramètres
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    // Si mode maintenance et utilisateur non admin, afficher la page de maintenance
    if (settings.maintenanceMode && (!user || !isAdmin(user))) {
        return null; // La redirection sera gérée par useEffect
    }

    // Sinon, afficher le contenu normal
    return children;
}