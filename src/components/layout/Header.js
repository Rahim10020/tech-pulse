// src/components/layout/Header.js - Header avec badge messages non lus corrigé
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  Plus,
  PenTool,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { isAdmin, isPublisher, isReader } from "@/lib/auth-roles";
import { useSettings } from "@/hooks/useSettings";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

export default function Header() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const { unreadCount } = useUnreadMessages();
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
                {settings.siteName
                  ? settings.siteName.substring(0, 2).toUpperCase()
                  : "TP"}
              </span>
            </div>
            <span className="text-xl font-poppins font-bold text-gray-900 uppercase">
              {settings.siteName || "TechPulse"}
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
                {/* Bouton Publier - Visible pour les admins et publishers */}
                {(isAdmin(user) || isPublisher(user)) && (
                  <Link
                    href="/create"
                    className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors font-poppins text-sm font-medium"
                  >
                    <PenTool className="w-4 h-4" />
                    <span className="hidden sm:inline font-poppins">
                      Publier
                    </span>
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

                {/* Bell notification - Placeholder pour futures notifications */}
                <div className="relative">
                  <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900 transition-colors" />
                  {/* Badge pour les notifications générales (à implémenter plus tard) */}
                </div>

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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      {/* Informations utilisateur */}
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 font-poppins truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 font-sans">
                          {user.role === "admin"
                            ? "👑 Admin"
                            : user.role === "publisher"
                            ? "✍️ Auteur"
                            : "👤 Lecteur"}
                        </p>
                      </div>

                      <Link
                        href={`/profile/${user.id}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mon Profil
                      </Link>

                      {/* Lien Écrire un article pour les admins et publishers */}
                      {(isAdmin(user) || isPublisher(user)) && (
                        <Link
                          href="/create"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <PenTool className="w-4 h-4 mr-3" />
                          Écrire un article
                        </Link>
                      )}

                      {/* Mes brouillons pour les admins et publishers */}
                      {(isAdmin(user) || isPublisher(user)) && (
                        <Link
                          href="/drafts"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
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

                      {/* Lien Administration - SEULEMENT pour les vrais admins */}
                      {user && isAdmin(user) && (
                        <>
                          <div className="border-t border-gray-100 my-1"></div>
                          <Link
                            href="/admin/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
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

                      {/* Lien Paramètres - pour tous les utilisateurs connectés */}
                      <Link
                        href="/profile/edit"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-poppins"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>
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
              <div className="flex items-center space-x-4">
                <Link
                  href="/contact"
                  className="text-sm bg-teal-600 text-white px-3 py-1.5 hover:bg-teal-700 transition-colors font-poppins"
                >
                  Contact
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
