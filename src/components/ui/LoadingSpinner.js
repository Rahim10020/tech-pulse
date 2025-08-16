// src/components/ui/LoadingSpinner.js
export default function LoadingSpinner(
) {
  return (
    <div className="flex flex-col items-center">

      <img src="/logo.png"
        alt="Logo pixelpulse"
        className="h-10" />

      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>

      <p className="body-text text-gray-600">Chargement en cours...</p>
    </div>
  );
} 