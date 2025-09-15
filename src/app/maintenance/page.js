/**
 * Maintenance mode page component.
 * Displays when the site is in maintenance mode.
 * Shows maintenance message and contact information to regular users.
 * Allows admin users to bypass maintenance mode.
 */
"use client";

import { useSettings } from "@/hooks/useSettings";
import { useAuth } from "@/context/AuthProvider";
import { isAdmin } from "@/lib/auth-roles";

export default function MaintenancePage() {
    const { settings } = useSettings();
    const { user } = useAuth();

    // Si l'utilisateur est admin, permettre l'accès au site
    if (user && isAdmin(user)) {
        return null; // Permettre l'accès normal
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md mx-auto text-center p-8">
                <div className="mb-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-orange-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Site en maintenance
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {settings.siteDescription || "Nous travaillons actuellement sur des améliorations. Veuillez revenir plus tard."}
                    </p>
                </div>

                <div className="text-sm text-gray-500">
                    <p>Site: {settings.siteName || "pixelpulse"}</p>
                    {settings.contactEmail && (
                        <p className="mt-2">
                            Contact: <a href={`mailto:${settings.contactEmail}`} className="text-teal-600 hover:underline">
                                {settings.contactEmail}
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}