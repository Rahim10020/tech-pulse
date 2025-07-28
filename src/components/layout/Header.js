// src/components/layout/Header.js - Header simple
import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center rounded">
              <span className="text-white font-poppins font-bold text-sm">
                TP
              </span>
            </div>
            <span className="text-xl font-poppins font-bold text-gray-900 uppercase">
              Tech<span className="text-teal-600">Pulse</span>{" "}
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/articles"
              className="text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors"
            >
              Articles
            </Link>
            <Link
              href="/categories"
              className="text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors"
            >
              Catégories
            </Link>
            <Link
              href="/about"
              className="text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors"
            >
              À propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="bg-gray-100 font-poppins rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
              />
            </div>

            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />

            <Link href="/login" className="btn-primary font-poppins">
              Connexion
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
