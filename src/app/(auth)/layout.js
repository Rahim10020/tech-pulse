// app/(auth)/layout.js - Layout pour les pages d'authentification
import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié pour les pages d'auth */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechPulse</span>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link href="/articles" className="text-gray-700 hover:text-gray-900">Articles</Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
