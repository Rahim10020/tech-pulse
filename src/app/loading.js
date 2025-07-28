// src/app/loading.js - Page de chargement globale
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo TechPulse */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gray-900 flex items-center justify-center rounded animate-pulse">
            <span className="text-white font-bold">TP</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">TechPulse</span>
        </div>

        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin border-t-gray-900 mx-auto mb-4"></div>
        </div>

        {/* Message */}
        <p className="text-gray-600">Chargement en cours...</p>
      </div>
    </div>
  );
}