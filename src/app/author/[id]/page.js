// pages/author/[id].js (Page auteur)
import Header from '../../components/Header';
import AuthorProfile from '../../components/AuthorProfile';
import ArticleCard from '../../components/ArticleCard';

export default function AuthorPage() {
  const authorArticles = [
    {
      title: "Les dernières tendances en matière de cybersécurité",
      description: "Un aperçu des menaces émergentes et des meilleures pratiques pour protéger vos données.",
      readTime: "10 min de lecture",
      imageColor: "bg-orange-100"
    },
    {
      title: "L'avenir du travail à distance : outils et techniques",
      description: "Explorez les outils et les techniques qui rendent le travail à distance plus efficace et agréable.",
      readTime: "8 min de lecture",
      imageColor: "bg-orange-100"
    },
    {
      title: "Guide complet de l'apprentissage automatique pour les débutants",
      description: "Un guide détaillé pour comprendre les bases de l'apprentissage automatique et ses applications.",
      readTime: "12 min de lecture",
      imageColor: "bg-teal-100"
    },
    {
      title: "Les meilleurs langages de programmation à apprendre en 2024",
      description: "Une analyse des langages de programmation les plus demandés et de leur pertinence dans l'industrie.",
      readTime: "15 min de lecture",
      imageColor: "bg-teal-600"
    },
    {
      title: "Conseils pour optimiser votre présence en ligne en tant que développeur",
      description: "Des conseils pratiques pour améliorer votre visibilité et votre réputation en ligne en tant que développeur.",
      readTime: "7 min de lecture",
      imageColor: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Author Profile Sidebar */}
          <div className="md:col-span-1">
            <AuthorProfile
              name="Sophie Martin"
              username="sophiemartin"
              joinDate="Rejoindre en 2021"
              articles="120"
              subscribers="80"
              subscriptions="50"
            />
          </div>

          {/* Articles Content */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Articles</h2>
            <div className="space-y-6">
              {authorArticles.map((article, index) => (
                <ArticleCard
                  key={index}
                  title={article.title}
                  description={article.description}
                  readTime={article.readTime}
                  imageColor={article.imageColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}