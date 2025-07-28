// components/shared/SearchBar.js - Composant de recherche simple
'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ 
  placeholder = "Rechercher...", 
  onSearch,
  className = ""
}) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
      />
    </form>
  );
}