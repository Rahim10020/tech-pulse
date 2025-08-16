import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Logo TechPulse */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gray-900 flex items-center justify-center rounded animate-pulse">
            <span className="text-white font-bold">TP</span>
          </div>
          <span className="h2-title text-gray-900">TechPulse</span>
        </div>

        {/* Spinner */}
        <LoadingSpinner size="xl" className="mb-4" />

        {/* Message */}
        <p className="body-text text-gray-600">Chargement en cours...</p>
      </div>
    </div>
  );
}