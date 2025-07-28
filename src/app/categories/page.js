// pages/categories.js
import Header from '../components/Header';
import CategoryCard from '../components/CategoryCard';
import { Code, Database, Cloud, Brain, Smartphone, Globe } from 'lucide-react';

export default function Categories() {
  const categories = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "Développement",
      description: "Tout sur le codage et les langages de programmation."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Bases de données",
      description: "Gestion et conception de bases de données."
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud Computing",
      description: "Services et solutions cloud pour les entreprises."
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Intelligence Artificielle",
      description: "Les dernières avancées en IA et apprentissage automatique."
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Développement Mobile",
      description: "Création d'applications pour smartphones et tablettes."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Réseaux",
      description: "Fonctionnement et sécurité des réseaux informatiques."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-12">Catégories</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              icon={category.icon}
              title={category.title}
              description={category.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
