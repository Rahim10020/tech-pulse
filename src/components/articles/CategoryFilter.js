'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function CategoryFilter({ activeCategory = 'all' }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories?type=all');
        const categoriesData = await response.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryChange = (categorySlug) => {
    const params = new URLSearchParams(searchParams);
    
    if (categorySlug === 'all') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    
    router.push(`/articles?${params.toString()}`);
  };

  const totalArticles = categories.reduce((sum, cat) => sum + cat.count, 0);
  const allCategories = [
    { id: 0, name: 'Tous', slug: 'all', count: totalArticles },
    ...categories
  ];

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
  }, [categories]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="mb-12 border-b border-gray-200">
        <div className="flex justify-center pb-4">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 border-b border-gray-200">
      <div className="relative">
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
              className={`pb-4 px-4 h6-title whitespace-nowrap transition-colors flex-shrink-0 ${
                activeCategory === category.slug
                  ? 'text-gray-900 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {category.name}
              {category.count !== undefined && (
                <span className="ml-2 small-text bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 z-10 h-full w-6 flex items-center justify-center bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700 hover:text-gray-900" />
          </button>
        )}

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