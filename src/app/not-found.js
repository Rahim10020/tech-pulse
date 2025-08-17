import Link from 'next/link';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo pixelpulse */}
        <div className="mb-8">
          <img src="/logo.png"
            alt="Logo pixelpulse"
            className="h-10" />
        </div>

        {/* 404 */}
        <div className="h1-title text-gray-300 mb-4">404</div>

        {/* Titre */}
        <h1 className="h2-title text-gray-900 mb-4">
          Page not found
        </h1>

        {/* Message */}
        <p className="body-text text-gray-600 mb-8">
          Sorry, the page you are looking for does not exist or has been moved.
        </p>

        {/* Barre de recherche */}
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Rechercher un article..."
            icon={<Search className="w-5 h-5 text-gray-400" />}
            className="pl-12"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            href="/"
            variant="primary"
            icon={<Home className="w-4 h-4" />}
          >
            Return to home
          </Button>

          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back
          </Button>
        </div>

        {/* Liens suggérés */}
        <div className="mt-12">
          <h3 className="h5-title text-gray-900 mb-4">Popular pages :</h3>
          <div className="space-y-2">
            <Link
              href="/articles"
              className="block small-text text-gray-600 hover:text-gray-900 underline"
            >
              All articles
            </Link>
            <Link
              href="/categories"
              className="block small-text text-gray-600 hover:text-gray-900 underline"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block small-text text-gray-600 hover:text-gray-900 underline"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}