// src/components/articles/CategoryFilter.js - Filtre par catégorie (version améliorée)
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/data';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryFilter({ activeCategory = 'all' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

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

  // Vérifier si les flèches sont nécessaires
  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12 border-b border-gray-200">
      <div className="relative">
        {/* Conteneur des catégories avec padding pour les flèches */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollButtons}
          className={`flex space-x-1 overflow-x-auto scrollbar-hide transition-all duration-200 ${
            showLeftArrow ? 'pl-10' : ''
          } ${showRightArrow ? 'pr-10' : ''}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`pb-4 px-4 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
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

        {/* Flèche gauche */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 h-full w-6 flex items-center justify-center bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 hover:text-gray-900" />
          </button>
        )}

        {/* Flèche droite */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 z-10 h-full w-6 flex items-center justify-center bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-700 hover:text-gray-900" />
          </button>
        )}
      </div>
    </div>
  );
}