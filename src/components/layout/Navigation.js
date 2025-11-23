"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Bell, MessageSquare, Search, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsProfileMenuOpen(false);
  };

  const isActiveLink = (href) => router.pathname === href;

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-900 flex items-center justify-center rounded">
            <span className="text-white font-bold text-sm">TP</span>
          </div>
          <span className="h3-title text-gray-900">pixelpulse</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`h6-title ${isActiveLink('/') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Home
          </Link>
          <Link
            href="/articles"
            className={`h6-title ${isActiveLink('/articles') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
          >
            Articles
          </Link>
          {user && (
            <>
              <Link
                href="/create"
                className={`h6-title ${isActiveLink('/create') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Create
              </Link>
              <Link
                href="/notifications"
                className={`h6-title ${isActiveLink('/notifications') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Notifications
              </Link>
              <Link
                href="/messages"
                className={`h6-title ${isActiveLink('/messages') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
              >
                Messages
              </Link>
            </>
          )}
          <Link
            href="/about"
            className={`h6-title ${isActiveLink('/about') ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'}`}
          >
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 h6-title focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
            />
          </div>

          {user ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageSquare className="w-5 h-5" />
              </Button>

              {/* Profile Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400"
                >
                  {user.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={40} height={40} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </Button>

                {/* Profile Dropdown */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="h5-title text-gray-900">{user.name || 'User'}</p>
                      <p className="small-text text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href={`/profile/${user.username || user.id}`}
                      className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      View Profile
                    </Link>
                    <Link
                      href="/profile/edit"
                      className="flex items-center px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Edit Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 h6-title text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button
                href="/login"
                variant="ghost"
                className="h6-title"
              >
                Sign In
              </Button>
              <Button
                href="/signup"
                variant="primary"
                className="h6-title"
              >
                Sign Up
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
          <nav className="space-y-4">
            <Link href="/" className="block h6-title text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link href="/articles" className="block h6-title text-gray-700 hover:text-gray-900">
              Articles
            </Link>
            {user && (
              <>
                <Link href="/create" className="block h6-title text-gray-700 hover:text-gray-900">
                  Create
                </Link>
                <Link href="/notifications" className="block h6-title text-gray-700 hover:text-gray-900">
                  Notifications
                </Link>
                <Link href="/messages" className="block h6-title text-gray-700 hover:text-gray-900">
                  Messages
                </Link>
              </>
            )}
            <Link href="/about" className="block h6-title text-gray-700 hover:text-gray-900">
              About
            </Link>

            {/* Mobile Search */}
            <div className="relative pt-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 h6-title focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}