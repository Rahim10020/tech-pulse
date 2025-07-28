// src/components/articles/CategoryFilter.js - Filtre par catégorie
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/data';

export default function CategoryFilter({ activeCategory = 'all' }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams(searchParams);
    
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    
    router.push(`/articles?${params.toString()}`);
  };

  const allCategories = [
    { id: 0, name: 'Tous', slug: 'all', count: 25 },
    ...categories
  ];

  return (
    <div className="flex space-x-1 mb-12 border-b border-gray-200 overflow-x-auto">
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.slug)}
          className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors ${
            activeCategory === category.slug
              ? 'text-gray-900 border-b-2 border-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {category.name}
          {category.count && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {category.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}