// pages/article/[slug].js (Page article détaillé)
import Header from '../../components/Header';
import { Heart, MessageCircle } from 'lucide-react';

export default function ArticleDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-gray-700">Accueil</a>
          <span className="mx-2">/</span>
          <a href="/articles" className="hover:text-gray-700">Articles</a>
        </nav>

        {/* Article Header */}
        <div className="bg-white rounded-lg overflow-hidden mb-8">
          <div className="h-80 bg-gradient-to-r from-teal-400 to-teal-600 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl font-bold text-white mb-4">
                L'avenir de l'IA : Tendances et impacts sur l'industrie
              </h1>
              <div className="flex items-center text-white text-sm space-x-4">
                <span>Publié par Sophie Martin</span>
                <span>•</span>
                <span>15 mai 2024</span>
                <span>•</span>
                <span>12 min de lecture</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="prose prose-gray max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                L'intelligence artificielle (IA) est en train de remodeler le paysage technologique à un rythme sans précédent. De l'automatisation des tâches routinières à la création de solutions innovantes, l'IA a le potentiel de transformer radicalement de nombreux secteurs. Cet article explore les tendances actuelles de l'IA et leurs impacts potentiels sur l'industrie.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Tendances actuelles de l'IA
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Plusieurs tendances clés façonnent le développement de l'IA aujourd'hui. L'apprentissage automatique (machine learning) permet aux systèmes d'apprendre à partir de données sans être explicitement programmés. L'apprentissage profond (deep learning), une sous-catégorie de l'apprentissage automatique, utilise des réseaux de neurones artificiels pour analyser des données complexes. Le traitement du langage naturel (NLP) permet aux machines de comprendre et de générer du langage humain. Enfin, la vision par ordinateur permet aux systèmes de "voir" et d'interpréter des images et des vidéos.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Impacts sur l'industrie
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                L'IA a des implications majeures pour de nombreux secteurs. Dans la santé, elle peut aider à diagnostiquer des maladies, à développer de nouveaux traitements et à personnaliser les soins aux patients. Dans la finance, l'IA peut être utilisée pour la détection de fraude, la gestion des risques et le trading algorithmique. Dans le commerce de détail, elle peut améliorer l'expérience client, optimiser les chaînes d'approvisionnement et prédire les tendances du marché. L'IA a également un impact sur la fabrication, les transports, l'agriculture et bien d'autres domaines.
              </p>
            </div>

            {/* Article Actions */}
            <div className="flex items-center space-x-6 mt-8 pt-6 border-t border-gray-200">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                <Heart className="w-5 h-5" />
                <span>125</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                <MessageCircle className="w-5 h-5" />
                <span>32</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Commentaires</h3>
          
          <div className="space-y-6">
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">Jean Dupont</span>
                  <span className="text-sm text-gray-500">2 jours</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Excellent article, Sophie ! J'ai particulièrement apprécié la clarté avec laquelle vous avez expliqué les différentes tendances de l'IA.
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-gray-900">Marie Dubois</span>
                  <span className="text-sm text-gray-500">1 jour</span>
                </div>
                <p className="text-gray-700 text-sm">
                  Merci pour cet aperçu complet. Je suis curieuse de voir comment l'IA va continuer à évoluer dans les années à venir.
                </p>
              </div>
            </div>

            {/* Add Comment */}
            <div className="flex space-x-4 mt-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex-shrink-0"></div>
              <div className="flex-1">
                <textarea
                  placeholder="Ajouter un commentaire..."
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
                  rows="3"
                ></textarea>
                <div className="flex justify-end mt-3">
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}