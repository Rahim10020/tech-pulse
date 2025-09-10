"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  PenTool,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { isAdmin, isPublisher, isReader } from "@/lib/auth-roles";
import { useSettings } from "@/hooks/useSettings";
import { Button } from "@/components/ui/Button";

export default function Header() {
  const { user, logout, unreadCount } = useAuth();
  const { settings } = useSettings();
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
          <Link href="/">
            <img src="/logo.png"
              alt={`Logo ${settings.siteName || 'pixelpulse'}`}
              className="h-10" />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`h6-title text-gray-700 hover:text-gray-900 transition-colors relative pb-1 ${isActiveLink("/")
                ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                : ""
                }`}
            >
              Accueil
            </Link>
            <Link
              href="/articles"
              className={`h6-title text-gray-700 hover:text-gray-900 transition-colors relative pb-1 ${isActiveLink("/articles")
                ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                : ""
                }`}
            >
              Articles
            </Link>
            <Link
              href="/categories"
              className={`h6-title text-gray-700 hover:text-gray-900 transition-colors relative pb-1 ${isActiveLink("/categories")
                ? 'text-gray-900 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-teal-600'
                : ""
                }`}
            >
              Catégories
            </Link>
            <Link
              href="/about"
              className={`h6-title text-gray-700 hover:text-gray-900 transition-colors relative pb-1 ${isActiveLink("/about")
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
                className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 h6-title focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(e.target.value.trim())}`;
                  }
                }}
              />
            </div>

            {user ? (
              <>
                {/* Bouton Publier - Visible pour les admins et publishers */}
                {(isAdmin(user) || isPublisher(user)) && (
                  <Link href="/create" className="hidden sm:flex">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <PenTool className="w-4 h-4" />
                      Publier
                    </Button>
                  </Link>
                )}

                {/* Messages Badge - Seulement pour les admins */}
                {isAdmin(user) && (
                  <Link
                    href="/admin/dashboard"
                    className="relative cursor-pointer hover:text-gray-900 transition-colors"
                    title="Messages de contact"
                  >
                    <MessageSquare className="w-5 h-5 text-gray-600 hover:text-gray-900 transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 focus:outline-none focus:ring-2 focus:ring-gray-300 flex items-center justify-center"
                  >
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {/* Informations utilisateur */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="h5-title text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="small-text text-gray-500">
                          {user.role === "admin"
                            ? "👑 Admin"
                            : user.role === "publisher"
                              ? "✍️ Auteur"
                              : "👤 Lecteur"}
                        </p>
                      </div>

                      <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mon Profil
                      </Link>

                      {/* Lien Écrire un article */}
                      {(isAdmin(user) || isPublisher(user)) && (
                        <Link
                          href="/create"
                          className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <PenTool className="w-4 h-4 mr-3" />
                          Écrire un article
                        </Link>
                      )}

                      {/* Mes brouillons */}
                      {(isAdmin(user) || isPublisher(user)) && (
                        <Link
                          href="/drafts"
                          className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Mes brouillons
                        </Link>
                      )}

                      {/* Lien Administration */}
                      {user && isAdmin(user) && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Administration
                            {unreadCount > 0 && (
                              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {unreadCount}
                              </span>
                            )}
                          </Link>
                        </>
                      )}

                      {/* Lien Paramètres */}
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/contact">
                  <Button
                    variant="primary"
                    size="sm"
                  >
                    Contact
                  </Button>
                </Link>
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