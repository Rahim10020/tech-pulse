// src/components/layout/Header.js - Header avec accès admin seulement
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Menu, User, Settings, LogOut, Plus, PenTool } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { isAdmin } from "@/lib/auth-roles";

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

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
              className={`text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors relative pb-1 ${
                isActiveLink("/")
                  ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                  : ""
              }`}
            >
              Accueil
            </Link>
            <Link
              href="/articles"
              className={`text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors relative pb-1 ${
                isActiveLink("/articles")
                  ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                  : ""
              }`}
            >
              Articles
            </Link>
            <Link
              href="/categories"
              className={`text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors relative pb-1 ${
                isActiveLink("/categories")
                  ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                  : ""
              }`}
            >
              Catégories
            </Link>
            <Link
              href="/about"
              className={`text-gray-700 font-poppins hover:text-gray-900 text-sm transition-colors relative pb-1 ${
                isActiveLink("/about")
                  ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                  : ""
              }`}
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

            {user ? (
              <>
                {/* Bouton Publier - Visible seulement pour les admins */}
                {isAdmin(user) && (
                  <Link
                    href="/create"
                    className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-poppins text-sm font-medium"
                  >
                    <PenTool className="w-4 h-4" />
                    <span className="hidden sm:inline font-poppins">Publier</span>
                  </Link>
                )}

                <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                  >
                    <span className="text-white font-medium text-sm font-poppins">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 font-poppins">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 font-sans">
                          {user.email}
                        </p>
                        {isAdmin(user) && (
                          <p className="text-xs text-teal-600 font-medium font-poppins">
                            Administrateur
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/author/${user.username}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Voir le profil
                      </Link>
                      {isAdmin(user) && (
                        <Link
                          href="/create"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <PenTool className="w-4 h-4 mr-3" />
                          Publier un article
                        </Link>
                      )}
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Plus de boutons de connexion/inscription visibles pour les utilisateurs non connectés
              // L'accès admin se fait via /secret-admin-access
              <div className="text-sm text-gray-600 font-poppins">
                <span>Bienvenue sur TechPulse</span>
              </div>
            )}

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