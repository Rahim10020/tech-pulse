// src/app/categories/page.js - Page catégories avec layout en grille
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { Code, Database, Cloud, Brain, Smartphone, Globe } from 'lucide-react';
import { categories } from '@/lib/data';

export const metadata = {
  title: 'Catégories - TechPulse',
  description: 'Explorez nos catégories d\'articles techniques',
};

const iconMap = {
  'Code': Code,
  'Database': Database,
  'Cloud': Cloud,
  'Brain': Brain,
  'Smartphone': Smartphone,
  'Globe': Globe,
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container-sm py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Catégories
          </h1>
          <p className="text-md text-start text-gray-600">
            Explorez nos articles par domaine d'expertise technologique.
          </p>
        </div>
        
        {/* Layout en grille comme sur la deuxième image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Code;
            
            return (
              <Link 
                key={category.id} 
                href={`/articles?category=${category.slug}`}
                className="block group"
              >
                <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
                  {/* Icône en haut à gauche */}
                  <div className="mb-4">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  
                  {/* Titre */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {category.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}