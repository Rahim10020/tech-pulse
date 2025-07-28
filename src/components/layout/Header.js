// components/Header.js
import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TP</span>
            </div>
            <span className="text-xl font-bold text-gray-900">TechPulse</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-gray-900">Accueil</a>
            <a href="/categories" className="text-gray-700 hover:text-gray-900">Catégories</a>
            <a href="/articles" className="text-gray-700 hover:text-gray-900">Articles</a>
            <a href="/auteurs" className="text-gray-700 hover:text-gray-900">Auteurs</a>
            <a href="/contact" className="text-gray-700 hover:text-gray-900">Contact</a>
            <a href="/ressources" className="text-gray-700 hover:text-gray-900">Ressources</a>
            <a href="/communaute" className="text-gray-700 hover:text-gray-900">Communauté</a>
          </nav>
        </div>

        {/* Search and User */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-64"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-600" />
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
            Publier
          </button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400"></div>
        </div>
      </div>
    </header>
  );
}