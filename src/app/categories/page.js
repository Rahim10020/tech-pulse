// src/app/categories/page.js - Page catégories (bonus)
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
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Catégories
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explorez nos articles par domaine d'expertise technologique.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || Code;
            
            return (
              <Link 
                key={category.id} 
                href={`/articles?category=${category.slug}`}
                className="block group"
              >
                <div className="card p-8 text-center hover:shadow-lg transition-all group-hover:-translate-y-1">
                  <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-center">
                    <span className={`badge ${category.textColor} ${category.color}`}>
                      {category.count} articles
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