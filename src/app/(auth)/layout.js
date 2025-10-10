// app/(auth)/layout.js - Layout pour les pages d'authentification
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié pour les pages d'auth */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img src="/logo.png"
              alt="Logo pixelpulse"
              className="h-10" />
          </Link>

          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 font-poppins hover:text-gray-900 text-sm">
              Acceuil
            </Link>
            <Link
              href="/articles"
              className="text-gray-700 hover:text-gray-900 font-poppins text-sm"
            >
              Articles
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 text-sm font-poppins">
              A propos
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
