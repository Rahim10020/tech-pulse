import Link from "next/link";

export default function CategoryCard({ icon, title, description, href }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg h-full border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group-hover:border-gray-300">
        {/* Icône en haut */}
        <div className="mb-4">
          <div className="text-gray-700">
            {icon}
          </div>
        </div>

        {/* Titre - Changé pour utiliser h4-title */}
        <h3 className="h4-title text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
          {title}
        </h3>

        {/* Description - Changé pour utiliser small-text */}
        <p className="small-text text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}