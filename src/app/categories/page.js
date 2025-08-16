// src/app/categories/page.js
"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { CategoryCardSkeleton } from '@/components/ui/Skeleton';
import { Code, Database, Cloud, Brain, Smartphone, Globe } from 'lucide-react';

const iconMap = {
  'Code': Code,
  'Database': Database,
  'Cloud': Cloud,
  'Brain': Brain,
  'Smartphone': Smartphone,
  'Globe': Globe,
};

export default function CategoriesPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-sm py-6">
          <div className="mb-8">
            <div className="animate-pulse bg-gray-200 rounded h-8 w-48 mb-4"></div>
            <div className="animate-pulse bg-gray-200 rounded h-4 w-96"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-6">
        <div className="mb-8">
          <h1 className="h2-title text-gray-900 mb-4">
            Catégories
          </h1>
          <p className="body-text text-gray-600">
            Explorez nos articles par domaine d&apos;expertise technologique.
          </p>
        </div>

        {/* Layout en grille */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Code;

            return (
              <Link
                key={category.id}
                href={`/articles?category=${category.slug}`}
                className="block group h-full"
              >
                <div className="card p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300 h-full flex flex-col">
                  {/* Icône en haut à gauche */}
                  <div className="mb-4">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>

                  {/* Titre */}
                  <h3 className="h4-title text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="small-text text-gray-600 leading-relaxed line-clamp-3 flex-grow">
                    {category.description}
                  </p>

                  {/* Compteur d'articles */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="small-text text-gray-500">
                      {category.count} article{category.count > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}