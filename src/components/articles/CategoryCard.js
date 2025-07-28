// components/CategoryCard.js - Version mise à jour
export default function CategoryCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300 h-full">
        {/* Icône en haut */}
        <div className="mb-4">
          <div className="text-gray-700">
            {icon}
          </div>
        </div>
        
        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}