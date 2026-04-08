/**
 * Maintenance mode page component.
 * Displays when the site is in maintenance mode.
 * Shows maintenance message and contact information to regular users.
 * Allows admin users to bypass maintenance mode.
 */
"use client";

import { useSettings } from "@/hooks/useSettings";
import { Clock3, Mail, TriangleAlert } from "lucide-react";

export default function MaintenancePage() {
  const { settings } = useSettings();
  const lastUpdate = new Date().toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-10 lg:px-14">
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
          Site temporairement indisponible
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
          {settings.siteDescription ||
            "Nous effectuons actuellement une mise a jour afin d'ameliorer votre experience. Merci pour votre patience."}
        </p>

        <div className="my-10 h-px w-full bg-black/15" />

        <dl className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-1 uppercase text-gray-500">
              Site
            </dt>
            <dd className="text-xl font-medium">
              {settings.siteName || "pixelpulse"}
            </dd>
          </div>

          <div>
            <dt className="mb-1 uppercase text-gray-500">Disponibilite</dt>
            <dd className="text-xl font-medium">Retour prochainement</dd>
          </div>
        </dl>

        {settings.contactEmail && (
          <div className="mt-10 inline-flex w-fit items-center gap-2 border-b border-black pb-1 text-sm text-black">
            <Mail className="h-4 w-4" />
            <a
              href={`mailto:${settings.contactEmail}`}
              className="underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
              {settings.contactEmail}
            </a>
          </div>
        )}

        <div className="mt-10 flex items-center gap-2 border-t border-black/15 pt-6 text-xs uppercase tracking-[0.16em] text-gray-500">
          <Clock3 className="h-4 w-4" />
          <span>Derniere mise a jour: {lastUpdate}</span>
        </div>
      </div>
    </div>
  );
}
